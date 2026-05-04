import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    channelData: null,
    allChannelData: null,
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },

    setChannelData: (state, action) => {
      state.channelData = action.payload;
    },

    allChannelData: (state, action) => {
      state.allChannelData = action.payload;
    },
  },
});

export const { setUserData } = userSlice.actions;
export const { setChannelData } = userSlice.actions;
export const { allChannelData } = userSlice.actions;
export default userSlice.reducer;
