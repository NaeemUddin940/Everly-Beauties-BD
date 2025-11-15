import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";

// Access other state/actions via get (getState)
export const useCategoryStore = create((set, get) => ({
  mainCategory: [],
  getAllCategory: null,
  isUploading: false,

  createMainCategory: async (data) => {
    set({ isUploading: true });

    try {
      await axiosInstance.post("/category/create-main-category", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await get().getCategory();

      set({ isUploading: false });
    } catch (error) {
      set({ isUploading: false });
      console.error("Failed to Create Main Category:", error);
    }
  },

  // --- Sub Category Creation ---
  createSubCategory: async (data) => {
    try {
      const res = await axiosInstance.post(
        "/category/create-sub-category",
        data
      );
      console.log(res);

      await get().getCategory();
    } catch (error) {
      console.error("Failed to Create Child Category:", error);
    }
  },

  // --- Category Fetching ---
  getCategory: async () => {
    try {
      const res = await axiosInstance.get("category/get-all-category");

      set({ getAllCategory: res.data.mainCategories });
    } catch (error) {
      console.error("Failed to Get All Categories :", error);
    }
  },
}));
