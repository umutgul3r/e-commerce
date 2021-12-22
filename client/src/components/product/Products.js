import React, { useState, useEffect } from "react";
import ProductItem from "./ProductItem";
import Loading from "../utils/Loading";
import axios from "axios";
import Filters from "./Filters";
import LoadMore from "./LoadMore";
import { useSelector, useDispatch } from "react-redux";
import { productsFetch } from "../../redux/reducers/productSlice";
import "./Products.scss";

function Products() {
  const auth = useSelector((state) => state.auth);
  const token = useSelector((state) => state.getToken.token);
  const { items } = useSelector((state) => state.products);
  const { isAdmin } = auth;

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [isCheck, setIsCheck] = useState(false);
  const [isPassword, setisPassword] = useState(false);

  useEffect(() => {
    dispatch(productsFetch([2, "", "", ""]));
  }, [dispatch]);

  const deleteProduct = async (id, public_id) => {
    try {
      setLoading(true);
      const destroyImg = axios.post(
        "/api/destroy",
        { public_id },
        {
          headers: { Authorization: token },
        }
      );
      const deleteProduct = axios.delete(`/api/products/${id}`, {
        headers: { Authorization: token },
      });

      await destroyImg;
      await deleteProduct;
      setLoading(false);
    } catch (err) {
      alert(err.response.data.msg);
    }
    dispatch(productsFetch([2, "", "", ""]));
  };

  let checked = "";
  const checkAll = () => {
    items.forEach((product, i) => {
      checked = !isCheck;
    });
    setIsCheck(!isCheck);
    setisPassword((prevState) => !prevState);
  };

  const deleteAll = () => {
    items.forEach((product) => {
      if (isCheck) deleteProduct(product._id, product.images.public_id);
    });
  };

  if (loading) return <div>Ürün Siliniyor Lütfen Bekleyiniz</div>;
  return (
    <>
      <Filters />
      {isAdmin && (
        <div className="delete-all">
          <button onClick={checkAll}>Tümünü Seç</button>
          <button onClick={deleteAll}>Tümünü Sil</button>
        </div>
      )}
      <div className="products">
        {items.map((product) => {
          return (
            <ProductItem
              key={product._id}
              product={product}
              isAdmin={isAdmin}
              deleteProduct={deleteProduct}
              isPassword={isPassword}
            />
          );
        })}
      </div>
      <LoadMore />
      {items.length === 0 && <Loading />}
    </>
  );
}

export default Products;
