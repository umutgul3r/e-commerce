import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { add } from "../../redux/reducers/productSlice";
import { basketFetch } from "../../redux/reducers/cartSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Button.scss";

function Button({ product, deleteProduct }) {
  const auth = useSelector((state) => state.auth);
  const token = useSelector((state) => state.getToken.token);
  const { cartItem } = useSelector((state) => state.cart);
  const { isAdmin, isLogged, isSeller } = auth;

  const [cart, setCart] = useState(cartItem);

  const dispatch = useDispatch();

  const notify = () => {
    toast.success("Ürün Sepete Eklendi", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  async function addCart(product) {
    if (!isLogged) {
      return alert("Satın almaya devam etmek için lütfen giriş yapın.");
    }
    const check = cart.every((item) => {
      return item._id !== product._id;
    });
    if (check) {
      setCart([...cart, { ...product, quantity: 1 }]);
      const umut = { cart: [...cartItem, { ...product, quantity: 1 }] };
      const dd = umut.cart;
      dispatch(add([token, dd]));
      dispatch(basketFetch(token));
      notify();
    } else {
      alert("Bu ürün zaten sepete ekli");
    }
    dispatch(basketFetch(token));
  }

  return (
    <div>
      {isAdmin || isSeller ? (
        <>
          <Link
            className="itemButton"
            to="#!"
            onClick={() => deleteProduct(product._id, product.images.public_id)}
          >
            Sil
          </Link>
          <Link className="itemButton" to={`/edit_product/${product._id}`}>
            Düzenle
          </Link>
        </>
      ) : (
        <>
          {isSeller ? (
            ""
          ) : (
            <Link
              to="#"
              className="cartButton"
              onClick={() => {
                addCart(product);
              }}
            >
              Sepete Ekle
            </Link>
          )}
        </>
      )}
    </div>
  );
}

export default Button;
