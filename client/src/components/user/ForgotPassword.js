import { React, useState } from "react";
import { isEmail } from "../utils/Validation";
import { showErrMsg, showSuccessMsg } from "../utils/Notification";
import axios from "axios";
import "./ForgotPassword.scss";

const initialState = {
  email: "",
  err: "",
  success: "",
};

function ForgotPassword() {
  const [data, setData] = useState(initialState);
  const { email, err, success } = data;

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value, err: "", success: "" });
  };

  const forgotPass = async () => {
    if (!isEmail(email)) {
      return setData({ ...data, err: "Geçersiz mail", success: "" });
    }
    try {
      const res = await axios.post("/user/forgot", { email });

      return setData({ ...data, err: "", success: res.data.msg });
    } catch (err) {
      err.response.msg &&
        setData({ ...data, err: err.response.data.msg, success: "" });
    }
  };

  return (
    <div className="fgPass">
      <h1>Şifremi Unuttum</h1>
      <div className="row">
        {err && showErrMsg(err)}
        {success && showSuccessMsg(success)}
        <label htmlFor="email">E-Postanı Gir</label>
        <input
          type="email"
          name="email"
          value={email}
          id="email"
          placeholder="****@email.com"
          onChange={handleChangeInput}
        />
        <button onClick={forgotPass}>Şifre Sıfırlama Postasını Gönder</button>
      </div>
    </div>
  );
}

export default ForgotPassword;
