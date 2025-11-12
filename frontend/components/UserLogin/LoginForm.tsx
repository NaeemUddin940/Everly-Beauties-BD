import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import React from 'react'

interface LoginFormProps {
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  handleSendOTP: (e: React.FormEvent<HTMLFormElement>) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  phoneNumber,
  setPhoneNumber,
  handleSendOTP,
}) => {
  return (
    <>
      <form onSubmit={handleSendOTP} className="space-y-4">
        <DotLottieReact
          src="https://lottie.host/a670b150-5341-40df-b428-8f4665bdb5ea/cet8lwIE0W.lottie"
          loop
          autoplay
        />
        <fieldset className="fieldset mb-0">
          <legend className="fieldset-legend text-black">
            Login with Phone Number
          </legend>
          <label className="input validator w-full">
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
            >
              <g fill="none">
                <path
                  d="M7.25 11.5C6.83579 11.5 6.5 11.8358 6.5 12.25C6.5 12.6642 6.83579 13 7.25 13H8.75C9.16421 13 9.5 12.6642 9.5 12.25C9.5 11.8358 9.16421 11.5 8.75 11.5H7.25Z"
                  fill="currentColor"
                ></path>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6 1C4.61929 1 3.5 2.11929 3.5 3.5V12.5C3.5 13.8807 4.61929 15 6 15H10C11.3807 15 12.5 13.8807 12.5 12.5V3.5C12.5 2.11929 11.3807 1 10 1H6ZM10 2.5H9.5V3C9.5 3.27614 9.27614 3.5 9 3.5H7C6.72386 3.5 6.5 3.27614 6.5 3V2.5H6C5.44771 2.5 5 2.94772 5 3.5V12.5C5 13.0523 5.44772 13.5 6 13.5H10C10.5523 13.5 11 13.0523 11 12.5V3.5C11 2.94772 10.5523 2.5 10 2.5Z"
                  fill="currentColor"
                ></path>
              </g>
            </svg>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full text-black bg-white p-3 tabular-nums"
              required
              placeholder="017xxxxxxxx"
              pattern="[0-9]*"
              minLength={11}
              maxLength={11}
              title="Must be 10 digits"
            />
          </label>
          <p className="validator-hint mt-0">Must be 11 digits</p>
        </fieldset>
        <button
          type="submit"
          className="w-full cursor-pointer bg-gradient-to-r from-[#FF8C67] to-pink-400 text-white py-3 rounded-lg hover:bg-pink-600 transition font-medium"
        >
          Send OTP
        </button>
      </form>
    </>
  )
}

export default LoginForm