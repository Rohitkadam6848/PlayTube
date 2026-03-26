import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SiYoutubeshorts } from "react-icons/si";
import ShortCard from "./../../components/ShortCard";
import {
  FaPlay,
  FaPause,
  FaBackward,
  FaVolumeUp,
  FaVolumeMute,
  FaExpand,
  FaThumbsUp,
  FaThumbsDown,
  FaDownload,
  FaBookmark,
  FaForward,
  FaVolumeDown,
} from "react-icons/fa";
import Description from "../../components/Description";
import axios from "axios";
import { serverUrl } from "./../../App";
import { setChannelData } from "../../redux/userSlice";
import { ClipLoader } from "react-spinners";
import { setAllVideosData } from "../../redux/contentSlice";

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

function PlayVideo() {
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [channel, setChannel] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currTime, setCurrTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [comment, setComment] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isSubscribe, setIsSubscribed] = useState(false);

  const dispatch = useDispatch();
  const { allVideosData, allShortsData } = useSelector(
    (state) => state.content,
  );
  const { userData } = useSelector((state) => state.user);

  const suggestedVideos =
    allVideosData?.filter((v) => v._id !== videoId).slice(0, 10) || [];

  const suggestedShorts = allShortsData?.slice(0, 10) || [];

  useEffect(() => {
    if (!channel?.subscribers || !userData?._id) return;

    const isUserSubscribed = channel.subscribers.some((sub) => {
      const subId =
        typeof sub === "object" ? sub?._id?.toString() : sub?.toString();

      return subId === userData._id.toString();
    });

    setIsSubscribed(isUserSubscribed);
  }, [channel?.subscribers, userData?._id]);

  useEffect(() => {
    if (!allVideosData) {
      return;
    }
    const currVideo = allVideosData.find((v) => v._id === videoId);
    if (currVideo) {
      setVideo(currVideo);
      setChannel(currVideo.channel);
      setComment(currVideo?.comments);
    }
    const addViews = async () => {
      try {
        const result = await axios.put(
          `${serverUrl}/api/content/video/${videoId}/add-view`,
          {},
          { withCredentials: true },
        );
        setVideo((prev) =>
          prev ? { ...prev, views: result.data.views } : prev,
        );

        const updatedVideo = allVideosData.map((v) =>
          v._id === videoId ? { ...v, views: result.data.views } : v,
        );

        dispatch(setAllVideosData(updatedVideo));
      } catch (error) {
        console.log(error);
      }
    };
    addViews();
  }, [videoId, allVideosData, dispatch]);

  const handelUpdateTime = () => {
    if (!videoRef.current) {
      return;
    }

    setCurrTime(videoRef.current.currentTime);
    setDuration(videoRef.current.duration);
    setProgress(
      (videoRef.current.currentTime / videoRef.current.duration) * 100,
    );
  };

  const handelSeek = (e) => {
    if (!videoRef.current) {
      return;
    }
    const seekTime = (e.target.value / 100) * duration;
    videoRef.current.currentTime = seekTime;
    setProgress(e.target.value);
  };

  const formatTime = (time) => {
    if (isNaN(time)) {
      return "0:00";
    }
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const toggelPlay = () => {
    if (!videoRef.current) {
      return;
    }
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  };

  const skipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime += 10;
    }
  };

  const skipBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime -= 10;
    }
  };

  const handelVolume = (e) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    setIsMuted(vol === 0);
    if (videoRef.current) {
      videoRef.current.volume = vol;
    }
  };

  const handelMute = () => {
    if (!videoRef.current) {
      return;
    }
    setIsMuted(!isMuted);
    videoRef.current.muted = !isMuted;
  };

  const handelFullScreen = () => {
    if (!videoRef.current) {
      return;
    }
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const handleSubscribe = async () => {
    if (!channel._id) return;

    setLoading(true);
    try {
      const result = await axios.post(
        serverUrl + "/api/user/togglesubscribe",
        { channelId: channel._id },
        { withCredentials: true },
      );

      setChannel((prev) => ({
        ...prev,
        subscribers: result.data.subscribers || prev.subscribers,
      }));

      dispatch(
        setChannelData({
          ...channel,
          subscribers: result.data.subscribers,
        }),
      );
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const toggleLike = async () => {
    try {
      const result = await axios.put(
        `${serverUrl}/api/content/video/${videoId}/toggle-like`,
        {},
        { withCredentials: true },
      );
      setVideo(result.data);
      console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleDislike = async () => {
    try {
      const result = await axios.put(
        `${serverUrl}/api/content/video/${videoId}/toggle-dislike`,
        {},
        { withCredentials: true },
      );
      setVideo(result.data);
      console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleSave = async () => {
    try {
      const result = await axios.put(
        `${serverUrl}/api/content/video/${videoId}/toggle-save`,
        {},
        { withCredentials: true },
      );
      setVideo(result.data);
      console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handeleAddComment = async () => {
    if (!newComment) {
      return;
    }
    setLoading1(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/content/video/${videoId}/add-comment`,
        { message: newComment },
        { withCredentials: true },
      );
      setComment((prev) => [result.data?.comments.slice(-1)[0], ...prev]);
      console.log(result.data?.comments);
      setLoading1(false);
      setNewComment("");
    } catch (error) {
      console.log(error);
      setLoading1(false);
    }
  };

  const handleReply = async (commentId, replyText) => {
    if (!replyText) {
      return;
    }
    setLoading2(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/content/video/${videoId}/${commentId}/add-reply`,
        { message: replyText },
        { withCredentials: true },
      );
      setComment(result.data?.comments);
      console.log(result.data?.comments);
      setLoading2(false);
    } catch (error) {
      console.log(error);
      setLoading2(false);
    }
  };

  return (
    <div className="flex bg-[#0f0f0f] text-white flex-col lg:flex-row gap-6 p-4 lg:p-6">
      <div className="flex-1">
        {/* Video player */}
        <div
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
          className="w-full aspect-video bg-black rounded-lg overflow-hidden relative"
        >
          <video
            src={video?.videoUrl}
            className="w-full h-full object-contain"
            controls={false}
            autoPlay
            ref={videoRef}
            onTimeUpdate={handelUpdateTime}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
          {showControls && (
            <div className="absolute inset-0 hidden lg:flex items-center justify-center gap-6 sm:gap-10 transition-opacity duration-300 z-20">
              <button
                className="bg-black/70 p-3 sm:p-4 rounded-full hover:bg-orange-600 transition"
                onClick={skipBackward}
              >
                <FaBackward size={24} />
              </button>
              <button
                className="bg-black/70 p-3 sm:p-4 rounded-full hover:bg-orange-600 transition"
                onClick={toggelPlay}
              >
                {isPlaying ? <FaPause size={28} /> : <FaPlay size={28} />}
              </button>
              <button
                className="bg-black/70 p-3 sm:p-4 rounded-full hover:bg-orange-600 transition"
                onClick={skipForward}
              >
                <FaForward size={24} />
              </button>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 via-black/60 to-transparent px-2 sm:px-4 py-2 z-30">
            <input
              type="range"
              min={0}
              max={100}
              className="w-full accent-orange-600 "
              onChange={handelSeek}
              value={progress}
            />
            <div className="flex items-center justify-between mt-1 sm:mt-2 text-xs sm:text-sm text-gray-200">
              {/* //Left side */}
              <div className="flex items-center gap-3">
                <span>
                  {formatTime(currTime)}/ {formatTime(duration)}
                </span>
                <button
                  className="bg-black/70 px-2 py-1 rounded hover:bg-orange-600 transition"
                  onClick={skipBackward}
                >
                  <FaBackward size={14} />
                </button>
                <button
                  className="bg-black/70 px-2 py-1 rounded hover:bg-orange-600 transition"
                  onClick={toggelPlay}
                >
                  {isPlaying ? <FaPause size={14} /> : <FaPlay size={14} />}
                </button>

                <button
                  className="bg-black/70 px-2 py-1 rounded hover:bg-orange-600 transition"
                  onClick={skipForward}
                >
                  <FaForward size={14} />
                </button>
              </div>

              {/* //right side */}
              <div className="flex items-center gap-2 sm:gap-3">
                <button onClick={handelMute}>
                  {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                </button>
                <input
                  type="range"
                  value={isMuted ? 0 : volume}
                  onChange={handelVolume}
                  className="accent-orange-600 w-16 sm:w-24"
                  min={0}
                  max={1}
                  step={0.1}
                />
                <button onClick={handelFullScreen}>
                  <FaExpand />
                </button>
              </div>
            </div>
          </div>
        </div>

        <h1 className="mt-4 text-lg sm:text-xl font-bold text-white flex ">
          {video?.title}
        </h1>
        <p className="text-sm text-gray-400">{video?.views} views</p>
        <div className="mt-2 flex flex-wrap items-center justify-between">
          <div className="flex items-center justify-start gap-4">
            <img
              src={channel?.avatar}
              className="w-12 h-12 rounded-full border-2 border-gray-600"
            />
            <div>
              <h1 className="text-md font-bold">{channel?.name}</h1>
              <h3 className="text-[13px]">{channel?.subscribers?.length}</h3>
            </div>
            <button
              className={`px-5 py-2 rounded-4xl border border-gray-600 ml-5 text-md ${isSubscribe ? "bg-black text-white hover:bg-orange-600 hover:text-black " : "bg-white text-black hover:bg-orange-600 hover:text-black"} `}
              onClick={handleSubscribe}
            >
              {loading ? (
                <ClipLoader size={20} color="black" />
              ) : isSubscribe ? (
                "Subscribed"
              ) : (
                "Subscribe"
              )}
            </button>
          </div>
          <div className="flex items-center gap-6 mt-3">
            <IconButtton
              icon={FaThumbsUp}
              label={"Likes"}
              active={video?.likes?.includes(userData._id)}
              onClick={toggleLike}
              count={video?.likes?.length}
            />
            <IconButtton
              icon={FaThumbsDown}
              label={"Dislikes"}
              active={video?.disLikes?.includes(userData._id)}
              onClick={toggleDislike}
              count={video?.disLikes?.length}
            />
            <IconButtton
              icon={FaDownload}
              label={"Download"}
              onClick={() => {
                const link = document.createElement("a");
                link.href = video?.videoUrl;
                link.download = `${video?.title}.mp4`;
                link.click();
              }}
            />
            <IconButtton
              icon={FaBookmark}
              label={"Save"}
              active={video?.saveBy?.includes(userData._id)}
              onClick={toggleSave}
            />
          </div>
        </div>

        <div className="mt-4 bg-[#1a1a1a] p-3 rounded-lg ">
          <h2 className="text-md font-semibold mb-2">Description</h2>
          <Description text={video?.Description} />
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-3">Comments</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Add a comment..."
              className="flex-1 border border-gray-700 bg-[#1a1a1a] text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-orange-600"
              onChange={(e) => setNewComment(e.target.value)}
              value={newComment}
            />
            <button
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg"
              onClick={handeleAddComment}
              disabled={loading1}
            >
              {loading1 ? <ClipLoader size={20} color="black" /> : " Post"}
            </button>
          </div>

          <div className="space-y-3 max-h-75 overflow-y-auto pr-2 ">
            {comment?.map((comment) => (
              <div className="p-4 bg-[#1a1a1a] rounded-lg" key={comment?._id}>
                {/* Comment Header */}
                <div className="flex items-center gap-3">
                  <img
                    src={comment?.author?.photoUrl}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <h2 className="text-sm font-semibold">
                    @{comment?.author?.username.toLowerCase()}
                  </h2>
                </div>

                {/* Comment Message */}
                <p className="text-sm mt-2 ml-12 text-gray-300">
                  {comment?.message}
                </p>

                {/* Replies */}
                <div className="ml-12 mt-3 space-y-2">
                  {comment?.replies.map((reply) => (
                    <div
                      className="p-2 bg-[#2a2a2a] rounded-md"
                      key={reply?._id}
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={reply?.author?.photoUrl}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <h2 className="text-xs font-semibold">
                          @{reply?.author?.username.toLowerCase()}
                        </h2>
                      </div>

                      <p className="text-xs text-gray-300 ml-8 mt-1">
                        {reply?.message}
                      </p>
                    </div>
                  ))}
                </div>

                <ReplySection
                  comment={comment}
                  handleReply={handleReply}
                  loading2={loading2}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-95 px-4 py-4 border-t lg:border-t-0 lg:border-l border-gray-800 overflow-y-auto ">
        <h2 className="flex items-center gap-2 font-bold text-lg mb-3">
          Shorts <SiYoutubeshorts className="text-orange-600" />
        </h2>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-3">
          {suggestedShorts?.map((short) => {
            return (
              <div key={short._id}>
                <ShortCard
                  shortUrl={short?.shortUrl}
                  title={short?.title}
                  channelName={short?.channel?.name}
                  avatar={short?.channel?.avatar}
                  id={short?._id}
                />
              </div>
            );
          })}
        </div>
        <div className="font-bold text-lg mt-4 mb-3">Up Next</div>
        <div className="space-y-3">
          {suggestedVideos?.map((video) => {
            return (
              <div
                key={video._id}
                className="flex gap-2 sm:gap-3 cursor-pointer hover:bg-[#1a1a1a] rounded-lg transition"
                onClick={() => navigate(`/playvideo/${video._id}`)}
              >
                <img
                  src={video?.thumbnail}
                  className="w-32 sm:w-40 h-20 sm:h-24 rounded-lg object-cover"
                />
                <div>
                  <p className="font-semibold line-clamp-2 text-sm sm:text-base text-white">
                    {video?.title}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400 ">
                    {video?.channel?.name}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400 ">
                    {video?.views}0 views
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const ReplySection = ({ comment, handleReply, loading2 }) => {
  const [replyText, setReplyText] = useState("");
  const [showReplyInput, setShowReplyInput] = useState(false);
  return (
    <div className="mt-3">
      {showReplyInput && (
        <div className="flex gap-2 mt-1 ml-4">
          <input
            type="text"
            placeholder="Add a reply..."
            onChange={(e) => setReplyText(e.target.value)}
            value={replyText}
            className="flex-1 border border-gray-700 bg-[#1a1a1a] text-white rounded-lg px-2 py-2 focus:outline-none focus:ring-1 focus:ring-orange-600 text-sm"
          />
          <button
            onClick={() => {
              handleReply(comment?._id, replyText);
              setShowReplyInput(false);
              setReplyText("");
            }}
            className="bg-orange-600 hover:bg-orange-700 text-white px-3 rounded-lg text-sm"
          >
            {loading2 ? <ClipLoader size={20} color="black" /> : " Reply"}
          </button>
        </div>
      )}
      <button
        onClick={() => setShowReplyInput(!showReplyInput)}
        className="ml-4 text-xs text-gray-400 mt-1"
      >
        reply
      </button>
    </div>
  );
};
export default PlayVideo;
