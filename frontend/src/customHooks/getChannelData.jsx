import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setChannelData } from "../redux/userSlice";
import { serverUrl } from "../App";
import axios from "axios";

const GetChannelData = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const result = await axios.get(serverUrl + "/api/user/getchannel", {
          withCredentials: true,
        });
        dispatch(setChannelData(result.data));
        console.log(result.data);
      } catch (e) {
        console.log(e);
        dispatch(setChannelData(null));
      }
    };

    fetchChannel();
  }, [dispatch]);

  return null;
};

export default GetChannelData;
