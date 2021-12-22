import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { showErrMsg, showSuccessMsg } from "../utils/Notification";

export default function ActivationEmail() {
  const { activation_token } = useParams();
  const [err, setErr] = useState();
  const [success, setSucces] = useState();

  useEffect(() => {
    if (activation_token) {
      const activationEmail = async () => {
        try {
          const res = await axios.post("/user/activation", {
            activation_token,
          });
          setSucces(res.data.msg);
        } catch (err) {
          err.response.data.msg && setErr(err.response.data.msg);
        }
      };
      activationEmail();
    }
  }, [activation_token]);

  return (
    <div className="activeWrapper">
      {err && showErrMsg(err)}
      {success && showSuccessMsg(success)}
    </div>
  );
}
