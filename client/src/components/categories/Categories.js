import React, { useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { categoryFetch } from "../../redux/reducers/categorySlice";
import "./Categories.scss";

function Categories() {
  const dispatch = useDispatch();

  const { categoryItems } = useSelector((state) => state.category);

  const [category, setCategory] = useState("");

  const [onEdit, setOnEdit] = useState(false);
  const [id, setID] = useState("");

  const token = useSelector((state) => state.getToken.token);

  const createCategory = async (e) => {
    e.preventDefault();
    try {
      if (onEdit) {
        const res = await axios.put(
          `/api/category/${id}`,
          { name: category },
          {
            headers: { Authorization: token },
          }
        );
        alert(res.data.msg);
      } else {
        const res = await axios.post(
          "/api/category",
          { name: category },
          {
            headers: { Authorization: token },
          }
        );
        alert(res.data.msg);
      }
      setOnEdit(false);
      setCategory("");
      dispatch(categoryFetch());
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  const editCategory = async (id, name) => {
    setID(id);
    setCategory(name);
    setOnEdit(true);
  };

  const deleteCategory = async (id) => {
    try {
      const res = await axios.delete(`/api/category/${id}`, {
        headers: { Authorization: token },
      });
      alert(res.data.msg);
      dispatch(categoryFetch());
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  return (
    <div className="categoriWrapper">
      <form onSubmit={createCategory}>
        <label htmlFor="category">Kategori</label>
        <input
          type="text"
          name="category"
          value={category}
          required
          onChange={(e) => setCategory(e.target.value)}
        />

        <button type="submit">{onEdit ? "Güncelle" : "Oluştur"}</button>
      </form>

      <div className="categoriess">
        {categoryItems.map((category) => (
          <div className="categories" key={category._id}>
            <p>{category.name}</p>
            <div>
              <button onClick={() => editCategory(category._id, category.name)}>
                Düzenle
              </button>
              <button onClick={() => deleteCategory(category._id)}>Sil</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Categories;
