import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { showErrMsg, showSuccessMsg } from "../utils/Notification";
import { isEmpty, isEmail, isLenght, isMatch } from "../utils/Validation";

const initialState = {
  name: "",
  email: " ",
  password: "",
  re_password: "",
  err: "",
  success: "",
};

export default function Register() {
  const [user, setUser] = useState(initialState);

  const { name, email, password, re_password, err, success } = user;

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value, err: "", success: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEmpty(name) || isEmpty(password))
      return setUser({
        ...user,
        err: "Lütfen Tüm Alanları Doldurun",
        success: "",
      });

    if (!isEmail(email))
      return setUser({ ...user, err: "Invalid emails.", success: "" });

    if (isLenght(password))
      return setUser({ ...user, err: "Şifre En Az 6 Karakter Olmalıdır" });

    if (!isMatch(password, re_password))
      return setUser({ ...user, err: "Şifreler Eşleşmiyor" });

    try {
      const res = await axios.post("/user/register", {
        name,
        email,
        password,
      });

      setUser({ ...user, err: "", success: res.data.msg });
    } catch (err) {
      err.response.data.msg &&
        setUser({ ...user, err: err.response.data.msg, success: "" });
    }
  };
  return (
    <>
      <div className="loginWrapper">
        <h2>Kayıt Ol</h2>
        {err && showErrMsg(err)}
        {success && showSuccessMsg(success)}
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">İsim</label>
            <input
              type="name"
              id="name"
              placeholder="İsim Soyisim"
              value={name}
              name="name"
              onChange={handleChangeInput}
            />
          </div>
          <div>
            <label htmlFor="email">E-Posta</label>
            <input
              type="email"
              id="email"
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
              placeholder="********@email.com"
              value={email}
              name="email"
              onChange={handleChangeInput}
            />
          </div>
          <div>
            <label htmlFor="password">Şifre</label>
            <input
              type="password"
              id="password"
              placeholder="********"
              value={password}
              name="password"
              maxlength="16"
              onChange={handleChangeInput}
            />
          </div>
          <div>
            <label htmlFor="re_password">Tekrar Şifre</label>
            <input
              type="password"
              id="re_password"
              placeholder="********"
              value={re_password}
              maxlength="16"
              name="re_password"
              onChange={handleChangeInput}
            />
          </div>
          <button className="registerButton" type="submit">
            Kayıt Ol
          </button>
          <p>
            Zaten Hesabın Var Mı ? <Link to="/login">Giriş Yap</Link>
          </p>
        </form>
      </div>
    </>
  );
}
