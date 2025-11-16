import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";
import { create } from "zustand";

// Access other state/actions via get (getState)
export const useCategoryStore = create((set, get) => ({
  mainCategory: [],
  getAllCategory: null,
  isUploading: false,

  createMainCategory: async (data) => {
    set({ isUploading: true });

    try {
      const res = await axiosInstance.post(
        "/category/create-main-category",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(res);

      // 🟢 Success
      if (res.data.success) {
        toast.success(res.data.message);
        set({ getAllCategory: res.data.allCategories });
        await get().getCategory();
        set({ isUploading: false });
        return;
      }
    } catch (error) {
      set({ isUploading: false });
      toast.error(error.response.data.message);
      console.error("Create Main Category Error:", error);
    }
  },

  // --- Sub Category Creation ---
  createSubCategory: async (data) => {
    try {
      const res = await axiosInstance.post(
        "/category/create-sub-category",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(res);
      if (res.data.success) {
        toast.success(res.data.message);

        await get().getCategory();
        set({ isUploading: false });
        return;
      }
    } catch (error) {
      set({ isUploading: false });
      toast.error(error.response.data.message);
      console.error("Failed to Create Child Category:", error);
    }
  },

  // --- Category Fetching ---
  getCategory: async () => {
    try {
      const res = await axiosInstance.get("/category/get-all-category");

      set({ getAllCategory: res.data });
    } catch (error) {
      console.error("Failed to Get All Categories :", error);
    }
  },

  deleteMainCategory: async (id) => {
    try {
      const res = await axiosInstance.delete(
        `/category/delete-main-category/${id}`
      );

      if (res.data.success) {
        toast.success(res.data.message);
        await get().getCategory();
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.error("Failed to delete Main Category:", error);
    }
  },

  deleteSubCategory: async (id) => {
    try {
      const res = await axiosInstance.delete(
        `/category/delete-sub-category/${id}`
      );

      if (res.data.success) {
        toast.success(res.data.message);
        await get().getCategory();
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.error("Failed to delete Main Category:", error);
    }
  },
}));
