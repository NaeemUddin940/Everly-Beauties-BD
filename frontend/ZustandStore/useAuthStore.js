import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: false,
  isLoading: false,

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get("/user/check-login");
      console.log(res);
      set({ authUser: res.data });
      set({ isCheckingAuth: false });
    } catch (error) {
      console.error("Error in auth Check:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // ======= Signup ========
  signup: async (data) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post("/user/register", data, {
        withCredentials: true,
      });

      localStorage.setItem("email", res.data.email);
      set({ authUser: res.data, isCheckingAuth: true });
      if (res.data.success) {
        toast.success(res.data.message);
        set({ authUser: res.data.user, isCheckingAuth: true });
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Failed to Sign Up:", error);
      const msg =
        error.response?.data?.message || error.response?.data?.errors?.[0];
      toast.error(msg);
    } finally {
      set({ isLoading: false });
    }
  },

  // ---------- Login ----------
  login: async (data) => {
    set({ isLoading: true });

    try {
      const res = await axiosInstance.post("/user/login", data, {
        withCredentials: true,
      });

      set({ authUser: res.data }); // ✅ fix
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      set({ authUser: null });
      console.error("Failed to Login:", error);
      const msg =
        error.response?.data?.message || error.response?.data?.errors?.[0];
      toast.error(msg);
    } finally {
      set({ isLoading: false });
    }
  },
  // Log out
  logout: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/user/logout", {
        withCredentials: true, // ✅ important if using cookies/session
      });
      set({ authUser: null });
      localStorage.removeItem("token");

      toast.success(res.data.message);
    } catch (error) {
      console.error("Error in Log Out", error);
      const msg =
        error.response?.data?.message || error.response?.data?.errors[0];
      toast.error(msg);
    } finally {
      set({ isLoading: false });
    }
  },

  verifyOtp: async (data) => {
    try {
      const res = await axiosInstance.post("/user/verify-email", data);
      if (res.data.success) {
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Failed to Verify OTP: ", error);
    }
  },

  againSentOpt: async (email) => {
    try {
      const res = await axiosInstance.post("/user/send-otp-again", email);

      if (res.data.success) {
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Failed to Sent OTP :", error);
    }
  },
}));
