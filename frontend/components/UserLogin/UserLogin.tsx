// index.tsx
"use client";

import { Dialog } from "@headlessui/react";
import { useRef, useState } from "react";
import { LiaUser } from "react-icons/lia";
import { RiCloseLine } from "react-icons/ri";

import { useAuth } from "../context/AuthContext";
import LoginForm from "./LoginForm";
import OtpForm from "./OtpForm";

const UserLogin = () => {
  const { login, user, logout } = useAuth();
  // const { setLoading } = useLoading();
  const [wantLogin, setWantLogin] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [loginStep, setLoginStep] = useState("phone");
  const [timer, setTimer] = useState(120);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpValues, setOtpValues] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [username, setUsername] = useState("");
  const [userExists, setUserExists] = useState<boolean | null>(null);
  const otpInputRefs = useRef<HTMLInputElement[]>([]);

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div className="text-black">
      {user ? (
        <div className="hidden md:flex items-center gap-2 cursor-pointer">
          <div className="border-2 border-gray-700 p-1.5 rounded-full text-xl">
            <LiaUser />
          </div>
          <div>
            <p className="text-[15px]">{user.name}</p>
            <p onClick={logout} className="text-[14px] font-[600]">
              Logout
            </p>
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
            <p className="text-[14px] font-[600]">Login / Register</p>
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
                    onClick={() => setWantLogin((prev) => !prev)}
                    className="cursor-pointer hover:underline"
                  >
                    LOGIN
                  </button>{" "}
                  /{" "}
                  <button
                    onClick={() => setWantLogin((prev) => !prev)}
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
              {loginStep === "phone" && (
                <LoginForm wantLogin={wantLogin} setWantLogin={setWantLogin} />
              )}
              {loginStep === "otp" && (
                <OtpForm
                // timer={timer}
                // otpValues={otpValues}
                // setOtpValues={setOtpValues}
                // otpInputRefs={otpInputRefs}
                // handleVerifyOTP={handleVerifyOTP}
                // handleResendOTP={() => setTimer(0)}
                // formatTime={formatTime}
                // handleOtpChange={handleOtpChange}
                // handleKeyDown={handleKeyDown}
                />
              )}
              {/* {loginStep === "username" && (
                <UsernameForm
                  // username={username}
                  // setUsername={setUsername}
                  // handleRegister={handleRegister}
                />
              )} */}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default UserLogin;
