import axios from "axios";
import { React, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { showErrMsg, showSuccessMsg } from ".././utils/Notification";
import { isLenght, isMatch } from ".././utils/Validation";
import { fetchAllUser, getUsers } from "../../redux/reducers/getAllUsers";
import OrderHistory from "./OrderHistory";

import {
  FaUserEdit,
  FaRegTrashAlt,
  FaCheck,
  FaTimesCircle,
} from "react-icons/fa";
import "./Profile.scss";

const initialState = {
  name: "",
  password: "",
  re_password: "",
  err: "",
  success: "",
};

export default function Profile() {
  const auth = useSelector((state) => state.auth);
  const token = useSelector((state) => state.getToken.token);
  const users = useSelector((state) => state.getAllUsers.user);

  const { user, isAdmin, isSeller } = auth;

  const [data, setData] = useState(initialState);
  const [profile, setProfile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [callback, setCallback] = useState(false);

  const { name, password, re_password, err, success } = data;
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAdmin) {
      return fetchAllUser(token).then((res) => {
        dispatch(getUsers(res));
      });
    }
  }, [token, isAdmin, callback, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value, err: "", success: "" });
  };

  const changeProfil = async (e) => {
    e.preventDefault();
    try {
      const file = e.target.files[0];
      if (!file)
        return setData({
          ...data,
          err: "Yüklenecek dosya bulunamadı",
          success: "",
        });
      if (file.size > 1024 * 1024) {
        return setData({ ...data, err: "Dosya boyutu çok fazla", success: "" });
      }
      if (file.type !== "image/jpeg" && file.type !== "image/png") {
        return setData({ ...data, err: "Dosya Formatı Yanlış", success: "" });
      }

      let formData = new FormData();

      formData.append("file", file);
      setLoading(true);
      const res = await axios.post("/api/upload_profil", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token,
        },
      });
      console.log(res);
      setLoading(false);
      setProfile(res.data.url);
    } catch (err) {
      console.log(err);
      setData({ ...data, err: err.response.data.msg, success: "" });
    }
  };

  const updateInfo = () => {
    try {
      axios.patch(
        "/user/update",
        {
          name: name ? name : user.name,
          profile: profile ? profile : user.profile,
        },
        {
          headers: { Authorization: token },
        }
      );
      setData({
        ...data,
        err: "",
        success: "Güncellendi",
      });
      setInterval(() => {
        window.location.reload(true);
      }, 1000);
    } catch (err) {
      setData({
        ...data,
        err: err.response.data.msg,
        success: "",
      });
    }
  };

  const updatePassword = () => {
    if (isLenght(password)) {
      return setData({
        ...data,
        err: "Şifre en az 6 karakter olmalıdır",
        success: "",
      });
    }
    if (!isMatch(password, re_password)) {
      return setData({ ...data, err: "Şifreler eşleşmedi", success: "" });
    }
    try {
      axios.post(
        "/user/reset",
        { password },
        {
          headers: { Authorization: token },
        }
      );

      setData({ ...data, err: "", success: "Updated Success!" });
    } catch (err) {
      setData({
        ...data,
        err: err.response.data.msg,
        success: "",
      });
    }
  };

  const handleUpdate = () => {
    if (name || profile) updateInfo();
    if (password) updatePassword();
  };

  const handleDelete = async (id) => {
    try {
      if (user._id !== id) {
        if (window.confirm("Silmek istediğinizden emin misiniz ?")) {
          setLoading(true);
          await axios.delete(`/user/delete/${id}`, {
            headers: { Authorization: token },
          });
          setLoading(false);
          setCallback(!callback);
        }
      }
    } catch (err) {
      setData({ ...data, err: err.response.data.msg, success: "" });
    }
  };

  const Orders = () => {
    return (
      <>
        <OrderHistory />
      </>
    );
  };

  const Customers = () => {
    return (
      <>
        <div className="customerWrapper">
          <table className="customers">
            <thead>
              <tr>
                <th>İsim</th>
                <th>Posta</th>
                <th>Admin</th>
                <th>Satıcı</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    {user.role === 1 ? (
                      <FaCheck className="iCheck" />
                    ) : (
                      <FaTimesCircle className="iTimes" />
                    )}
                  </td>
                  <td>
                    {" "}
                    {user.role === 2 ? (
                      <FaCheck className="iCheck" />
                    ) : (
                      <FaTimesCircle className="iTimes" />
                    )}
                  </td>
                  <td>
                    <Link to={`/edit_user/${user._id}`}>
                      <FaUserEdit className="iEdit">Edit</FaUserEdit>
                    </Link>
                    <FaRegTrashAlt
                      className="iRemove"
                      onClick={() => handleDelete(user._id)}
                    >
                      Sil
                    </FaRegTrashAlt>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <OrderHistory />
      </>
    );
  };

  return (
    <>
      <div>
        {err && showErrMsg(err)}
        {success && showSuccessMsg(success)}
        {loading && <h3>Loading ...</h3>}
      </div>
      <div className="profileWrapper">
        <div className="leftSide">
          <h2>{isAdmin ? "admin " + user.name : user.name}</h2>
          <div className="profile">
            <img src={profile ? profile : auth.user.profile} alt="" />
            <span>
              <p>Değiştir</p>
              <input
                type="file"
                name="file"
                className="file"
                accept=".jpg, .png"
                onChange={changeProfil}
              />
            </span>
          </div>
          <div className="formGroup">
            <label htmlFor="name">İsim Soyisim</label>
            <input
              type="text"
              name="name"
              id="name"
              defaultValue={user.name}
              placeholder="İsim"
              onChange={handleChange}
            />
          </div>
          <div className="formGroup">
            <label htmlFor="email">E-posta</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Mail Adresi"
              value={user.email}
              disabled
            />
          </div>
          <div className="formGroup">
            <label htmlFor="password">Şifre</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Şifren"
              value={password}
              onChange={handleChange}
            />
          </div>
          <div className="formGroup">
            <label htmlFor="re_password">Şifre</label>
            <input
              type="password"
              name="re_password"
              id="re_password"
              placeholder="Tekrar şifre"
              value={re_password}
              onChange={handleChange}
            />
          </div>
          <div>
            <em>
              * Şifreni buradan değiştirmek istiyorsan , google yada facebook
              ile giriş yapmamış olmalısın
            </em>
          </div>
          <button disabled={loading} onClick={handleUpdate}>
            Güncelle
          </button>
        </div>
        {!isSeller ? (
          <div className="rightSide">
            <h2>{isAdmin ? "Kullanıcılar" : ""}</h2>
            {isAdmin ? Customers() : Orders()}
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
}
