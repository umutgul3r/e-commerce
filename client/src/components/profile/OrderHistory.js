import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { cartFetch, customerCartFetch } from "../../redux/reducers/cartSlice";
import "./Order.scss";

function OrderHistory() {
  const token = useSelector((state) => state.getToken.token);
  const auth = useSelector((state) => state.auth);
  const { orderItems } = useSelector((state) => state.cart);
  const { isAdmin, isSeller } = auth;
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAdmin) {
      dispatch(cartFetch(token));
    } else {
      dispatch(customerCartFetch(token));
    }
  }, [dispatch, isAdmin, token]);

  return (
    <div className="history-page">
      <h2>Siparişler</h2>
      <input type="checkbox" id="scales" name="scales" checked />

      <h4>
        Toplam {orderItems.length}{" "}
        {isAdmin || isSeller ? "Satışınız" : "Siparişiniz"} Vardır
      </h4>

      <table>
        <thead>
          <tr>
            <th>{isAdmin ? "Alıcı İsmi" : <th></th>}</th>
            <th>Sipariş ID</th>
            <th>Sipariş Tarihi</th>
          </tr>
        </thead>
        <tbody>
          {orderItems.map((items) => (
            <tr key={items._id}>
              <td>{isAdmin ? items.name : ""}</td>
              <td>{items.paymentID}</td>
              <td>{new Date(items.createdAt).toLocaleDateString()}</td>
              <td>
                <Link to={`/history/${items._id}`}>İncele</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderHistory;
