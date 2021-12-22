import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Order.scss";

import { useSelector } from "react-redux";

function OrderDetails() {
  const { orderItems } = useSelector((state) => state.cart);
  const token = useSelector((state) => state.getToken.token);
  const { user, isAdmin } = useSelector((state) => state.auth);
  const postUser = user.name;

  const [orderDetails, setOrderDetails] = useState("");

  const [comment, setComment] = useState("");

  const params = useParams();

  const navigate = useNavigate();

  const notify = () => {
    toast.success("Yorum Kaydedildi", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  const notifyy = () => {
    toast.success("Yorumlar Başarı İle Gönderildi", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setComment({ ...comment, [name]: user.name + " : " + value });
  };

  const localItem = user.name;

  const handleSubmit = async (id) => {
    try {
      await axios.post(
        `/api/products/comment/${id}`,
        { postUser, comment },
        {
          headers: { Authorization: token },
        }
      );
      console.log(postUser);
    } catch (err) {
      alert(err.response.data.msg);
    }
    notify();
  };

  const sendComment = () => {
    localStorage.setItem(localItem, localItem);
    localStorage.setItem("umut", "silme işlemi");
    notifyy();
    navigate("/");
  };

  const dd = localStorage.getItem(localItem);

  const changeComment = () => {
    localStorage.removeItem(dd);
    window.location.reload(true);
  };

  useEffect(() => {
    if (params.id) {
      orderItems.forEach((item) => {
        if (item._id === params.id) {
          setOrderDetails(item);
          localStorage.setItem("order", JSON.stringify(item));
        }
      });
    }
    setOrderDetails(JSON.parse(localStorage.getItem("order")));
  }, [params.id, orderItems]);

  if (orderDetails.length === 0) return null;

  return (
    <div className="history-page">
      <table>
        <thead>
          <tr>
            <th>Ad</th>
            <th>Adres</th>
            <th>Posta Kodu</th>
            <th>Ülke</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{orderDetails.address.recipient_name}</td>
            <td>
              {orderDetails.address.line1 + " - " + orderDetails.address.city}
            </td>
            <td>{orderDetails.address.postal_code}</td>
            <td>{orderDetails.address.country_code}</td>
          </tr>
        </tbody>
      </table>
      <table style={{ margin: "20px 0px" }}>
        <thead>
          <tr>
            <th></th>
            <th>Ürünler</th>
            <th>Adet</th>
            <th>Fiyat</th>
            <th>Satıcı</th>
            {isAdmin ? "" : <th>Ürünü Değerlendir</th>}
          </tr>
        </thead>
        <thead>
          {orderDetails.cart.map((item) => (
            <tr key={item._id}>
              <td>
                <img src={item.images.url} alt="" />
              </td>
              <td>{item.title}</td>
              <td>{item.quantity}</td>
              <td>
                {item.price * item.quantity}
                <span>&#8378;</span>
              </td>
              <td>{item.sellerName}</td>
              <td>
                {dd === user.name ? (
                  ""
                ) : (
                  <div>
                    {isAdmin ? (
                      ""
                    ) : (
                      <div>
                        <div className="commentArea">
                          <div>
                            <textarea
                              className="commentText"
                              type="text"
                              name="comment"
                              id="comment"
                              required
                              rows="4"
                              onChange={handleChangeInput}
                            />
                          </div>
                        </div>
                        <button
                          className="orderButton"
                          onClick={() => {
                            handleSubmit(item._id);
                          }}
                        >
                          Yorumu Kaydet
                        </button>
                      </div>
                    )}{" "}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </thead>
      </table>
      {isAdmin ? (
        ""
      ) : (
        <div>
          {" "}
          <button
            className="orderButton"
            onClick={() => {
              sendComment();
            }}
          >
            Yorumları Gönder
          </button>
          <button className="orderButton" onClick={() => changeComment()}>
            Yorum Ekle
          </button>
        </div>
      )}
    </div>
  );
}

export default OrderDetails;
