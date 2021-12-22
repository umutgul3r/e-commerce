import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUser = async (token) => {
  const res = await axios.get("/user/info", {
    headers: {
      Authorization: token,
    },
  });
  return res.data;
};

const initialState = {
  user: "",
  isLogged: false,
  isAdmin: false,
  isSeller: false,
  card: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state) => {
      state.isLogged = true;
    },
    logout: (state) => {
      state.isLogged = false;
    },
    getUserAuth: (state, action) => {
      state.user = action.payload;
      const user = action.payload.role;
      const admin = user === 1 ? true : false;
      const seller = user === 2 ? true : false;
      state.isAdmin = admin;
      state.isSeller = seller;
    },
    getCC: (state, action) => {
      state.card = action.payload;
    },
  },
});

export const { login, logout, getUserAuth, getCC } = authSlice.actions;
export default authSlice.reducer;
