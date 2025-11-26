import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useSimpleProductStore = create((set) => ({
  allSimpleProduct: null,
  singleSimpleProduct: null,

  createSimpleProduct: async (data) => {
    try {
      const res = await axiosInstance.post("/product/create-product", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(res);
      if (res.data.success) {
        toast.success(res.data.message);
        set({ allSimpleProduct: res.data.newSimpleProduct });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error("Create Simple Product Error:", error);
    }
  },
}));
