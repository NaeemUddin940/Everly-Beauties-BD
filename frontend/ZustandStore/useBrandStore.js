import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";
import { create } from "zustand";
export const useBrandStore = create((set) => ({
  allBrands: null,

  createBrand: async (data) => {
    try {
      console.log(data);
      const res = await axiosInstance.post("/brand/create", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(res);
      if (res.data.success) {
        toast.success(res.data.message);
        set({ allBrands: res.data.newBrand });
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.error("Create Brand Error:", error);
    }
  },

  getAllBrands: async () => {
    try {
      const res = await axiosInstance.get("/brand/get");

      if (res.data.success) {
        set({ allBrands: res.data });
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.error("Create Brand Error:", error);
    }
  },
}));
