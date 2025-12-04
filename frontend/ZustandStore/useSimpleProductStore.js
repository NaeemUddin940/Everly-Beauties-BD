import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useSimpleProductStore = create((set, get) => ({
  // Initialize as empty array to avoid iterable issues
  allSimpleProduct: [],
  singleSimpleProduct: null,
  isLoading: false,
  isError: false,

  // CREATE PRODUCT
  createSimpleProduct: async (data) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post("/product/create-product", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        toast.success(res.data.message);
        set({ isLoading: false });

        // Add newly created product to the existing array
        // ... state update logic ...
      }

      // ✅ FIX: getAllSimpleProduct কলটিকে try...catch এর বাইরে নিয়ে যান বা এটিকেও সুরক্ষিত করুন।
      try {
        await get().getAllSimpleProduct();
      } catch (refreshError) {
        // রিফ্রেশ এরর হলে শুধুমাত্র কনসোলে লগ করুন, টোস্ট দেখাবেন না
        console.error("Failed to refresh product list:", refreshError);
      }
    } catch (error) {
      // ❌ মূল createProduct এরর হলে তবেই টোস্ট দেখান
      set({ isLoading: false });
      toast.error(error?.response?.data?.message || "Product creation failed."); // ডিফল্ট মেসেজ দিন
      console.error("Create Simple Product Error:", error);
    }
  },

  // GET ALL PRODUCTS
  getAllSimpleProduct: async (delay) => {
    set({ isLoading: true, isError: false });
    try {
      const res = await axiosInstance.get("/product/get-all-simple-product");
      // artificial delay: 1 second (1000ms)
      if (delay) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
      if (res.data.success) {
        // Assign only the array, not the whole response object
        set({
          isLoading: false,
          allSimpleProduct: res.data || [],
          isError: false,
        });
      } else {
        // In case success is false
        set({ allSimpleProduct: [], isLoading: false, isError: true });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch products");
      console.error("Get All Simple Products Error:", error);
      set({ isLoading: false, isError: true });
    }
  },

  // DELETE PRODUCT
  deleteSimpleProduct: async (productId) => {
    try {
      const res = await axiosInstance.delete(
        `/product/delete-product/${productId}`
      );

      if (res.data.success) {
        toast.success(res.data.message);

        // ✅ সমাধান: নতুন ফিল্টার করা অ্যারেটিকে 'simpleProducts' প্রপার্টির মধ্যে রাখুন
        set((state) => {
          // 1. নতুন ফিল্টার করা অ্যারে তৈরি করুন
          const updatedProducts = (
            state.allSimpleProduct.simpleProducts || []
          ).filter((product) => product._id !== productId);

          // 2. allSimpleProduct অবজেক্টের স্ট্রাকচার বজায় রেখে সেটি আপডেট করুন
          return {
            allSimpleProduct: {
              ...state.allSimpleProduct, // pagination, metadata, ইত্যাদি ধরে রাখুন
              simpleProducts: updatedProducts, // শুধুমাত্র প্রোডাক্টের অ্যারে আপডেট করুন
            },
          };
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Delete product failed");
      console.error("Delete Simple Product Error:", error);
    }
  },

  getSingleSimpleProduct: async (slug) => {
    set({ isLoading: true, isError: false });
    try {
      const res = await axiosInstance.get(
        `/product/get-single-simple-product/${slug}`
      );

      if (res.data.success) {
        set({
          singleSimpleProduct: res.data.singleProduct,
          isLoading: false,
          isError: false,
        });
      } else {
        set({ singleSimpleProduct: null, isLoading: false, isError: true });
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to fetch product details"
      );
      console.error("Get Single Simple Product Error:", error);
      set({ isLoading: false, isError: true });
    }
  },

  getSingleSimpleProductBySlug: async (slug) => {
    set({ isLoading: true, isError: false });
    try {
      const res = await axiosInstance.get(
        `/product/get-single-simple-product-by-slug/${slug}`
      );

      if (res.data.success) {
        set({
          singleSimpleProduct: res.data.singleProduct,
          isLoading: false,
          isError: false,
        });
      } else {
        set({ singleSimpleProduct: null, isLoading: false, isError: true });
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to fetch product details"
      );
      console.error("Get Single Simple Product Error:", error);
      set({ isLoading: false, isError: true });
    }
  },

  // UPDATE PRODUCT
  updateSimpleProduct: async (productId, data) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.put(
        `/product/update-product/${productId}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        set({ isLoading: false });

        // Update the product in the existing array
        set((state) => ({
          allSimpleProduct: (state.allSimpleProduct.simpleProducts || []).map(
            (product) =>
              product._id === productId ? res.data.updatedProduct : product
          ),
        }));
      }

      // Optionally refresh all products (depends on your logic)
      await get().getAllSimpleProduct();
    } catch (error) {
      set({ isLoading: false });
      toast.error(error?.response?.data?.message);
      console.error("Update Simple Product Error:", error);
    }
  },
}));
