import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: "",
};

export const tokenReducer = createSlice({
  name: "getToken",
  initialState,
  reducers: {
    getToken: (state, action) => {
      state.token = action.payload;
    },
  },
});

export const { getToken } = tokenReducer.actions;
export default tokenReducer.reducer;
