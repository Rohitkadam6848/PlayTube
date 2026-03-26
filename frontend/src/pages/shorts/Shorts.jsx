import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

function Shorts() {
  const { allShortsData } = useSelector((state) => state.content);
  const [shortList, setShortList] = useState([]);
  const shortRef = useRef([]);

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
  return (
    <div className="h-screen w-full overflow-y-scroll snap-y snap-mandatory ">
      {shortList?.map((short, idx) => (
        <div
          className="min-h-screen w-full flex md:items-center items-start justify-center snap-start relative pt-10 md:pt-0"
          key={short?._id}
        >
          <div className="relative w-105 md:[350px] aspect-9/16 bg-black rounded-2xl overflow-hidden shadow-xl border border-gray-700 cursor-pointer ">
            <video
              ref={(el) => (shortRef.current[idx] = el)}
              data-index={idx}
              src={short?.shortUrl}
              className="w-full h-full object-cover"
              loop
              playsInline
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default Shorts;
