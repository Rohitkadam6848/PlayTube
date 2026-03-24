import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiLogOut } from "react-icons/fi";
import { MdOutlineSwitchAccount } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { TiUserAddOutline } from "react-icons/ti";
import { SiYoutubestudio } from "react-icons/si";
import { GoVideo } from "react-icons/go";
import { FaHistory, FaList, FaThumbsUp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { showCustomAlert } from "./CustomAlert";
import { serverUrl } from "../App";
import axios from "axios";
import { setUserData } from "../redux/userSlice";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../utils/fireBase";

function MobileProfile() {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handelSignOut = async () => {
    try {
      const result = await axios.get(serverUrl + "/api/auth/signout", {
        withCredentials: true,
      });
      dispatch(setUserData(null));

      console.log(result.data);
      showCustomAlert("Signout Successfully");
    } catch (e) {
      console.log(e);
      showCustomAlert("Signout error");
    }
  };
  const handelGoogleAuth = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      console.log(response);
      let user = response.user;
      let username = response.user.displayName;
      let email = user.email;
      let photoUrl = user.photoURL;

      const fromData = new FormData();
      fromData.append("username", username);
      fromData.append("email", email);
      fromData.append("photoUrl", photoUrl);

      const result = await axios.post(
        serverUrl + "/api/auth/googleauth",
        fromData,
        { withCredentials: true },
      );

      console.log(result.data);
      dispatch(setUserData(result.data));
      console.log(result.data);
      showCustomAlert("Google  Authentication Successfully");
    } catch (error) {
      console.log(error);
      showCustomAlert("Google  Authentication error");
    }
  };
  return (
    <div className="md:hidden  bg-[#0f0f0f] text-white h-full w-full  flex flex-col pt-25 p-2.5">
      {/* Top Profile Section */}
      {userData && (
        <div className="p-4 flex items-center gap-4 border-b border-gray-800">
          {userData?.photoUrl && (
            <img
              src={userData?.photoUrl}
              className="w-16 rounded-full object-cover"
            />
          )}
          <div className="flex flex-col">
            <span className="font-semibold text-lg">{userData?.username}</span>
            <span className="text-gray-400 text-sm">{userData?.email}</span>
            <p
              className="text-sm text-blue-400 cursor-pointer hover:underline"
              onClick={() => {
                userData?.channel
                  ? navigate("/viewchannel")
                  : navigate("/createchannel");
              }}
            >
              {userData?.channel ? "view channel" : "Create channel"}
            </p>
          </div>
        </div>
      )}

      {/* Auth Buttons */}
      <div className="flex gap-2 p-4 border-b border-gray-800 overflow-auto">
        <button
          className="bg-gray-800 text-nowrap px-3 py-1 rounded-2xl text-sm flex items-center justify-center gap-2"
          onClick={handelGoogleAuth}
        >
          <FcGoogle className="text-xl " />
          Sign In with Google Account
        </button>
        <button
          className="bg-gray-800 text-nowrap px-3 py-1 rounded-2xl text-sm flex items-center justify-center gap-2"
          onClick={() => navigate("/signup")}
        >
          <TiUserAddOutline className="text-xl " />
          Create new Account
        </button>
        <button
          className="bg-gray-800 text-nowrap px-3 py-1 rounded-2xl text-sm flex items-center justify-center gap-2"
          onClick={() => navigate("/signin")}
        >
          <MdOutlineSwitchAccount className="text-xl " />
          Signin with other Account
        </button>

        <button
          className="bg-gray-800 text-nowrap px-3 py-1 rounded-2xl text-sm flex items-center justify-center gap-2"
          onClick={handelSignOut}
        >
          <FiLogOut className="text-xl " />
          Sign Out
        </button>
      </div>

      <div className="flex flex-col mt-5">
        <ProfileMenuItem icon={<FaHistory />} text={"History"} />
        <ProfileMenuItem icon={<FaList />} text={"Playlists"} />
        <ProfileMenuItem icon={<GoVideo />} text={"Save videos"} />
        <ProfileMenuItem icon={<FaThumbsUp />} text={"Like videos"} />
        <ProfileMenuItem icon={<SiYoutubestudio />} text={"PT Studio"} />
      </div>
    </div>
  );
}

function ProfileMenuItem({ icon, text, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 rounded-2xl p-4 active:bg-[#272727] text-left"
    >
      <span className="text-lg">{icon}</span>
      <span className="text-sm">{text}</span>
    </button>
  );
}

export default MobileProfile;
