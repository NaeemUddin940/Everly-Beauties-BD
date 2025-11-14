import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useHeroSliderStore = create((set) => ({
  allSlides: [],
  isUploading: false,

  // 🟢 Add a new slider
  addSlider: async (payload) => {
    set({ isUploading: true });
    try {
      const res = await axiosInstance.post("/admin/heroslider/add", payload);
      // ✅ Add newly created slide to the existing array
      // set((state) => ({
      //   allSlides: [...state.allSlides, res.data.slider],
      // }));

      if (res.data.success) {
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
      set({ isUploading: false });
    } catch (error) {
      console.error("❌ Failed to Add Slide:", error);
      set({ isUploading: false });
    }
  },

  // 🟢 Get all sliders
  getAllSlides: async () => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get("/admin/heroslider/get");
      set({ allSlides: res.data.slides || [], isLoading: false });
    } catch (error) {
      console.error("❌ Failed to Get All Slides:", error);
      set({ isLoading: false });
    }
  },

  // 🟢 Delete a slide by ID
  deleteSlide: async (id) => {
    try {
      const res = await axiosInstance.delete(`/admin/heroslider/delete/${id}`);
      if (res.data.success) {
        set((state) => ({
          allSlides: state.allSlides.filter((slide) => slide._id !== id),
        }));
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("❌ Failed to Delete Slide:", error);
    }
  },
}));
