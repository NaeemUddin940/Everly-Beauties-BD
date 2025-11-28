import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";
import { create } from "zustand";

// Access other state/actions via get (getState)
export const useCategoryStore = create((set, get) => ({
  singleSubCategory: null,
  singleMainCategory: null,
  getCategory: null,
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

      if (res.data.success) {
        toast.success(res.data.message);

        // ❗❗ শুধু refresh করো — কিছু overwrite কোরো না
        const { page, limit } = get();
        await get().getCategory(page, limit);

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
  getAllCategory: async (page = 1, limit = 10) => {
    try {
      const res = await axiosInstance.get(
        `/category/get-all-category?page=${page}&limit=${limit}`
      );

      set({
        getCategory: res.data,
      });
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
        set((state) => ({
          getAllCategory: {
            ...state.getAllCategory,
            allCategories: state.getAllCategory.categories.filter(
              (cat) => cat._id !== id
            ),
          },
        }));
      }
      await get().getCategory();
    } catch (error) {
      toast.error(error?.response?.data?.message);
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

  updateMainCategory: async (data, id) => {
    try {
      const res = await axiosInstance.put(
        `/category/update-main-category/${id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        set({ getAllCategory: res.data });
        await get().getCategory();
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.error("Failed to Update Main Category:", error);
    }
  },

  updateSubCategory: async (data, id) => {
    try {
      const res = await axiosInstance.put(
        `/category/update-sub-category/${id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        await get().getCategory();
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.error("Failed to Update Sub Category:", error);
    }
  },

  getMainSingleCategory: async (id) => {
    try {
      const res = await axiosInstance.get(
        `/category/single-main-category/${id}`
      );

      set({ singleMainCategory: res.data.mainSingleCategory });
    } catch (error) {
      console.error("Failed to Update Main Category:", error);
    }
  },

  getSubSingleCategory: async (id) => {
    try {
      // console.log("id", id);
      const res = await axiosInstance.get(
        `/category/single-sub-category/${id}`
      );

      set({ singleSubCategory: res.data.subSingleCategory });
    } catch (error) {
      console.error("Failed to Get Single Sub Category:", error);
    }
  },
}));
