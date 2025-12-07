import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useComboProductStore = create((set) => ({
  allComboProducts: [],

  getAllComboProduct: async (data) => {
    try {
      const res = await axiosInstance.post(`/combo/product/create`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(res);
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
