import React from "react";

interface UsernameFormProps {
  username: string;
  setUsername: (value: string) => void;
  handleRegister: (e: React.FormEvent<HTMLFormElement>) => void;
}

const UsernameForm = () => {
  return (
    <form className="space-y-6">
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Enter your Username</legend>
        <label className="w-full input validator">
          <input
            type="text"
            // value={username}
            // onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3"
            placeholder="Username"
            pattern="[A-Za-z][A-Za-z0-9\-]*"
            // minLength={3}
            // maxLength={30}
            title="Only letters, numbers or dash"
            required
          />
        </label>
        <p className="validator-hint mt-0">
          Must be 3 to 30 characters and without special characters.
        </p>
      </fieldset>
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-[#FF8C67] to-pink-400 text-white py-3 rounded-lg hover:bg-pink-600 transition font-medium flex justify-center"
      >
        Continue & Register
      </button>
    </form>
  );
};

export default UsernameForm;
