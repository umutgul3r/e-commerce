import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { showErrMsg, showSuccessMsg } from "../utils/Notification";
import { isLenght, isMatch } from "../utils/Validation";
import "./ResetPassword.scss";

const initialState = {
  password: "",
  re_password: "",
  err: "",
  success: "",
};

function ResetPassword() {
  const [data, setData] = useState(initialState);
  const { id } = useParams();
  console.log(useParams().id);

  const { password, re_password, err, success } = data;

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value, err: "", success: "" });
  };

  const handleResetPass = async () => {
    if (isLenght(password))
      return setData({
        ...data,
        err: "Password must be at least 6 characters.",
        success: "",
      });

    if (!isMatch(password, re_password))
      return setData({ ...data, err: "Password did not match.", success: "" });

    try {
      const res = await axios.post(
        "/user/reset",
        { password },
        {
          headers: { Authorization: id },
        }
      );

      return setData({ ...data, err: "", success: res.data.msg });
    } catch (err) {
      err.response.data.msg &&
        setData({ ...data, err: err.response.data.msg, success: "" });
    }
  };

  return (
    <div className="fgWrapper">
      <h2>Şifreni Sıfırla</h2>

      <div className="fg">
        {err && showErrMsg(err)}
        {success && showSuccessMsg(success)}

        <label htmlFor="password">Şifre</label>
        <input
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={handleChangeInput}
        />

        <label htmlFor="re_password">Tekrar Şifre</label>
        <input
          type="password"
          name="re_password"
          id="re_password"
          value={re_password}
          onChange={handleChangeInput}
        />

        <button onClick={handleResetPass}>Şifreni Sıfırla</button>
      </div>
    </div>
  );
}

export default ResetPassword;
