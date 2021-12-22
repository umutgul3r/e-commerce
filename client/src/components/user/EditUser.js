import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { showSuccessMsg, showErrMsg } from "../utils/Notification";
import "./EditUser.scss";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import change from "../../assets/icons/changes.png";

function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editUser, setEditUser] = useState([]);

  const users = useSelector((state) => state.getAllUsers.user);
  const token = useSelector((state) => state.getToken.token);
  const auth = useSelector((state) => state.auth);
  const { isSeller } = auth;

  const [checkAdmin, setCheckAdmin] = useState(false);
  const [err, setErr] = useState(false);
  const [success, setSuccess] = useState(false);
  const [num, setNum] = useState(0);

  const notify = () => {
    toast.success("Güncelleme Başarılı", {
      position: "top-center",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  useEffect(() => {
    if (users.length !== 0) {
      users.forEach((user) => {
        if (user._id === id) {
          setEditUser(user);
          setCheckAdmin(user.role === 2 ? true : false);
        }
      });
    } else {
      navigate("/profile");
    }
  }, [users, id, navigate]);

  const handleUpdate = async () => {
    try {
      if (num % 2 !== 1) {
        const res = await axios.patch(
          `/user/update_role/${editUser._id}`,
          {
            role: checkAdmin ? 2 : 0,
          },
          {
            headers: { Authorization: token },
          }
        );
        console.log(res);
        notify();
        navigate(-1);
        setSuccess(res.data.msg);
        setNum(0);
      }
    } catch (err) {
      err.response.data.msg && setErr(err.response.data.msg);
    }
  };

  const handleCheck = () => {
    setSuccess("");
    setErr("");
    setCheckAdmin(!checkAdmin);
    setNum(num + 2);
  };

  return (
    <div className="editProfileWrapper">
      <div className="editLeftSide">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            defaultValue={editUser.name}
            disabled
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            defaultValue={editUser.email}
            disabled
          />
        </div>

        <div className="form-group">
          <p className="isSeller">
            {editUser.role == 2 ? "Bu Kişi Satıcı" : "Bu Kişi Satıcı Değil"}
          </p>
          <img className="changeIcon" src={change} alt="" />
          <input
            type="checkbox"
            id="isAdmin"
            checked
            className="checkSeller"
            onChange={handleCheck}
          ></input>

          <label htmlFor="isAdmin">Değiştir</label>
        </div>

        <button onClick={handleUpdate}>Güncelle</button>
        {err && showErrMsg(err)}
      </div>
    </div>
  );
}

export default EditUser;
