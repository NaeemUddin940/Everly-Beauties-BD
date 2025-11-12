import React from "react";

interface OtpFormProps {
  timer: number;
  otpValues: string[];
  setOtpValues: React.Dispatch<React.SetStateAction<string[]>>;
  otpInputRefs: React.MutableRefObject<HTMLInputElement[]>;
  handleVerifyOTP: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleResendOTP: () => void;
  formatTime: (time: number) => string;
  handleOtpChange: (index: number, value: string) => void;
  handleKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const OtpForm: React.FC<OtpFormProps> = ({
  timer,
  otpValues,
  setOtpValues,
  otpInputRefs,
  handleVerifyOTP,
  handleResendOTP,
  formatTime,
  handleOtpChange,
  handleKeyDown,
}) => {
  return (
    <form onSubmit={handleVerifyOTP} className="space-y-6">
      <div className="text-center">
        <p className="text-gray-700 mb-2">
          Enter the 6-digit OTP sent to your phone.
        </p>
        <p className="text-pink-500 font-semibold">
          Time: {formatTime(timer)}
        </p>
      </div>
      <div className="flex justify-between space-x-2 mb-6">
        {otpValues.map((val, idx) => (
          <input
            key={idx}
            ref={(el) => {
              otpInputRefs.current[idx] = el!;
            }}
            type="text"
            maxLength={1}
            value={val}
            onChange={(e) => handleOtpChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            className="w-12 text-black h-12 text-center border-b-2 border-gray-300 focus:border-pink-500 focus:outline-none text-lg"
          />
        ))}
      </div>
      <div className="flex space-x-4">
        <button
          type="button"
          onClick={handleResendOTP}
          className="flex-1 border cursor-pointer border-pink-500 text-pink-500 py-3 rounded-lg hover:bg-blue-50 transition"
          disabled={timer > 0}
        >
          Resend OTP
        </button>
        <button
          type="submit"
          className="cursor-pointer flex-1 bg-gradient-to-r from-[#FF8C67] to-pink-400 text-white py-3 rounded-lg hover:bg-pink-600 transition flex items-center justify-center"
        >
          Verify OTP
        </button>
      </div>
    </form>
  );
};

export default OtpForm;