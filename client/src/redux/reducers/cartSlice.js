import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  orderItems: [],
  cartItem: [],
  status: null,
};

export const cartAdd = (product, token) => async () => {
  await fetch("/user/addcart", {
    method: "POST",
    headers: {
      Authorization: token,
    },
    body: product,
  }).then((response) => {
    return response.json();
  });
};

export const basketFetch = createAsyncThunk(
  "user/basketFetch",
  async (token) => {
    const res = await axios.get("/user/info", {
      headers: { Authorization: token },
    });
    return res.data.cart;
  }
);

export const cartFetch = createAsyncThunk("users/cartFetch", async (token) => {
  const res = await axios.get("/api/payment", {
    headers: { Authorization: token },
  });
  return res.data;
});

export const customerCartFetch = createAsyncThunk(
  "users/cartFetch",
  async (token) => {
    const res = await axios.get("/user/history", {
      headers: { Authorization: token },
    });
    return res.data;
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    increment: (state) => {
      state.isLogged = true;
    },
  },
  extraReducers: {
    [cartFetch.pending]: (state, action) => {
      state.status = "pending";
    },
    [cartFetch.fulfilled]: (state, action) => {
      state.orderItems = action.payload;
      state.status = "success";
    },
    [cartFetch.rejected]: (state, action) => {
      state.status = "rejected";
    },
    [customerCartFetch.pending]: (state, action) => {
      state.status = "pending";
    },
    [customerCartFetch.fulfilled]: (state, action) => {
      state.orderItems = action.payload;
      state.status = "success";
    },
    [customerCartFetch.rejected]: (state, action) => {
      state.status = "rejected";
    },
    [basketFetch.pending]: (state, action) => {
      state.status = "pending";
    },
    [basketFetch.fulfilled]: (state, action) => {
      state.cartItem = action.payload;
      state.status = "success";
    },
    [basketFetch.rejected]: (state, action) => {
      state.status = "rejected";
    },
  },
});

export default cartSlice.reducer;
