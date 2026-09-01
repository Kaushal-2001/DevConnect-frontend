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
    returnToFeed: (state, action) => {
      if (!state) return [action.payload];
      return [action.payload, ...state];
    },
  },
});

export const { addFeed, removeFromFeed, returnToFeed } = feedSlice.actions;
export default feedSlice.reducer;
