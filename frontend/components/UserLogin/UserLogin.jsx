"use client";

import { useAuthStore } from "@/ZustandStore/useAuthStore";
import { Dialog } from "@headlessui/react";
import Image from "next/image";
import { useState } from "react";
import { LiaUser } from "react-icons/lia";
import { RiCloseLine } from "react-icons/ri";
import LoginForm from "./LoginForm";
import OtpForm from "./OtpForm";

const UserLogin = () => {
  const { authUser, isAuth, logout } = useAuthStore();

  const [wantLogin, setWantLogin] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [loginStep, setLoginStep] = useState("email");

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div className="text-black">
      {authUser ? (
        <div className="hidden md:flex items-center gap-2 cursor-pointer">
          <div className="border-2 border-gray-700 p-1.5 rounded-full text-xl">
            {isAuth ? (
              <Image
                src={authUser.image}
                alt={authUser.name}
                height={100}
                width={100}
              />
            ) : (
              <LiaUser />
            )}
          </div>
          <div>
            <p className="text-xs">{authUser.name}</p>
            <div className="flex gap-5">
              <button onClick={logout} className="text-[14px] font-semibold">
                Logout
              </button>
              <p className="text-[14px] font-semibold">{authUser.role}</p>
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={openModal}
          className="hidden md:flex items-center gap-2 cursor-pointer"
        >
          <div className="border-2 border-gray-700 p-1.5 rounded-full text-xl">
            <LiaUser />
          </div>
          <div>
            <p className="text-xs">Hello, Guest</p>
            <p className="text-[14px] font-semibold">Login / Register</p>
          </div>
        </div>
      )}

      <Dialog open={isOpen} onClose={closeModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded-xl bg-white overflow-hidden shadow-lg">
            <div className="relative p-6">
              <div className="flex items-center justify-between border-b border-pink-200 pb-2 mb-6">
                <h3 className="text-pink-500 font-semibold">
                  <button
                    onClick={() => {
                      setWantLogin((prev) => !prev);
                      setLoginStep("email");
                    }}
                    className="cursor-pointer hover:underline"
                  >
                    LOGIN
                  </button>{" "}
                  /{" "}
                  <button
                    onClick={() => {
                      setWantLogin((prev) => !prev);
                      setLoginStep("email");
                    }}
                    className="cursor-pointer hover:underline"
                  >
                    SIGN UP
                  </button>
                </h3>
                <RiCloseLine
                  onClick={closeModal}
                  className="text-xl text-gray-500 hover:text-red-500 cursor-pointer"
                />
              </div>
              {loginStep === "email" && (
                <LoginForm
                  wantLogin={wantLogin}
                  closeModal={closeModal}
                  setWantLogin={setWantLogin}
                  setLoginStep={setLoginStep}
                />
              )}
              {loginStep === "otp" && <OtpForm setLoginStep={setLoginStep} />}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default UserLogin;
