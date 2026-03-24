import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import logo from "../assets/playtube1.png";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "./../App";
import { ClipLoader } from "react-spinners";
import { showCustomAlert } from "../components/CustomAlert";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

function Signup() {
  const [step, setStep] = useState(1);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [backendImage, setBackendImage] = useState(null);
  const [frontendImage, setFrontendImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handelImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handelNext = () => {
    if (step == 1) {
      if (!userName || !email) {
        showCustomAlert("Fill all the fields");
        return;
      }
    }

    if (step == 2) {
      if (!password || !confirmPassword) {
        showCustomAlert("Fill all the fields");
        return;
      }
      if (password !== confirmPassword) {
        showCustomAlert("Password does not match");
        return;
      }
    }

    setStep(step + 1);
  };

  const handelSignUp = async () => {
    if (!backendImage) {
      showCustomAlert("Please Choose profileImage");
    }
    setLoading(true);

    const formData = new FormData();
    formData.append("username", userName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("photoUrl", backendImage);
    try {
      const result = await axios.post(
        serverUrl + "/api/auth/signup",
        formData,
        { withCredentials: true },
      );
      console.log(result.data);
      dispatch(setUserData(result.data));
      navigate("/");
      setLoading(false);
      showCustomAlert("Account Created");
    } catch (e) {
      console.log(e);
      setLoading(false);
      showCustomAlert(e.response.data.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#181818]">
      <div className="bg-[#202124] rounded-2xl p-10 w-full max-w-md shadow-lg">
        <div className="flex items-center mb-6">
          <button
            className="text-gray-300 mr-3 hover:text-white"
            onClick={() => {
              if (step > 1) {
                setStep(step - 1);
              } else {
                navigate("/");
              }
            }}
          >
            <FaArrowLeft size={20} />
          </button>
          <span className="text-white text-2xl font-medium">
            Create Account
          </span>
        </div>

        {/* step1 */}

        {step == 1 && (
          <>
            <h1 className="text-3xl font-normal text-white mb-5 flex items-center gap-2">
              <img src={logo} alt="logo" className="w-8 h-8" />
              Basic info
            </h1>
            <input
              type="text"
              placeholder="Username"
              className="w-full bg-transparent border border-gray-500 rounded-md px-3 py-3 text-white focus:outline-none focus:border-orange-500 mb-4"
              onChange={(e) => setUserName(e.target.value)}
              value={userName}
            ></input>
            <input
              type="text"
              placeholder="Email"
              className="w-full bg-transparent border border-gray-500 rounded-md px-3 py-3 text-white focus:outline-none focus:border-orange-500 mb-4"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            ></input>
            <div className="flex justify-end mt-10">
              <button
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full"
                onClick={handelNext}
              >
                Next
              </button>
            </div>
          </>
        )}

        {step == 2 && (
          <>
            <h1 className="text-3xl font-normal text-white mb-5 flex items-center gap-2">
              <img src={logo} alt="logo" className="w-8 h-8" />
              Security
            </h1>
            <div className="flex items-center bg-[#3c4043] text-white px-3 py-2 rounded-full w-fit mb-6">
              <FaUserCircle className="mr-2 " size={20} />
              {email}
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full bg-transparent border border-gray-500 rounded-md px-3 py-3 text-white focus:outline-none focus:border-orange-500 mb-4"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            ></input>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm password"
              className="w-full bg-transparent border border-gray-500 rounded-md px-3 py-3 text-white focus:outline-none focus:border-orange-500 mb-4"
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
            ></input>
            <div className="flex items-center gap-2 mt-3">
              <input
                type="checkbox"
                id="showpass"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="cursor-pointer"
              />
              <label
                className="text-gray-300 cursor-pointer"
                htmlFor="showpass"
              >
                Show Password
              </label>
            </div>

            <div className="flex justify-end mt-10">
              <button
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full"
                onClick={handelNext}
              >
                Next
              </button>
            </div>
          </>
        )}

        {step == 3 && (
          <>
            <h1 className="text-3xl font-normal text-white mb-5 flex items-center gap-2">
              <img src={logo} alt="logo" className="w-8 h-8" />
              Choose Avatar
            </h1>
            <div className="flex items-center gap-6 mb-6">
              <div className="w-28 h-28 rounded-full border-4 border-gray-500 overflow-hidden shadow-lg">
                {frontendImage ? (
                  <img
                    src={frontendImage}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUserCircle
                    className="text-gray-500 w-full h-full p-2 "
                    size={20}
                  />
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="" className="text-gray-300 font-medium">
                  Choose Profile Picture
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-600 file:text-white hover:file:bg-orange-700 cursor-pointer"
                  onChange={handelImage}
                ></input>
              </div>
            </div>
            <div className="flex justify-end mt-10">
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full"
                onClick={handelSignUp}
                disabled={loading}
              >
                {loading ? (
                  <ClipLoader color="black" size={20} />
                ) : (
                  "Create Account"
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Signup;
