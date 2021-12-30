import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PayItem({ com }) {
  const [total, setTotal] = useState(0);

  const auth = useSelector((state) => state.auth);
  const { user } = auth;

  useEffect(() => {
    setTotal(com.sold * com.price);
  });

  return (
    <Link to={`/detail/${com._id}`}>
      {com.sold !== 0 ? (
        <div className="cardWrapper">
          <div className="product_box">
            <img src={com.images.url} alt="" />
            <h2 title={com.title}>{com.title}</h2>
            <span>
              Fiyat :{com.price}
              <span>&#8378;</span>
            </span>
          </div>
          <div>Toplam {com.sold} Adet Sattınız</div>
          <div>
            Kazandığınız Tutar : {total}
            <span>&#8378;</span>
          </div>
        </div>
      ) : (
        ""
      )}
    </Link>
  );
}
