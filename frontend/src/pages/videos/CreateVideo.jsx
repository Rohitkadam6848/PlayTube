import axios from "axios";
import { useState } from "react";
import { serverUrl } from "../../App";
import { showCustomAlert } from "../../components/CustomAlert";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { setAllVideosData } from "../../redux/contentSlice";
import { setChannelData } from "../../redux/userSlice";

function CreateVideo() {
  const { channelData } = useSelector((state) => state.user);
  const { allVideosData } = useSelector((state) => state.content);
  const [videoUrl, setVideoUrl] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handelVideo = (e) => {
    setVideoUrl(e.target.files[0]);
  };

  const handelThumbnail = (e) => {
    setThumbnail(e.target.files[0]);
  };

  const handelUploadVideo = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append(
      "tags",
      JSON.stringify(tags.split(",").map((tag) => tag.trim())),
    );
    formData.append("video", videoUrl);
    formData.append("thumbnail", thumbnail);
    formData.append("channelId", channelData._id);

    try {
      const result = await axios.post(
        serverUrl + "/api/content/create-video",
        formData,
        { withCredentials: true },
      );
      console.log(result.data);
      showCustomAlert("uploade Video Successfully");
      setLoading(false);
      navigate("/");
      dispatch(setAllVideosData([...allVideosData, result.data]));

      const updateChannel = {
        ...channelData,
        videos: [...(channelData.videos || []), result.data],
      };

      dispatch(setChannelData(updateChannel));
    } catch (error) {
      console.log(error);
      showCustomAlert(error.response.data.message);
      setLoading(false);
    }
  };
  return (
    <div className="w-full min-h-[80vh] bg-[#0f0f0f] text-white flex felx-col pt-5">
      <div className="flex flex-1 justify-center items-center px-4 py-6 ">
        <div className="bg-[#212121] p-6 rounded-xl w-full max-w-2xl shadow-lg space-y-6  ">
          {/* Upload video */}
          <label
            htmlFor="video"
            className="cursor-pointer border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center p-1 hover:border-orange-500 transition"
          >
            <input
              type="file"
              id="video"
              className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
              accept="video/*"
              onChange={handelVideo}
            />
          </label>

          <input
            type="text"
            placeholder="Title*"
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
            value={title}
          />
          <textarea
            type="text"
            placeholder="Description*"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Tags*"
            className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
            onChange={(e) => setTags(e.target.value)}
            value={tags}
          />

          {/* Upload thumnail */}
          <label htmlFor="thumnail" className="block cursor-pointer">
            {thumbnail ? (
              <img
                src={URL.createObjectURL(thumbnail)}
                className="w-full rounded-lg border border-gray-700 mb-2"
              />
            ) : (
              <div className="w-full h-32 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 border  border-gray-700 mb-2">
                Click to upload thumbnail
              </div>
            )}
            <input
              type="file"
              id="thumnail"
              className="hidden"
              accept="image/*"
              onChange={handelThumbnail}
            />
          </label>

          <button
            className="w-full bg-orange-600 hover:bg-orange-700 py-3 rounded-lg font-medium disabled:bg-gray-600 flex items-center justify-center"
            disabled={!title || !description || !tags || loading}
            onClick={handelUploadVideo}
          >
            {loading ? <ClipLoader color="black" size={20} /> : "Upload Video"}
          </button>
          {loading && (
            <p className="text-center text-white text-sm animate-pulse">
              Video Uploading...please wait...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateVideo;
