import { useAuthStore } from "@/ZustandStore/useAuthStore";

import { useRef, useState } from "react";
import toast from "react-hot-toast";

const OtpForm = ({ setLoginStep }) => {
  const { verifyOtp, againSentOpt } = useAuthStore();
  const [otp, setOtp] = useState(new Array(6).fill(""));

  const inputRefs = useRef([]);

  const email = localStorage.getItem("email");

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.value !== "" && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      inputRefs.current[index - 1].focus();
    }
  };

  const fullOtp = otp.join("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (fullOtp.length === 6) {
      await verifyOtp({ email, otp: fullOtp });

      setLoginStep("email");
    } else {
      toast.info("Please enter the full 6-digit OTP.");
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="text-center">
        <p className="text-gray-700 mb-2">
          Enter the 6-digit OTP sent to your phone.
        </p>
        <p className="text-pink-500 font-semibold">Time: jasd</p>
      </div>
      <div className="flex justify-between space-x-2 mb-6">
        {otp.map((data, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            maxLength={1}
            // value: নির্দিষ্ট ইন্ডেক্সের মান
            value={data}
            onChange={(e) => handleChange(e.target, index)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="w-12 text-black h-12 text-center border-b-2 border-gray-700 focus:border-pink-500 focus:outline-none text-lg"
          />
        ))}
      </div>
      <div className="flex space-x-4">
        <button
          type="button"
          onClick={() => againSentOpt({ email })}
          className="flex-1 border cursor-pointer border-pink-500 text-pink-500 py-3 rounded-lg hover:bg-blue-50 transition"
          // disabled={timer > 0}
        >
          Resend OTP
        </button>
        <button
          type="submit"
          disabled={fullOtp.length < 6} // OTP পূরণ না হওয়া পর্যন্ত বাটন disabled থাকবে
          className={`cursor-pointer flex-1 bg-linear-to-r from-[#FF8C67] to-pink-400 text-white py-3 rounded-lg transition flex items-center justify-center 
            ${
              fullOtp.length < 6
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-pink-600"
            }`}
        >
          Verify OTP
        </button>
      </div>
      {/* যদি আপনি সম্পূর্ণ OTP স্ট্রিংটি দেখতে চান:
        <p className="mt-4">Current OTP: {fullOtp}</p> 
      */}
    </form>
  );
};

export default OtpForm;
