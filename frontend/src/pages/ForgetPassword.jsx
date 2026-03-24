import React, { useState } from "react";
import logo from "../assets/playtube1.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "./../App";
import { showCustomAlert } from "../components/CustomAlert";
import { ClipLoader } from "react-spinners";

function ForgetPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newpassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handelSendotp = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        serverUrl + "/api/auth/sendotp",
        { email },
        { withCredentials: true },
      );
      console.log(result.data);
      setStep(2);
      setLoading(false);
      showCustomAlert(result.data.message);
    } catch (error) {
      console.log(error);
      setLoading(false);
      showCustomAlert(`sendOtp error ${error}`);
    }
  };

  const handelVerifyOtp = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        serverUrl + "/api/auth/verfiyotp",
        { email, otp },
        { withCredentials: true },
      );

      console.log(result.data);
      setStep(3);
      setLoading(false);
      showCustomAlert(result.data.message);
    } catch (error) {
      setLoading(false);
      showCustomAlert(`verify otp error ${error}`);
    }
  };

  const handelResetPassword = async () => {
    setLoading(true);
    try {
      if (newpassword !== confirmPassword) {
        setLoading(false);
        showCustomAlert("password does not match");
      }

      const result = await axios.post(
        serverUrl + "/api/auth/resetpassword",
        {
          email,
          password: newpassword,
        },
        { withCredentials: true },
      );
      console.log(result.data);
      navigate("/signin");
      setLoading(false);
      showCustomAlert(result.data.message);
    } catch (error) {
      setLoading(false);
      showCustomAlert(`reset password error ${error}`);
    }
  };
  return (
    <div className="min-h-screen flex flex-col bg-[#202124] text-white ">
      <header className=" flex items-center gap-2 p-4 border-b border-gray-700">
        <img src={logo} className="w-8 h-8"></img>
        <span className="text-white font-bold text-xl tracking-tight font-roboto">
          PlayTube
        </span>
      </header>

      <main className="flex flex-1 items-center justify-center px-4">
        {step === 1 && (
          <div className="bg-[#171717] shoadow-lg rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-6">
              Forget your password
            </h2>

            {/* <from className="space-y-4" onSubmit={(e) => e.preventDefault()}> */}
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label
                  htmlFor="email "
                  className="block text-sm mb-1 text-gray-300 "
                >
                  Enter your email address
                </label>
                <input
                  type="text"
                  id="email"
                  className="mt-1 w-full px-4 py-3 border border-gray-600 rounded-md bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                ></input>
              </div>
              <button
                className="w-full bg-orange-600 hover:bg-orange-700 transition py-2 px-4 rounded-md font-medium"
                onClick={handelSendotp}
                disabled={loading}
              >
                {loading ? <ClipLoader color="black" size={20} /> : " Send OTP"}
              </button>
            </form>
            <div
              className="text-sm text-blue-400 text-center mt-4 cursor-pointer"
              onClick={() => navigate("/signin")}
            >
              Back to sign In
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="bg-[#171717] shoadow-lg rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-6">Enter OTP</h2>

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label
                  htmlFor="otp "
                  className="block text-sm mb-1 text-gray-300 "
                >
                  Please enter the 4-digit code sent to your email
                </label>
                <input
                  type="text"
                  id="otp"
                  className="mt-1 w-full px-4 py-3 border border-gray-600 rounded-md bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                  onChange={(e) => setOtp(e.target.value)}
                  value={otp}
                ></input>
              </div>
              <button
                className="w-full bg-orange-600 hover:bg-orange-700 transition py-2 px-4 rounded-md font-medium"
                onClick={handelVerifyOtp}
                disabled={loading}
              >
                {loading ? (
                  <ClipLoader color="black" size={20} />
                ) : (
                  "Verify OTP"
                )}
              </button>
            </form>
            <div
              className="text-sm text-blue-400 text-center mt-4 cursor-pointer"
              onClick={() => navigate("/signin")}
            >
              Back to sign In
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="bg-[#171717] shoadow-lg rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-6">Reset your password</h2>
            <p className="text-sm text-gray-400 mb-6">
              Enter a new password below to regain access to your account
            </p>

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label
                  htmlFor="newpass "
                  className="block text-sm mb-1 text-gray-300 "
                >
                  New password
                </label>
                <input
                  type="text"
                  id="newpass"
                  className="mt-1 w-full px-4 py-3 border border-gray-600 rounded-md bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                  onChange={(e) => setNewPassword(e.target.value)}
                  value={newpassword}
                ></input>

                <label
                  htmlFor="conpass "
                  className="block text-sm mb-1 text-gray-300  mt-5"
                >
                  Confirm password
                </label>
                <input
                  type="text"
                  id="conpass"
                  className="mt-1 w-full px-4 py-3 border border-gray-600 rounded-md bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-orange-500 "
                  required
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                ></input>
              </div>
              <button
                className="w-full bg-orange-600 hover:bg-orange-700 transition py-2 px-4 rounded-md font-medium"
                onClick={handelResetPassword}
                disabled={loading}
              >
                {loading ? (
                  <ClipLoader color="black" size={20} />
                ) : (
                  " Reset Password"
                )}
              </button>
            </form>
            <div
              className="text-sm text-blue-400 text-center mt-4 cursor-pointer"
              onClick={() => navigate("/signin")}
            >
              Back to sign In
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default ForgetPassword;
