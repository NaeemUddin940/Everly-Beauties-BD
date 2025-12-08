import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useComboProductStore = create((set, get) => ({
  allComboProducts: [],
  singleComboProduct: null,
  isLoading: false,

  // CREATE
  createComboProduct: async (data) => {
    try {
      const res = await axiosInstance.post(`/combo/product/create`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success(res.data.message);
        // refresh list
        get().getAllComboProduct();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error("Failed to Create Combo Product:", error);
    }
  },

  // GET ALL COMBO PRODUCTS
  getAllComboProduct: async () => {
    try {
      const res = await axiosInstance.get(`/combo/product/get`);

      if (res.data.success) {
        set({ allComboProducts: res.data.comboProducts });
      } else {
        toast.error("Failed to load products");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error("Failed to get Combo Products:", error);
    }
  },

  // UPDATE
  updateComboProduct: async (productId, data) => {
    set({ isLoading: true });

    try {
      const res = await axiosInstance.put(
        `/combo/product/update/${productId}`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.data.success) {
        toast.success(res.data.message);

        // update in local state
        set((state) => ({
          allComboProducts: state.allComboProducts.map((product) =>
            product._id === productId ? res.data.updatedProduct : product
          ),
        }));
      }

      // Refresh list after update
      await get().getAllComboProduct();
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error("Update Combo Product Error:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  // GET SINGLE BY ID
  getComboProductById: async (productId) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(
        `/combo/product/getById/${productId}`
      );

      if (res.data.success) {
        set({ singleComboProduct: res.data.product, isLoading: false });
      } else {
        toast.error("Product not found");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      set({ isLoading: false });
      console.error("Get Combo Product By ID Error:", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
