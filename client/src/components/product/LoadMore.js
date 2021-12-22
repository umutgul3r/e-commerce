import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { productsFetch } from "../../redux/reducers/productSlice";
import { pages } from "../../redux/reducers/productSlice";
import More from "../../assets/icons/more.png";
import "./LoadMore.scss";

function LoadMore() {
  const dispatch = useDispatch();
  const { result } = useSelector((state) => state.products);
  const { page } = useSelector((state) => state.products);

  const load = () => {
    dispatch(pages(page + 2));
    dispatch(productsFetch([page, "", "", ""]));
  };

  return (
    <div className="loadMore">
      {result < 9 ? (
        ""
      ) : (
        <button onClick={load}>
          <img src={More} alt="" />
        </button>
      )}
    </div>
  );
}

export default LoadMore;
