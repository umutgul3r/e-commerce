import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { productsFetch } from "../../redux/reducers/productSlice";
import "./Filters.scss";

function Filters() {
  const { categoryItems } = useSelector((state) => state.category);
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");

  const dispatch = useDispatch();
  const { page } = useSelector((state) => state.products);
  const handleCategory = (e) => {
    setCategory(e.target.value);
    setSearch("");
  };

  return (
    <div className="filterWrapper">
      <input
        type="text"
        value={search}
        placeholder="Birşeyler arayın"
        onChange={(e) => setSearch(e.target.value.toLowerCase())}
      />
      <button
        className="filterSearch"
        onClick={() => dispatch(productsFetch([page, category, search, sort]))}
      >
        Ara
      </button>
      <div>
        <select
          className="filterOption"
          name="category"
          value={category}
          onChange={handleCategory}
          onClick={() =>
            dispatch(productsFetch([page, category, search, sort]))
          }
        >
          <option value="">Hepsi</option>
          {categoryItems.map((category) => (
            <option value={"category=" + category._id} key={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <select
          onClick={() =>
            dispatch(productsFetch([page, category, search, sort]))
          }
          className="filterSort"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="">En yeni</option>
          <option value="oldest">En eski</option>
          <option value="-sold">En çok satılan</option>
          <option value="-price">Fiyat: Azalan</option>
          <option value="price">Fiyat: Artan</option>
        </select>
      </div>
    </div>
  );
}

export default Filters;
