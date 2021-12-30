import React from "react";
import Button from "../utils/Button";
import HideImg from "../user/icons/checked.png";
import ShowImg from "../user/icons/crossed.png";
import { useSelector } from "react-redux";

import { Link } from "react-router-dom";

function ProductItem({ product, isAdmin, deleteProduct, isPassword }) {
  const auth = useSelector((state) => state.auth);
  const { isSeller } = auth;
  return (
    <Link to={`/detail/${product._id}`}>
      <div className="product_card">
        {isSeller && (
          <img
            className="checkItemAll"
            src={isPassword ? HideImg : ShowImg}
            alt="selectAll"
          />
        )}
        <img src={product.images.url} alt="" />
        <div className="product_box">
          <h2 title={product.title}>{product.title}</h2>
          <span>
            {product.price}
            <span>&#8378;</span>
          </span>
        </div>
        <Button product={product} deleteProduct={deleteProduct} />
      </div>
    </Link>
  );
}

export default ProductItem;
