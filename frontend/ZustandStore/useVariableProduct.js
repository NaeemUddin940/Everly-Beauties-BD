import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useVariableProduct = create((set) => ({
  variableProducts: [],
  singleVariableProduct: null,
  isLoading: false,
  isError: false,

  createVariableProduct: async (data) => {
    try {
      const res = await axiosInstance.post(`/variable/product/create`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(res);
      //   set({ variableProducts: res.data.variableProduct });
      if (res.data.success) {
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error("Failed to Create Variable Product:", error);
    }
  },

  getVariableProduct: async () => {
    try {
      const res = await axiosInstance.get("/variable/product/get");

      set({ variableProducts: res.data.data });
    } catch (error) {
      console.error("Failed to Get Variable Product:", error);
    }
  },

  updateVariableProduct: async (data, id) => {
    try {
      const res = await axiosInstance.put(
        `/variable/product/update/${id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(res);
      //   set({ variableProducts: res.data.variableProduct });
      if (res.data.success) {
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error("Failed to Create Variable Product:", error);
    }
  },

  getVariableProductById: async (id) => {
    try {
      const res = await axiosInstance.get(`/variable/product/${id}`);

      set({ singleVariableProduct: res.data.data });
    } catch (error) {
      console.error("Failed to Get Variable Product:", error);
    }
  },

  deleteVariableProduct: async (productId) => {
    try {
      const res = await axiosInstance.delete(
        `/variable/product/delete/${productId}`
      );
      console.log(res);
      if (res.data.success) {
        toast.success(res.data.message);

        // ✅ সমাধান: নতুন ফিল্টার করা অ্যারেটিকে 'simpleProducts' প্রপার্টির মধ্যে রাখুন
        set((state) => {
          // 1. নতুন ফিল্টার করা অ্যারে তৈরি করুন
          const updatedProducts = (state.variableProducts.product || []).filter(
            (product) => product._id !== productId
          );

          // 2. allSimpleProduct অবজেক্টের স্ট্রাকচার বজায় রেখে সেটি আপডেট করুন
          return {
            variableProducts: {
              ...state.variableProducts, // pagination, metadata, ইত্যাদি ধরে রাখুন
              variableProducts: updatedProducts, // শুধুমাত্র প্রোডাক্টের অ্যারে আপডেট করুন
            },
          };
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Delete product failed");
      console.error("Delete Simple Product Error:", error);
    }
  },
}));
