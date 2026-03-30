import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Description from "./../../components/Description";
import {
  FaPlay,
  FaPause,
  FaComment,
  FaDownload,
  FaBookmark,
  FaArrowDown,
  FaThumbsUp,
  FaThumbsDown,
} from "react-icons/fa";

const IconButtton = ({ icon: Icon, active, label, count, onClick }) => {
  return (
    <button className="flex flex-col items-center" onClick={onClick}>
      <div
        className={`${
          active ? "bg-white" : "bg-[#00000065] border border-gray-700"
        } p-3 rounded-full hover:bg-gray-700 transition`}
      >
        <Icon size={20} className={`${active ? "text-black" : "text-white"}`} />
      </div>

      <span className="text-xs mt-1 flex gap-1">
        {count !== undefined && ` ${count}`}
        <span>{label}</span>
      </span>
    </button>
  );
};

function Shorts() {
  const { allShortsData } = useSelector((state) => state.content);
  const [shortList, setShortList] = useState([]);
  const shortRef = useRef([]);
  const [playIndex, setPlayIndex] = useState(null);
  const { userData } = useSelector((state) => state.user);
  const [openComment, SetOpenComment] = useState(false);

  useEffect(() => {
    if (!allShortsData || allShortsData.length === 0) {
      return;
    }

    const shuffled = [...allShortsData].sort(() => Math.random() - 0.5);
    setShortList(shuffled);
  }, [allShortsData]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const index = Number(entry.target.dataset.index);
        const video = shortRef.current[index];
        if (video) {
          if (entry.isIntersecting) {
            video.muted = false;
            video.play();
          } else {
            video.muted = true;
            video.pause();
          }
        }
      });
    });

    shortRef.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => observer.disconnect();
  }, [shortList]);

  const togglePlay = (idx) => {
    const video = shortRef.current[idx];
    if (video) {
      if (video.paused) {
        video.play();
        setPlayIndex(null);
      } else {
        video.pause();
        setPlayIndex(idx);
      }
    }
  };
  return (
    <div className="h-screen w-full overflow-y-scroll snap-y snap-mandatory ">
      {shortList?.map((short, idx) => (
        <div
          className="min-h-screen w-full flex md:items-center items-start justify-center snap-start relative pt-10 md:pt-0"
          key={short?._id}
        >
          <div
            className="relative  w-105 md:w-87.5 aspect-9/16 bg-black rounded-2xl overflow-hidden shadow-xl border border-gray-700 cursor-pointer "
            onClick={() => togglePlay(idx)}
          >
            <video
              ref={(el) => (shortRef.current[idx] = el)}
              data-index={idx}
              src={short?.shortUrl}
              className="w-full h-full object-cover"
              loop
              playsInline
            />
            {playIndex === idx && (
              <div className="absolute top-3 right-3 bg-black/60 rounded-full p-2">
                <FaPlay className="text-white text-lg" />
              </div>
            )}

            {playIndex !== idx && (
              <div className="absolute top-3 right-3 bg-black/60 rounded-full p-2">
                <FaPause className="text-white text-lg" />
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-liner-to-t from-black/80 via-black/40 to-transparent text-white space-y-1">
              <div className="flex items-center justify-start gap-2">
                <img
                  src={short?.channel?.avatar}
                  className="w-8 h-8 rounded-full border"
                />
                <span className="text-sm text-gray-300 ">
                  @{short?.channel?.name.toLowerCase()}
                </span>
                <button className="bg-white text-black text-xs px-2.5 py-2.5 rounded-full cursor-pointer">
                  Subscribe
                </button>
              </div>
              <div className="flex items-center justify-start">
                <h3 className="font-bold text-lg line-clamp-2">
                  {short?.title}
                </h3>
              </div>
              <div>
                {short?.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-800 text-gray-200 text-xs px-2 py-1  rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Description text={short?.description} />
            </div>
            <div className="absolute right-3 bottom-28 flex flex-col items-center gap-5">
              <IconButtton
                icon={FaThumbsUp}
                label={"Likes"}
                active={short?.likes?.includes(userData._id)}
                count={short?.likes?.length}
              />
              <IconButtton
                icon={FaThumbsDown}
                label={"Dislikes"}
                active={short?.disLikes?.includes(userData._id)}
                count={short?.disLikes?.length}
              />
              <IconButtton
                icon={FaComment}
                label={"Comments"}
                onClick={() => SetOpenComment(!openComment)}
              />
              <IconButtton
                icon={FaDownload}
                label={"Download"}
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = short?.shortUrl;
                  link.download = `${short?.title}.mp4`;
                  link.click();
                }}
              />
              <IconButtton
                icon={FaBookmark}
                label={"Save"}
                active={short?.saveBy?.includes(userData._id)}
              />
            </div>
            {openComment && (
              <div className="absolute bottom-0 left-0 right-0 h-[60%] bg-black/95 text-white p-4 rounded-t-2xl overflow-y-auto">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-lg">Comments</h3>
                  <button>
                    <FaArrowDown
                      size={20}
                      onClick={() => SetOpenComment(!openComment)}
                    />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Shorts;
