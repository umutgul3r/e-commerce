import React from "react";
import Loading from "../utils/Loading";
import { useSelector } from "react-redux";
import PayItem from "./PayItem";
import "./Pay.scss";

function Pay() {
  const auth = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.products);
  const { user } = auth;

  return (
    <div>
      <div className="payWrapper">
        {items.map((com) => (
          <>
            {com.seller_id == user._id && <PayItem com={com} key={com._id} />}
          </>
        ))}
      </div>
      {items.length === 0 && <Loading />}
    </div>
  );
}

export default Pay;
