"use client";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface LoginFormProps {
  wantLogin: boolean;
}

const LoginForm = ({ wantLogin }: LoginFormProps) => {
  return (
    <>
      <form className="space-y-4">
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
            className="w-full text-black bg-white py-1 px-2 mt-1 focus:ring-1 border border-black rounded-md"
            required
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          className="w-full cursor-pointer bg-linear-to-r from-[#FF8C67] to-pink-400 text-white py-3 rounded-lg hover:bg-pink-600 transition font-medium"
        >
          Register
        </button>
      </form>
    </>
  );
};

export default LoginForm;
