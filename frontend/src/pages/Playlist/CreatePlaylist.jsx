import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

import { showCustomAlert } from "../../components/CustomAlert";
import { serverUrl } from "../../App";
import { setChannelData } from "../../redux/userSlice";

function CreatePlaylist() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoData, setVideoData] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);

  const { channelData } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleVideoSelect = (videoId) => {
    setSelectedVideos((prev) =>
      prev.includes(videoId)
        ? prev.filter((id) => id !== videoId)
        : [...prev, videoId],
    );
  };

  const handleCreatePlaylist = async () => {
    if (!channelData?._id) {
      showCustomAlert("Channel data not loaded");
      return;
    }

    if (!title.trim() || !description.trim()) {
      showCustomAlert("Please fill all fields");
      return;
    }

    if (selectedVideos.length === 0) {
      showCustomAlert("Please select at least one video");
      return;
    }

    setLoading(true);

    try {
      const result = await axios.post(
        `${serverUrl}/api/content/create-playlist`,
        {
          title,
          description,
          channelId: channelData._id,
          videoIds: selectedVideos,
        },
        {
          withCredentials: true,
        },
      );

      const updatedChannel = {
        ...channelData,
        playlists: [...(channelData.playlists || []), result.data.playlist],
      };

      dispatch(setChannelData(updatedChannel));

      showCustomAlert("Playlist created successfully");

      navigate("/");
    } catch (error) {
      console.error(error);

      showCustomAlert(
        error?.response?.data?.message || "Failed to create playlist",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (channelData?.videos) {
      setVideoData(channelData.videos);
    }
  }, [channelData]);

  return (
    <div className="w-full min-h-[80vh] bg-[#0f0f0f] text-white flex flex-col pt-5">
      <main className="flex flex-1 justify-center items-center px-4 py-6">
        <div className="bg-[#212121] p-6 rounded-xl w-full max-w-2xl shadow-lg space-y-6">
          {/* Title */}
          <input
            type="text"
            placeholder="Playlist Title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
          />

          {/* Description */}
          <textarea
            placeholder="Playlist Description *"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
          />

          {/* Videos */}
          <div>
            <p className="mb-3 text-lg font-semibold">Select Videos</p>

            {videoData.length === 0 ? (
              <p className="text-sm text-gray-400">No videos found</p>
            ) : (
              <div className="grid grid-cols-2 gap-4 max-h-72 overflow-y-auto">
                {videoData.map((video) => (
                  <div
                    key={video._id}
                    onClick={() => toggleVideoSelect(video._id)}
                    className={`cursor-pointer rounded-lg overflow-hidden border-2 transition ${
                      selectedVideos.includes(video._id)
                        ? "border-orange-500"
                        : "border-gray-700"
                    }`}
                  >
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-32 object-cover"
                    />

                    <p className="p-2 text-sm truncate">{video.title}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Button */}
          <button
            onClick={handleCreatePlaylist}
            disabled={
              loading ||
              !title.trim() ||
              !description.trim() ||
              selectedVideos.length === 0
            }
            className="w-full bg-orange-600 hover:bg-orange-700 py-3 rounded-lg font-medium disabled:bg-gray-600 flex items-center justify-center"
          >
            {loading ? (
              <ClipLoader size={20} color="white" />
            ) : (
              "Create Playlist"
            )}
          </button>
        </div>
      </main>
    </div>
  );
}

export default CreatePlaylist;
