import React from "react";
import { Routes, Route } from "react-router-dom";
import Products from "./product/Products";
import DetailProduct from "./product/DetailProduct";
import Login from "./user/Login";
import Register from "./user/Register";
import OrderHistory from "./profile/OrderHistory";
import OrderDetails from "./profile/OrderDetails";
import Cart from "./cart/Cart";
import NotFound from "./utils/NotFound";
import Categories from "./categories/Categories";
import CreateProduct from "./product/CreateProduct";
import { useSelector } from "react-redux";
import ActivationEmail from "./user/ActivationEmail";
import ForgotPassword from "./user/ForgotPassword";
import ResetPassword from "./user/ResetPassword";
import EditUser from "./user/EditUser";
import Profile from "./profile/Profile";
import Support from "./chat/SupportScreen";
import MyProducts from "./product/MyProduct";
import Pay from "./product/Pay";

function Pages() {
  const auth = useSelector((state) => state.auth);
  const { isLogged, isAdmin, isSeller } = auth;

  return (
    <Routes>
      <Route path="/" exact element={<Products />} />
      <Route path="/detail/:id" element={<DetailProduct />} />
      <Route
        path="/profile"
        element={isLogged ? <Profile /> : <NotFound />}
        exact
      />
      <Route
        path="/login"
        exact
        element={isLogged ? <NotFound /> : <Login />}
      />
      <Route
        path="/forgot_password"
        element={isLogged ? <NotFound /> : <ForgotPassword />}
        exact
      />
      <Route
        path="/user/reset/:id"
        element={isLogged ? <NotFound /> : <ResetPassword />}
        exact
      />
      <Route
        path="/register"
        exact
        element={isLogged ? <NotFound /> : <Register />}
      />

      <Route
        path="/category"
        exact
        element={isAdmin || isSeller ? <Categories /> : <NotFound />}
      />
      <Route
        path="/support"
        exact
        element={isAdmin ? <Support /> : <NotFound />}
      />
      <Route
        path="/my_products"
        exact
        element={isSeller ? <MyProducts /> : <NotFound />}
      />
      <Route path="/pay" exact element={isSeller ? <Pay /> : <NotFound />} />

      <Route
        path="/create_product"
        exact
        element={isAdmin || isSeller ? <CreateProduct /> : <NotFound />}
      />
      <Route
        path="/edit_product/:id"
        exact
        element={isAdmin || isSeller ? <CreateProduct /> : <NotFound />}
      />
      <Route
        path="/user/activate/:activation_token"
        element={<ActivationEmail />}
        exact
      />
      <Route
        path="/history"
        exact
        element={isLogged ? <OrderHistory /> : <NotFound />}
      />
      <Route
        path="/history/:id"
        exact
        element={isLogged ? <OrderDetails /> : <NotFound />}
      />
      <Route
        path="/edit_user/:id"
        element={isAdmin ? <EditUser /> : <NotFound />}
        exact
      />

      <Route path="/cart" exact element={<Cart />} />

      <Route path="*" exact element={<NotFound />} />
    </Routes>
  );
}

export default Pages;
