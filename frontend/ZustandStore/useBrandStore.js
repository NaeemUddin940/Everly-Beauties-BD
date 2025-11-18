import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";
import { create } from "zustand";
export const useBrandStore = create((set, get) => ({
  allBrands: null,

  createBrand: async (data) => {
    try {
      console.log(data);
      const res = await axiosInstance.post("/brand/create", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

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

  deleteBrand: async (id) => {
    try {
      const res = await axiosInstance.delete(`/brand/delete/${id}`);
      console.log(res);
      if (res.data.success) {
        toast.success(res.data.message);
        await get().getAllBrands();
        set((state) => ({
          allBrands: {
            ...state.allBrands,
            allBrands: state.allBrands.allBrands.filter(
              (brand) => brand._id !== id
            ),
          },
        }));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error("Create Brand Error:", error);
    }
  },
}));
