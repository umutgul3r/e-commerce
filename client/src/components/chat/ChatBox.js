import React, { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";
import { useSelector } from "react-redux";
import "./ChatBox.scss";
import Chat from "../../assets/icons/help.png";

const ENDPOINT =
  window.location.host.indexOf("localhost") >= 0
    ? "http://127.0.0.1:5000"
    : window.location.host;

export default function ChatBox() {
  const auth = useSelector((state) => state.auth);
  const { user, isAdmin } = auth;
  const [socket, setSocket] = useState(null);
  const uiMessagesRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [messageBody, setMessageBody] = useState("");
  const [messages, setMessages] = useState([
    { name: "Destek", body: "Merhaba Lütfen Sorununuzu Belirtiniz" },
  ]);

  useEffect(() => {
    if (uiMessagesRef.current) {
      uiMessagesRef.current.scrollBy({
        top: uiMessagesRef.current.clientHeight,
        left: 0,
        behavior: "smooth",
      });
    }
    if (socket) {
      socket.emit("onLogin", {
        _id: user._id,
        name: user.name,
        isAdmin: isAdmin,
      });
      socket.on("message", (data) => {
        setMessages([...messages, { body: data.body, name: data.name }]);
      });
    }
  }, [messages, isOpen, socket, user]);

  const supportHandler = () => {
    setIsOpen(true);
    console.log(ENDPOINT);
    const sk = socketIOClient(ENDPOINT);
    setSocket(sk);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    if (!messageBody.trim()) {
      alert("Burası çok bırakılamaz");
    } else {
      setMessages([...messages, { body: messageBody, name: user.name }]);
      setMessageBody("");
      setTimeout(() => {
        socket.emit("onMessage", {
          body: messageBody,
          name: user.name,
          isAdmin: isAdmin,
          _id: user._id,
        });
      }, 1000);
    }
  };
  const closeHandler = () => {
    setIsOpen(false);
  };
  return (
    <div className="chatbox">
      {!isOpen ? (
        <button
          type="button"
          className="supportButton"
          onClick={supportHandler}
        >
          <img className="supportImg" src={Chat} alt="" />
        </button>
      ) : (
        <div>
          <div className="supportAreas">
            <button onClick={closeHandler} className="closeButton">
              Bitir
            </button>
          </div>
          <ul ref={uiMessagesRef}>
            {messages.map((msg, index) => (
              <li key={index}>
                <strong>{`${msg.name}: `}</strong> {msg.body}
              </li>
            ))}
          </ul>
          <div>
            <form onSubmit={submitHandler} className="supportArea">
              <input
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
                type="text"
                placeholder="Merhaba..."
              />
              <button className="submitButton" type="submit">
                Gönder
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
