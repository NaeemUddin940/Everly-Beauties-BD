import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useSimpleProductStore = create((set, get) => ({
  // Initialize as empty array to avoid iterable issues
  allSimpleProduct: [],
  singleSimpleProduct: null,
  isLoading: false,

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
        set((state) => ({
          allSimpleProduct: [
            ...(state.allSimpleProduct || []),
            res.data.product,
          ],
        }));
      }

      // Optionally refresh all products (depends on your logic)
      await get().getAllSimpleProduct();
    } catch (error) {
      set({ isLoading: false });
      toast.error(error?.response?.data?.message);
      console.error("Create Simple Product Error:", error);
    }
  },

  // GET ALL PRODUCTS
  getAllSimpleProduct: async (delay) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/product/get-all-simple-product");
      // artificial delay: 1 second (1000ms)
      if (delay) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
      if (res.data.success) {
        // Assign only the array, not the whole response object
        set({
          allSimpleProduct: res.data || [],
          isLoading: false,
        });
      } else {
        // In case success is false
        set({ allSimpleProduct: [], isLoading: false });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch products");
      console.error("Get All Simple Products Error:", error);
      set({ isLoading: false });
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

        // Remove the deleted product from the state safely
        set((state) => ({
          allSimpleProduct: (
            state.allSimpleProduct.simpleProducts || []
          ).filter((product) => product._id !== productId),
        }));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Delete product failed");
      console.error("Delete Simple Product Error:", error);
    }
  },
}));
