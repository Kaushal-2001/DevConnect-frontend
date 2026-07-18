import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: null,
  reducers: {
    addFeed: (state, action) => {
      return action.payload;
    },
    removeFromFeed: (state, action) => {
      return state.filter((r) => r._id !== action.payload);
    },
  },
});

export const { addFeed, removeFromFeed } = feedSlice.actions;
export default feedSlice.reducer;
