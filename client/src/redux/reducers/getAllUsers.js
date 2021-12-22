import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAllUser = async (token) => {
  const res = await axios.get("/user/all_info", {
    headers: {
      Authorization: token,
    },
  });
  return res.data;
};

const initialState = {
  user: [],
};

export const getAllUsers = createSlice({
  name: "getAllUsers",
  initialState,
  reducers: {
    getUsers: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { getUsers } = getAllUsers.actions;
export default getAllUsers.reducer;
