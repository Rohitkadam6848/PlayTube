import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../App";
import { setAllShortsData, setAllVideosData } from "../redux/contentSlice";

const GetAllContentData = () => {
  const dispatch = useDispatch();
  const { channelData } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchAllVideos = async () => {
      try {
        const result = await axios.get(
          serverUrl + "/api/content/getallvideos",
          {
            withCredentials: true,
          },
        );
        dispatch(setAllVideosData(result.data));
        console.log(result.data);
      } catch (e) {
        console.log(e);
        dispatch(setAllVideosData(null));
      }
    };

    fetchAllVideos();
  }, [dispatch, channelData]);

  useEffect(() => {
    const fetchAllShorts = async () => {
      try {
        const result = await axios.get(
          serverUrl + "/api/content/getallshorts",
          {
            withCredentials: true,
          },
        );
        dispatch(setAllShortsData(result.data));
        console.log(result.data);
      } catch (e) {
        console.log(e);
        dispatch(setAllShortsData(null));
      }
    };

    fetchAllShorts();
  }, [dispatch, channelData]);

  return null;
};

export default GetAllContentData;
