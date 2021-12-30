import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { showErrMsg, showSuccessMsg } from "../utils/Notification";
import { useDispatch } from "react-redux";
import { login } from "../../redux/reducers/authSlice";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "react-google-login";
import HideImg from "./icons/hidden.png";
import ShowImg from "./icons/eye.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.scss";

const initialState = {
  email: " ",
  password: "",
  err: "",
  success: "",
};

export default function Login() {
  const [user, setUser] = useState(initialState);
  const [isPassword, setisPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { email, password, err, success } = user;

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value, err: "", success: "" });
  };

  const notify = () => {
    toast.success("Giriş Başarılı", {
      position: "top-center",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/user/login", { email, password });
      setUser({ ...user, err: "", success: res.data.msg });
      localStorage.setItem("firstLogin", true);
      notify();
      dispatch(login(user));
      navigate("/");
    } catch (err) {
      err.response.data.msg &&
        setUser({ ...user, err: err.response.data.msg, success: "" });
    }
  };

  const responseGoogle = async (response) => {
    try {
      const res = await axios.post("/user/google_login", {
        tokenId: response.tokenId,
      });

      setUser({ ...user, error: "", success: res.data.msg });
      localStorage.setItem("firstLogin", true);
      notify();
      console.log(response);
      dispatch(login());
      navigate("/");
    } catch (err) {
      err.response.data.msg &&
        setUser({ ...user, err: err.response.data.msg, success: "" });
    }
  };

  return (
    <>
      <div className="loginWrapper">
        <h2>Giriş Yap</h2>
        {err && showErrMsg(err)}
        {success && showSuccessMsg(success)}
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">E-posta</label>
            <input
              type="email"
              id="email"
              placeholder="******@email.com"
              value={email}
              name="email"
              onChange={handleChangeInput}
            />
          </div>
          <label htmlFor="password">Şifre</label>
          <div className="dd">
            <input
              type={isPassword ? "text" : "password"}
              id="password"
              placeholder="***********"
              value={password}
              name="password"
              //   pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              title="Şifren 1 büyük harf 1 rakam ve en az 8 karakter içermelidir."
              onChange={handleChangeInput}
            />

            <img
              className="hideImg"
              title={isPassword ? "Hide password" : "Show password"}
              onClick={() => setisPassword((prevState) => !prevState)}
              alt="show"
              src={isPassword ? HideImg : ShowImg}
            />
          </div>
          <div className="loginSubmit">
            <button className="loginButton" type="submit">
              Giriş Yap
            </button>
            <Link className="registerButton" to="/register">
              Kayıt ol
            </Link>
            <Link className="fgPwd" to="/forgot_password">
              Şifremi Unuttum
            </Link>
          </div>
        </form>
        <div className="social">
          <GoogleLogin
            clientId="431083699368-bba3lva5o2dl6mf4aikuk778lrk9h8fj.apps.googleusercontent.com"
            buttonText="Login"
            onSuccess={responseGoogle}
            cookiePolicy={"single_host_origin"}
          />
        </div>
        <p></p>
      </div>
    </>
  );
}
