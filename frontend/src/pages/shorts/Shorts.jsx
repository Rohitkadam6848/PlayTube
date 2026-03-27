import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  FaPlay,
  FaPause,
  FaComment,
  FaDownload,
  FaBookmark,
  FaArrowDown,
} from "react-icons/fa";

function Shorts() {
  const { allShortsData } = useSelector((state) => state.content);
  const [shortList, setShortList] = useState([]);
  const shortRef = useRef([]);
  const [playIndex, setPlayIndex] = useState(null);

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

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-liner-to-t from-black/80 via-black/40 to-transparent text-white space-y-2">
              <div></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Shorts;
