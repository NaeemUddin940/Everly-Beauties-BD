"use client";
import { useAuthStore } from "@/ZustandStore/useAuthStore";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";

const LoginForm = ({ wantLogin, closeModal, setLoginStep }) => {
  const { register, handleSubmit, reset } = useForm();
  const { signup, isLoading, login, checkAuth } = useAuthStore();
  const router = useRouter();
  const onSubmit = async (data) => {
    const payload = {
      name: data.name,
      email: data.email,
      password: data.password,
    };

    if (wantLogin) {
      await signup(payload);
      setLoginStep("otp");
    } else {
      await login(payload);
      await checkAuth();
      closeModal();
      router.push("/");
    }
    reset();
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <DotLottieReact
          src="https://lottie.host/a670b150-5341-40df-b428-8f4665bdb5ea/cet8lwIE0W.lottie"
          loop
          autoplay
        />
        {wantLogin && (
          <div className="mb-3">
            <label htmlFor="name" className="text-black">
              Enter Your Name
            </label>
            <input
              id="name"
              type="text"
              {...register("name")}
              className="w-full text-black bg-white py-1 mt-1 px-2 focus:ring-1 border border-black rounded-md"
              required
              placeholder="Enter your name"
            />
          </div>
        )}
        <div className="mb-3">
          <label htmlFor="email" className="text-black">
            Enter Your Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className="w-full text-black bg-white py-1 mt-1 px-2 focus:ring-1 border border-black rounded-md"
            required
            placeholder="Enter your emai"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="text-black">
            Enter Your Password
          </label>
          <input
            id="password"
            type="password"
            {...register("password")}
            className="w-full text-black bg-white py-1 px-2 mt-1 focus:ring-1 border border-black rounded-md"
            required
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          className="w-full cursor-pointer flex items-center justify-center bg-linear-to-r from-[#FF8C67] to-pink-400 text-white py-3 rounded-lg hover:bg-pink-600 transition font-medium"
        >
          {isLoading ? (
            <Loader className="animate-spin text-center" />
          ) : !wantLogin ? (
            "Login"
          ) : (
            "Register"
          )}
        </button>
        <button
          onClick={() => setLoginStep("otp")}
          className="text-black cursor-pointer flex items-center text-sm hover:text-pink-500 hover:underline justify-center w-full"
        >
          <span>Verify OTP</span>
        </button>
      </form>
    </>
  );
};

export default LoginForm;
