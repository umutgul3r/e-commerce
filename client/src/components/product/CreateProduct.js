import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CreateProduct.scss";

import Loading from "../utils/Loading";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { productsFetch } from "../../redux/reducers/productSlice";

function CreateProduct() {
  const auth = useSelector((state) => state.auth);
  const { isAdmin, user, isSeller } = auth;
  const initialState = {
    product_id: "",
    title: "",
    seller_id: user._id,
    price: 0,
    description: "",
    content: "",
    category: "all",
    _id: "",
    sellerName: user.name,
  };
  const [product, setProduct] = useState(initialState);

  const { categoryItems } = useSelector((state) => state.category);
  const { items } = useSelector((state) => state.products);

  const [images, setImages] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const token = useSelector((state) => state.getToken.token);

  const navigate = useNavigate();
  const param = useParams();

  const [onEdit, setOnEdit] = useState(false);

  useEffect(() => {
    if (param.id) {
      setOnEdit(true);
      items.forEach((product) => {
        if (product._id === param.id) {
          setProduct(product);
          setImages(product.images);
        }
      });
    } else {
      setOnEdit(false);
      setProduct(initialState);
      setImages(false);
    }
  }, [param.id, items]);

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      if (!isAdmin && !isSeller) return alert("Yetkiniz yok");
      const file = e.target.files[0];

      if (!file) return alert("File not exist.");

      if (file.size > 1024 * 1024)
        // 1mb
        return alert("Size too large!");

      if (file.type !== "image/jpeg" && file.type !== "image/png")
        // 1mb
        return alert("File format is incorrect.");

      let formData = new FormData();
      formData.append("file", file);

      setLoading(true);
      const res = await axios.post("/api/upload_profil", formData, {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: token,
        },
      });
      setLoading(false);
      setImages(res.data);
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  const handleDestroy = async () => {
    try {
      if (!isAdmin && !isSeller) return alert("Yetkiniz Yok");
      setLoading(true);
      await axios.post(
        "/api/destroy",
        { public_id: images.public_id },
        {
          headers: { Authorization: token },
        }
      );
      setLoading(false);
      setImages(false);
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!isAdmin && !isSeller) return alert("Yetkiniz yok");
      if (!images) return alert("Resim yüklenmedi");

      if (onEdit) {
        await axios.put(
          `/api/products/${product._id}`,
          { ...product, images },
          {
            headers: { Authorization: token },
          }
        );
      } else {
        await axios.post(
          "/api/products",
          { ...product, images },
          {
            headers: { Authorization: token },
          }
        );
      }
      navigate("/");
    } catch (err) {
      alert(err.response.data.msg);
    }
    dispatch(productsFetch([3, "", "", ""]));
  };

  const styleUpload = {
    display: images ? "block" : "none",
  };
  return (
    <div className="productWrapper">
      <div className="upload">
        <input type="file" name="file" id="file_up" onChange={handleUpload} />
        {loading ? (
          <div id="fileImg">
            <Loading />
          </div>
        ) : (
          <div id="fileImg" style={styleUpload}>
            <img src={images ? images.url : ""} alt="" />
            <span onClick={handleDestroy}>X</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row">
          <label htmlFor="product_id">Ürün ID</label>
          <input
            type="text"
            name="product_id"
            id="product_id"
            required
            onChange={handleChangeInput}
            disabled={onEdit}
          />
        </div>
        <div className="row">
          <input
            type="hidden"
            name="sellerName"
            id="sellerName"
            required
            value={user.name}
            onChange={handleChangeInput}
            disabled={onEdit}
          />
        </div>

        <div className="row">
          <label htmlFor="title">Başlık</label>
          <input
            type="text"
            name="title"
            id="title"
            required
            value={product.title}
            onChange={handleChangeInput}
          />
        </div>

        <div className="row">
          <label htmlFor="price">Fiyat</label>
          <input
            type="number"
            name="price"
            id="price"
            required
            value={product.price}
            onChange={handleChangeInput}
          />
        </div>

        <div className="row">
          <label htmlFor="description">Açıklama</label>
          <textarea
            type="text"
            name="description"
            id="description"
            required
            value={product.description}
            rows="5"
            onChange={handleChangeInput}
          />
        </div>

        <div className="row">
          <label htmlFor="content">Ürün Özellikleri</label>
          <textarea
            type="text"
            name="content"
            id="content"
            required
            value={product.content}
            rows="7"
            onChange={handleChangeInput}
          />
        </div>

        <div className="row">
          <label htmlFor="categories">Kategoriler: </label>
          <select
            name="category"
            value={product.category}
            onChange={handleChangeInput}
          >
            <option value="">Lütfen bir kategori seçin</option>
            {categoryItems.map((category) => (
              <option value={category._id} key={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => {
            window.scrollTo(0, 0);
          }}
          type="submit"
        >
          {onEdit ? "Güncelle" : "Ekle"}
        </button>
      </form>
    </div>
  );
}

export default CreateProduct;
