import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function CreatePlaylist() {
  const [title, setTitle] = useState("");
  const [description, SetDescription] = useState("");
  const { channelData } = useSelector((state) => state.user);
  const [videoData, setVideoData] = useState([]);

  useEffect(() => {
    if (channelData || channelData?.videos) {
      setVideoData(channelData?.videos);
      console.log(videoData);
    }
  }, []);
  return (
    <div className="w-full min-h-[80vh] bg-[#0f0f0f] text-white flex flex-col pt-5">
      <main className="flex flex-1 justify-center  items-center px-4 py-6">
        <div className="bg-[#212121] p-6 rounded-xl w-full max-w-2xl shadow-lg space-y-6">
          <input
            type="text"
            className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
            placeholder="Palylist Title *"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />

          <textarea
            className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
            placeholder="Palylist Description *"
            onChange={(e) => SetDescription(e.target.value)}
            value={description}
          />

          <div>
            <p className="mb-3 text-lg font-semibold">Select Videos</p>
            {videoData?.length == 0 ? (
              <P className="text-sm text-gray-400">
                No videos found for this channel
              </P>
            ) : (
              <div className="grid grid-cols-2 gap-4 max-h-72 overflow-y-auto">
                {videoData?.map((video) => (
                  <div></div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default CreatePlaylist;
