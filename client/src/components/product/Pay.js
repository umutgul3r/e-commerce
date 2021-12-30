import React, { useEffect } from "react";
import Loading from "../utils/Loading";
import { useSelector, useDispatch } from "react-redux";
import PayItem from "./PayItem";
import "./Pay.scss";
import { productsFetch } from "../../redux/reducers/productSlice";

function Pay() {
  const auth = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.products);
  const { user } = auth;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(productsFetch([10, "", "", ""]));
  }, [dispatch]);

  return (
    <div className="payWrapper">
      <div className="pay">
        {items.map((com) => (
          <>
            {com.seller_id == user._id && com.sold > 0 ? (
              <PayItem com={com} key={com._id} />
            ) : (
              ""
            )}
          </>
        ))}
      </div>
      {items.length === 0 && <Loading />}
    </div>
  );
}

export default Pay;
