import axios from "axios";
import { useEffect } from "react";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const GetCurrentUser = () => {
  const dispatch = useDispatch();
  // const { channelData } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(serverUrl + "/api/user/getuser", {
          withCredentials: true,
        });
        dispatch(setUserData(result.data));
        console.log(result.data);
      } catch (e) {
        console.log(e);
        dispatch(setUserData(null));
      }
    };

    fetchUser();
  }, [dispatch]);

  return null;
};

export default GetCurrentUser;
