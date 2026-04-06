import { Navigate, Route, Routes } from "react-router-dom";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";
import Signup from "./pages/signup";
import CustomAlert, { showCustomAlert } from "./components/CustomAlert";
import Shorts from "./pages/shorts/Shorts";
import GetCuurentUser from "./customHooks/getCuurentUser";
import MobileProfile from "./components/MobileProfile";
import ForgetPassword from "./pages/ForgetPassword";
import CreateChannel from "./pages/channel/createChannel";
import ViewChannel from "./pages/channel/ViewChannel";
import GetChannelData from "./customHooks/getChannelData";
import UpdateChannel from "./pages/channel/UpdateChannel";
import { useSelector } from "react-redux";
import CreatePage from "./pages/CreatePage";
import CreateVideo from "./pages/videos/CreateVideo";
import CreateShorts from "./pages/shorts/CreateShorts";
import CreatePlaylist from "./pages/Playlist/CreatePlaylist";
import CreatePost from "./pages/Post/CreatePost";
import GetAllContentData from "./customHooks/getAllContentData";
import PlayVideo from "./pages/videos/PlayVideo";
import PlayShort from "./pages/shorts/PlayShort";

export const serverUrl = "http://localhost:8000";

const ProtectRoute = ({ userData, children }) => {
  if (!userData) {
    showCustomAlert("Please sign up first to use this feature");
    return <Navigate to={"/"} replace />;
  }
  return children;
};

function App() {
  GetCuurentUser();
  GetChannelData();
  GetAllContentData();
  const { userData } = useSelector((state) => state.user);
  return (
    <CustomAlert>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route
            path="/shorts"
            element={
              <ProtectRoute userData={userData}>
                <Shorts />
              </ProtectRoute>
            }
          />
          <Route
            path="/playshort/:shortId"
            element={
              <ProtectRoute userData={userData}>
                <PlayShort />
              </ProtectRoute>
            }
          />
          <Route
            path="/mobileprofile"
            element={
              <ProtectRoute userData={userData}>
                <MobileProfile />
              </ProtectRoute>
            }
          />
          <Route
            path="/viewchannel"
            element={
              <ProtectRoute userData={userData}>
                <ViewChannel />
              </ProtectRoute>
            }
          />
          <Route
            path="/updatechannel"
            element={
              <ProtectRoute userData={userData}>
                <UpdateChannel />
              </ProtectRoute>
            }
          />
          <Route
            path="/create"
            element={
              <ProtectRoute userData={userData}>
                <CreatePage />
              </ProtectRoute>
            }
          />
          <Route
            path="/createvideo"
            element={
              <ProtectRoute userData={userData}>
                <CreateVideo />
              </ProtectRoute>
            }
          />
          <Route
            path="/createshorts"
            element={
              <ProtectRoute userData={userData}>
                <CreateShorts />
              </ProtectRoute>
            }
          />
          <Route
            path="/createplaylist"
            element={
              <ProtectRoute userData={userData}>
                <CreatePlaylist />
              </ProtectRoute>
            }
          />
          <Route
            path="/createpost"
            element={
              <ProtectRoute userData={userData}>
                <CreatePost />
              </ProtectRoute>
            }
          />
        </Route>
        <Route
          path="/playvideo/:videoId"
          element={
            <ProtectRoute userData={userData}>
              <PlayVideo />
            </ProtectRoute>
          }
        />

        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/forgetpassword" element={<ForgetPassword />} />
        <Route
          path="/createchannel"
          element={
            <ProtectRoute userData={userData}>
              <CreateChannel />
            </ProtectRoute>
          }
        />
      </Routes>
    </CustomAlert>
  );
}

export default App;
