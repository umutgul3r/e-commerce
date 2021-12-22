import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductItem from "./ProductItem";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { basketFetch } from "../../redux/reducers/cartSlice";
import { add } from "../../redux/reducers/productSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./DetailProduct.scss";

function DetailProduct() {
  const { items } = useSelector((state) => state.products);
  const token = useSelector((state) => state.getToken.token);
  const { cartItem } = useSelector((state) => state.cart);
  const [cart, setCart] = useState(cartItem);
  const auth = useSelector((state) => state.auth);
  const { isLogged, user, isSeller, isAdmin } = auth;
  const userCheck = user.name;

  const [detailProduct, setDetailProduct] = useState([]);

  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const notifyDelete = () => {
    toast.success("Yorum Başarı İle Silindi", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const deleteComment = async (id) => {
    try {
      console.log(id);
      await axios.delete(`/api/products/comment/${id}`);
    } catch (err) {
      alert(err.response.data.msg);
    }
    notifyDelete();
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  async function addCart(product) {
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
      notify();
    } else {
      alert("Bu ürün zaten sepete ekli");
    }
    dispatch(basketFetch(token));
    console.log("basket");
  }

  useEffect(() => {
    if (params.id) {
      items.forEach((product) => {
        if (product._id === params.id) {
          setDetailProduct(product);
          localStorage.setItem("edit", JSON.stringify(product));
        }
      });
    }
    setDetailProduct(JSON.parse(localStorage.getItem("edit")));
  }, [items, params.id]);

  if (detailProduct.length === 0) {
    return null;
  }

  const getComment = detailProduct.comment;

  return (
    <>
      <div className="detail">
        <img src={detailProduct.images.url} alt="" />
        <div className="boxDetail">
          <div className="boxDetailTitle">
            <h2 className="productTitle">{detailProduct.title}</h2>
          </div>
          <span>
            <span>&#8378;</span> {detailProduct.price}
          </span>
          <p>{detailProduct.description}</p>
          <p>{detailProduct.content}</p>
          <p>Satış: {detailProduct.sold}</p>
          <p className="sellerTitle">Satıcı İsmi: {detailProduct.sellerName}</p>
          {!isSeller && !isAdmin ? (
            <button
              className="detailAddCard"
              onClick={() => {
                addCart(detailProduct);
              }}
            >
              Sepete Ekle
            </button>
          ) : (
            ""
          )}
          <div className="commentTitle">YORUMLAR</div>
          <div className="commentArea">
            {getComment.map((com) => (
              <div>
                {com.comment.comment}
                {com.comment.comment && com.postUser == userCheck ? (
                  <button onClick={() => deleteComment(com.id)}>Sil</button>
                ) : (
                  ""
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h2>Geçmiş</h2>
        <div className="products">
          {items.map((product) => {
            return product.category === detailProduct.category ? (
              <ProductItem key={product._id} product={product} />
            ) : null;
          })}
        </div>
      </div>
    </>
  );
}

export default DetailProduct;
