import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import logo from "../assets/playtube1.png";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { showCustomAlert } from "../components/CustomAlert";
import axios from "axios";
import { serverUrl } from "./../App";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

function SignIn() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handelNext = () => {
    if (step == 1) {
      if (!email) {
        showCustomAlert("Fill all the fields");
        return;
      }
    }

    if (step == 2) {
      if (!password) {
        showCustomAlert("Fill all the fields");
        return;
      }
    }
    setStep(step + 1);
  };

  const handelSignIn = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        serverUrl + "/api/auth/signin",
        {
          email,
          password,
        },
        { withCredentials: true },
      );
      console.log(result.data);
      dispatch(setUserData(result.data));
      navigate("/");
      setLoading(false);
      showCustomAlert("User SignIn Successfully ");
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
          <span className="text-white text-2xl font-medium">PlayTube</span>
        </div>

        {step == 1 && (
          <>
            <h1 className="text-3xl font-normal text-white mb-5 flex items-center gap-2">
              <img src={logo} alt="logo" className="w-8 h-8" />
              SignIn
            </h1>
            <p className="text-gray-400 text-sm mb-6">
              With your Account to continue to PlayTube.
            </p>
            <input
              type="text"
              placeholder="Email"
              className="w-full bg-transparent border border-gray-500 rounded-md px-3 py-3 text-white focus:outline-none focus:border-orange-500 mb-4"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            ></input>
            <div className="flex justify-between items-center  mt-10">
              <button
                className="text-orange-400 text-sm hover:underline"
                onClick={() => {
                  navigate("/signup");
                }}
              >
                Create Account
              </button>
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
              Welcome
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

            <div className="flex justify-between items-center  mt-10">
              <button
                className="text-orange-400 text-sm hover:underline"
                onClick={() => navigate("/forgetpassword")}
              >
                Forget password
              </button>
              <button
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full"
                onClick={handelSignIn}
                disabled={loading}
              >
                {loading ? <ClipLoader color="black" size={20} /> : "SignIn"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SignIn;
