import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  items: [],
  status: null,
  result: "",
  page: 4,
};
export const add = createAsyncThunk("add/Product", async ([token, cart]) => {
  await axios.patch(
    "/user/addcart",
    { cart },
    {
      headers: { Authorization: token },
    }
  );
  console.log(token);
  console.log(cart);
});

export const productsFetch = createAsyncThunk(
  "users/productsFetch",
  async ([page, category, search, sort]) => {
    const res = await axios.get(
      `api/products?limit=${
        page * 6
      }&${category}&sort=${sort}&title[regex]=${search}`
    );
    return res.data;
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    pages: (state, action) => {
      state.page = action.payload;
    },
  },
  extraReducers: {
    [productsFetch.pending]: (state, action) => {
      state.status = "pending";
    },
    [productsFetch.fulfilled]: (state, action) => {
      state.result = action.payload.result;
      state.items = action.payload.products;
      state.status = "success";
    },
    [productsFetch.rejected]: (state, action) => {
      state.status = "rejected";
    },
  },
});

export const { pages } = productsSlice.actions;
export default productsSlice.reducer;
