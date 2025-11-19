import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useTagStore = create((set, get) => ({
  allTags: null,
  singleTag: null,

  createTag: async (data) => {
    try {
      const res = await axiosInstance.post("/tag/create", data);
      console.log(res);
      if (res.data.success) {
        toast.success(res.data.message);
        set({ allTags: res.data.newTag });
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.error("Create Tag Error:", error);
    }
  },

  getAllTags: async () => {
    try {
      const res = await axiosInstance.get("/tag/get");

      if (res.data.success) {
        set({ allTags: res.data });
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.error("Create Tag Error:", error);
    }
  },

  deleteTag: async (id) => {
    try {
      const res = await axiosInstance.delete(`/tag/delete/${id}`);

      if (res.data.success) {
        toast.success(res.data.message);
        await get().getAllTags();

        set((state) => ({
          allTags: {
            ...state.allTags,
            allTags: state.allTags.allTags.filter((tag) => tag._id !== id),
          },
        }));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error("Create Tag Error:", error);
    }
  },

  updateTag: async (data, id) => {
    try {
      const res = await axiosInstance.put(`/tag/update/${id}`, data);

      if (res.data.success) {
        toast.success(res.data.message);
        set({ allTags: res.data.updateTag });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error("Create Tag Error:", error);
    }
  },

  getSingleTag: async (id) => {
    try {
      const res = await axiosInstance.get(`/tag/get-single-tag/${id}`);

      if (res.data.success) {
        set({ singleTag: res.data.singleTag });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error("Get Single Tag Error:", error);
    }
  },
}));
