import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { SiAdafruit } from "react-icons/si";
import { toast } from "react-toastify";
import "./Header.scss";
import Menu from "../../assets/icons/menu.png";
import Cart from "../../assets/icons/cart.svg";

function Header() {
  const auth = useSelector((state) => state.auth);
  const { isLogged, isAdmin, isSeller } = auth;
  const { cartItem } = useSelector((state) => state.cart);

  const notify = () => toast("Çıkış Başarılı");

  const logoutUser = async () => {
    await axios.get("/user/logout");
    localStorage.removeItem("firstLogin");
    notify();
    window.location.href = "/";
  };

  const adminRouter = () => {
    return (
      <>
        <li>
          <Link className="link" to="/create_product">
            Ürün Oluştur
          </Link>
        </li>
        <li>
          <Link className="link" to="/category">
            Kategoriler
          </Link>
        </li>
        <li>
          <Link className="link" to="/support">
            Destek
          </Link>
        </li>
      </>
    );
  };
  const sellerRouter = () => {
    return (
      <>
        <li>
          <Link className="link" to="/create_product">
            Ürün Oluştur
          </Link>
        </li>
        <li>
          <Link className="link" to="/my_products">
            Ürünlerim
          </Link>
        </li>
        <li>
          <Link className="link" to="/pay">
            Satışlarım
          </Link>
        </li>
      </>
    );
  };

  const loggedRouter = () => {
    return (
      <>
        <li>
          <Link className="link" to="/profile">
            {isLogged ? "Profil" : ""}
          </Link>
        </li>
        <li>
          <Link className="link" to="/" onClick={logoutUser}>
            Çıkış
          </Link>
        </li>
      </>
    );
  };

  const [menu, setMenu] = useState(true);

  return (
    <header className="headerWrapper">
      <div className="logo">
        <Link to="/">
          <SiAdafruit /> 44 Store
        </Link>
      </div>
      <div
        onClick={() => {
          setMenu(!menu);
        }}
        className={menu ? "hidden" : "show"}
      >
        <ul className="menuItems">
          {isAdmin && adminRouter()}
          {isSeller ? sellerRouter() : ""}
          {isLogged ? (
            loggedRouter()
          ) : (
            <li>
              <Link className="link" to="/login">
                Giriş Yap{" "}
              </Link>
            </li>
          )}

          <li>
            <img src={Menu} alt="" width="30" className="menu" />
          </li>
        </ul>
      </div>
      <img
        className="burger"
        onClick={() => {
          setMenu(!menu);
        }}
        src={Menu}
        alt=""
      />
      <ul className="menuItem">
        {isAdmin && adminRouter()}
        {isSeller ? sellerRouter() : ""}
        {isLogged ? (
          loggedRouter()
        ) : (
          <li>
            <Link className="link" to="/login">
              Giriş Yap{" "}
            </Link>
          </li>
        )}

        <li>
          <img src={Menu} alt="" width="30" className="menu" />
        </li>
      </ul>
      {isAdmin || isSeller ? (
        ""
      ) : (
        <div className="cart-icon">
          <span>{cartItem.length}</span>
          <Link to="/cart">
            <img src={Cart} alt="" width="30" />
          </Link>
        </div>
      )}
    </header>
  );
}

export default Header;
