import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useVariableProductStore = create((set, get) => ({
  variableProducts: [],
  singleVariableProduct: null,
  isLoading: false,
  isError: false,

  // Create Variable Product
  createVariableProduct: async (data) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.post(`/variable/product/create`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Create Response:", res.data);

      if (res.data.success) {
        toast.success(res.data.message);
        // নতুন প্রোডাক্ট যোগ করুন
        set((state) => ({
          variableProducts: [...state.variableProducts, res.data.data],
          isLoading: false,
        }));
      } else {
        toast.error(res.data.message);
        set({ isLoading: false });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create product");
      console.error("Failed to Create Variable Product:", error);
      set({ isLoading: false, isError: true });
    }
  },

  // Get All Variable Products
  getVariableProduct: async () => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get("/variable/product/get");

      console.log("Get All Response:", res.data);

      // API রেসপন্সের স্ট্রাকচার অনুযায়ী স্টেট সেট করুন
      if (res.data.data && Array.isArray(res.data.data)) {
        set({ variableProducts: res.data.data, isLoading: false });
      } else if (res.data.data && res.data.data.variableProducts) {
        // যদি পেজিনেশন ডাটা থাকে
        set({
          variableProducts: res.data.data.variableProducts,
          isLoading: false,
        });
      } else {
        set({ variableProducts: [], isLoading: false });
      }
    } catch (error) {
      console.error("Failed to Get Variable Product:", error);
      set({ isLoading: false, isError: true });
    }
  },

  // Update Variable Product
  updateVariableProduct: async (id, data) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.put(
        `/variable/product/update/${id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Update Response:", res.data);

      if (res.data.success) {
        toast.success(res.data.message);

        // স্টেট আপডেট করুন
        set((state) => {
          const updatedProducts = state.variableProducts.map((product) =>
            product._id === id ? { ...product, ...res.data.data } : product
          );

          return {
            variableProducts: updatedProducts,
            singleVariableProduct: res.data.data, // সিঙ্গেল প্রোডাক্টও আপডেট করুন
            isLoading: false,
          };
        });

        return res.data.data; // আপডেট করা ডাটা রিটার্ন করুন
      } else {
        toast.error(res.data.message);
        set({ isLoading: false });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update product");
      console.error("Failed to Update Variable Product:", error);
      set({ isLoading: false, isError: true });
    }
  },

  // Get Single Variable Product by ID
  getSingleVariableProduct: async (slug) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get(`/variable/product/${slug}`);

      console.log("Get Single Response:", res.data);

      if (res.data.data) {
        set({ singleVariableProduct: res.data.data, isLoading: false });
      } else {
        set({ singleVariableProduct: null, isLoading: false });
        toast.error("Product not found");
      }
    } catch (error) {
      console.error("Failed to Get Variable Product by ID:", error);
      set({ isLoading: false, isError: true, singleVariableProduct: null });
      toast.error("Failed to fetch product details");
    }
  },

  // Delete Variable Product
  deleteVariableProduct: async (productId) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.delete(
        `/variable/product/delete/${productId}`
      );

      console.log("Delete Response:", res.data);

      if (res.data.success) {
        toast.success(res.data.message);

        // স্টেট থেকে প্রোডাক্ট রিমুভ করুন
        set((state) => {
          const updatedProducts = state.variableProducts.filter(
            (product) => product._id !== productId
          );

          // যদি সিঙ্গেল প্রোডাক্ট ডিলিট হয়, তাহলে null সেট করুন
          const updatedSingleProduct =
            state.singleVariableProduct &&
            state.singleVariableProduct._id === productId
              ? null
              : state.singleVariableProduct;

          return {
            variableProducts: updatedProducts,
            singleVariableProduct: updatedSingleProduct,
            isLoading: false,
          };
        });

        return true;
      } else {
        toast.error(res.data.message);
        set({ isLoading: false });
        return false;
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Delete product failed");
      console.error("Delete Variable Product Error:", error);
      set({ isLoading: false, isError: true });
      return false;
    }
  },

  // Clear Single Product Data
  clearSingleVariableProduct: () => {
    set({ singleVariableProduct: null });
  },

  // Reset Loading States
  resetError: () => {
    set({ isError: false });
  },
}));
