import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  categoryItems: [],
  status: null,
};

export const categoryFetch = createAsyncThunk(
  "users/categoryFetch",
  async () => {
    const res = await axios.get("/api/category");
    return res.data;
  }
);

const categorySlice = createSlice({
  name: "categoryItems",
  initialState,
  reducers: {},
  extraReducers: {
    [categoryFetch.pending]: (state, action) => {
      state.status = "pending";
    },
    [categoryFetch.fulfilled]: (state, action) => {
      state.categoryItems = action.payload;
      state.status = "success";
    },
    [categoryFetch.rejected]: (state, action) => {
      state.status = "rejected";
    },
  },
});

export default categorySlice.reducer;
