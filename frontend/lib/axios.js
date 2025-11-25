import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:8000/api"
      : `${process.env.NEXT_PUBLIC_API_BASE_URL || "/api"}`,
  withCredentials: true,
});
