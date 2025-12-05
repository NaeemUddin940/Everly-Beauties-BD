import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useVariableProduct = create((set) => ({
  variableProducts: [],
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
      console.log(res);
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
}));
