import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";
import { create } from "zustand";
export const useScreenSolutionStore = create((set, get) => ({
  allScreenSolution: null,
  singleScreenSolution: null,

  createScreenSolution: async (data) => {
    try {
      const res = await axiosInstance.post("/screenSolution/create", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        toast.success(res.data.message);
        set({ allScreenSolution: res.data.newScreenSolution });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error("Create Screen Solution Error:", error);
    }
  },

  updateScreenSolution: async (data, id) => {
    try {
      const res = await axiosInstance.put(
        `/screenSolution/update/${id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        set({ allScreenSolution: res.data.updateScreenSolution });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error("Update Screen Solution Error:", error);
    }
  },

  getAllScreenSolution: async (page, limit = 5) => {
    try {
      const res = await axiosInstance.get(
        `/screenSolution/get?page=${page}&limit=${limit}`
      );

      if (res.data.success) {
        set({ allScreenSolution: res.data });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error("Get Screen Solution Error:", error);
    }
  },

  getSingleScreenSolution: async (id) => {
    try {
      const res = await axiosInstance.get(
        `/screenSolution/get-single-solution/${id}`
      );

      if (res.data.success) {
        set({ singleScreenSolution: res.data.singleSolution });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error("Get Single Screen Solution Error:", error);
    }
  },

  deleteScreenSolution: async (id) => {
    try {
      const res = await axiosInstance.delete(`/screenSolution/delete/${id}`);
      if (res.data.success) {
        toast.success(res.data.message);
        await get().getAllScreenSolution();
        set((state) => ({
          allScreenSolution: {
            ...state.allScreenSolution,
            allScreenSolution: state.allScreenSolution.allScreenSolution.filter(
              (solution) => solution._id !== id
            ),
          },
        }));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error("Delete Screen Solution Error:", error);
    }
  },
}));
