import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";
import { create } from "zustand";
export const useBrandStore = create((set, get) => ({
  allBrands: null,
  singleBrand: null,

  createBrand: async (data) => {
    try {
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

  getAllBrands: async (page = 1, limit = 1) => {
    try {
      const res = await axiosInstance.get(
        `/brand/get?page=${page}&limit=${limit}`
      );

      if (res.data.success) {
        set({ allBrands: res.data });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error("Create Brand Error:", error);
    }
  },

  deleteBrand: async (id) => {
    try {
      const res = await axiosInstance.delete(`/brand/delete/${id}`);

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

  updateBrand: async (data, id) => {
    try {
      const res = await axiosInstance.put(`/brand/update/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        toast.success(res.data.message);
        set({ allBrands: res.data.updateBrand });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error("Update Brand Error:", error);
    }
  },

  getSingleBrand: async (id) => {
    try {
      const res = await axiosInstance.get(`/brand/get-single-brand/${id}`);

      if (res.data.success) {
        set({ singleBrand: res.data.singleBrand });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error("Get Single Brand Error:", error);
    }
  },
}));
