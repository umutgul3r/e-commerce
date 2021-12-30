import React, { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";
import { useSelector } from "react-redux";
import MessageBox from "./MessageBox";
import "./SupportScreen.scss";

let allUsers = [];
let allMessages = [];
let allSelectedUser = {};
const ENDPOINT =
  window.location.host.indexOf("localhost") >= 0
    ? "http://127.0.0.1:5000"
    : window.location.host;

export default function SupportScreen() {
  const [selectedUser, setSelectedUser] = useState({});
  const [socket, setSocket] = useState(null);
  const uiMessagesRef = useRef(null);
  const [messageBody, setMessageBody] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  const auth = useSelector((state) => state.auth);
  const { user, isAdmin } = auth;

  useEffect(() => {
    if (uiMessagesRef.current) {
      uiMessagesRef.current.scrollBy({
        top: uiMessagesRef.current.clientHeight,
        left: 0,
        behavior: "smooth",
      });
    }

    if (!socket) {
      const sk = socketIOClient(ENDPOINT);
      setSocket(sk);
      sk.emit("onLogin", {
        _id: user._id,
        name: user.name,
        isAdmin: isAdmin,
      });
      sk.on("message", (data) => {
        if (allSelectedUser._id === data._id) {
          allMessages = [...allMessages, data];
        } else {
          const existUser = allUsers.find((user) => user._id === data._id);
          if (existUser) {
            allUsers = allUsers.map((user) =>
              user._id === existUser._id ? { ...user, unread: true } : user
            );
            setUsers(allUsers);
          }
        }
        setMessages(allMessages);
      });
      sk.on("updateUser", (updatedUser) => {
        const existUser = allUsers.find((user) => user._id === updatedUser._id);
        if (existUser) {
          allUsers = allUsers.map((user) =>
            user._id === existUser._id ? updatedUser : user
          );
          setUsers(allUsers);
        } else {
          allUsers = [...allUsers, updatedUser];
          setUsers(allUsers);
        }
      });
      sk.on("listUsers", (updatedUsers) => {
        allUsers = updatedUsers;
        setUsers(allUsers);
      });
      sk.on("selectUser", (user) => {
        allMessages = user.messages;
        setMessages(allMessages);
      });
    }
  }, [messages, socket, users, user]);

  const selectUser = (user) => {
    allSelectedUser = user;
    setSelectedUser(allSelectedUser);
    const existUser = allUsers.find((x) => x._id === user._id);
    if (existUser) {
      allUsers = allUsers.map((x) =>
        x._id === existUser._id ? { ...x, unread: false } : x
      );
      setUsers(allUsers);
    }
    socket.emit("onUserSelected", user);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!messageBody.trim()) {
      alert("bu alan boş bırakılamaz");
    } else {
      allMessages = [...allMessages, { body: messageBody, name: user.name }];
      setMessages(allMessages);
      setMessageBody("");
      setTimeout(() => {
        socket.emit("onMessage", {
          body: messageBody,
          name: user.name,
          isAdmin: isAdmin,
          _id: selectedUser._id,
        });
      }, 1000);
    }
  };

  return (
    <div className="supportWrapper">
      <div className="support-users">
        {users.filter((x) => x._id !== user._id).length === 0 && (
          <MessageBox>Çevrim İçin Kullanıcı Bulunamadı</MessageBox>
        )}
        <ul className="ul">
          {users
            .filter((x) => x._id !== user._id)
            .map((user) => (
              <li
                key={user._id}
                className={user._id === selectedUser._id ? "  selected" : "  "}
              >
                <button
                  className="state"
                  type="button"
                  onClick={() => selectUser(user)}
                >
                  {user.name}
                  <li
                    className={
                      user.unread
                        ? "unread"
                        : user.online
                        ? "online"
                        : "offline"
                    }
                  />
                </button>
              </li>
            ))}
        </ul>
      </div>
      <div className="support-messages">
        {!selectedUser._id ? (
          <MessageBox>Bir Kullanıcı Seç ve Yardım Etmeye Başla</MessageBox>
        ) : (
          <div>
            <div>
              <strong>{selectedUser.name} e Yardım et </strong>
            </div>
            <ul ref={uiMessagesRef}>
              {messages.length === 0 && <li>Mesaj Bulunamadı</li>}
              {messages.map((msg, index) => (
                <li key={index}>
                  <strong>{`${msg.name}: `}</strong> {msg.body}
                </li>
              ))}
            </ul>
            <div className="textSide">
              <form onSubmit={submitHandler}>
                <input
                  value={messageBody}
                  onChange={(e) => setMessageBody(e.target.value)}
                  type="text"
                />
                <button type="submit">Gönder</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
