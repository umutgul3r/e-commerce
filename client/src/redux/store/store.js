import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../reducers/authSlice";
import tokenReducer from "../reducers/tokenReducer";
import getUsers from "../reducers/getAllUsers";
import cartReducer from "../reducers/cartSlice";
import productsReducer from "../reducers/productSlice";
import categoryReducer from "../reducers/categorySlice";

export default configureStore({
  reducer: {
    auth: authSlice,
    getToken: tokenReducer,
    getAllUsers: getUsers,
    cart: cartReducer,
    products: productsReducer,
    category: categoryReducer,
  },
});
