import React, { useState, useEffect } from "react";
import axios from "axios";
import PaypalButton from "./PaypalButton";
import { useSelector, useDispatch } from "react-redux";
import { basketFetch } from "../../redux/reducers/cartSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Cart.scss";

function Cart() {
  const token = useSelector((state) => state.getToken.token);
  const { cartItem } = useSelector((state) => state.cart);

  const dispatch = useDispatch();

  const [cart, setCart] = useState(cartItem);
  const [total, setTotal] = useState(0);

  const notifyy = () => {
    toast.success("Ürün Sepetten Silindi", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  useEffect(() => {
    const getTotal = () => {
      const total = cartItem.reduce((prev, item) => {
        return prev + item.price * item.quantity;
      }, 0);

      setTotal(total);
    };
    getTotal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItem, basketFetch]);

  const addToCart = async (cart) => {
    await axios.patch(
      "/user/addcart",
      { cart },
      {
        headers: { Authorization: token },
      }
    );
  };

  const increment = (id) => {
    const items = cartItem.map((item) => {
      if (item._id === id) {
        return {
          ...item,
          quantity: item.quantity + 1,
        };
      }
      return item;
    });
    let umut = [...items];
    addToCart(umut);
  };

  const decrement = (id) => {
    const items = cartItem.map((item) => {
      if (item._id === id) {
        if (item.quantity > 1) {
          return {
            ...item,
            quantity: item.quantity - 1,
          };
        }
      }
      return item;
    });

    let ttt = [...items];
    console.log(items);
    addToCart(ttt);
  };

  let arrayForSort = "";

  const removeProduct = (id) => {
    cartItem.forEach((element, index) => {
      if (element._id === id) {
        arrayForSort = [...cartItem];
        arrayForSort.splice(index, 1);
      }
    });
    addToCart(arrayForSort);
    notifyy();
  };

  const notify = () => {
    toast.info("Ödeme İşlemi Başarı İle Gerçekleşti", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const tranSuccess = async (payment) => {
    const { paymentID, address } = payment;
    await axios.post(
      "/api/payment",
      { cart, paymentID, address },
      {
        headers: { Authorization: token },
      }
    );
    addToCart([]);
    dispatch(basketFetch(token));
    notify();
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps

  useEffect(() => {
    dispatch(basketFetch(token));
    setCart(cartItem);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [removeProduct, increment, decrement]);

  if (cartItem.length === 0) return <h2 className="cardInfo">Sepetiniz Boş</h2>;
  return (
    <div className="cartWrapper">
      <div className="total">
        <h3>
          TOPLAM: <span>&#8378;</span>
          {total}
        </h3>
        <div className="paypalButton">
          <PaypalButton total={total} tranSuccess={tranSuccess} />
        </div>
      </div>
      {cartItem.map((product) => (
        <div className="cart" key={product._id}>
          <img className="cartImg" src={product.images.url} alt="" />
          <div className="cartInfo">
            <h2>{product.title}</h2>

            <h3>
              <span>&#8378;</span> {product.price}
            </h3>
            <div className="cartCount">
              <button onClick={() => decrement(product._id)}> - </button>
              <span>{product.quantity}</span>
              <button onClick={() => increment(product._id)}> + </button>
            </div>

            <div className="delete" onClick={() => removeProduct(product._id)}>
              X
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Cart;
