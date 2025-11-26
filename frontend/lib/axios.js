import axios from "axios";
export const api = process.env.NEXT_PUBLIC_API_BASE_URL;

export const axiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === "development" ? `${api}/api` : `${api}/api`,
  withCredentials: true,
});
