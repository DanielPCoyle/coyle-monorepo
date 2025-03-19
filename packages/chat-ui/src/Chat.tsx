import "animate.css";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { ChatContext } from "./ChatContext";
import { ChatControls } from "./ChatControls";
import { Conversation } from "./Conversation";
import { LoginForm } from "./Auth/LoginForm";
import { SideBar } from "./AdminSidebar";
import { LightBox } from "./LightBox";
import { fetchConversations } from "./utils/fetchConversations";
import { fetchMessages } from "./utils/fetchMessages";
import { handleSocketEvents } from "./utils/handleSocketEvents";
import { CloseIcon } from "../assets/svg/CloseIcon";

const socketSite = process.env.NEXT_PUBLIC_SOCKET_SITE;
const socket = io(socketSite);

export const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [input, setInput] = useState("");
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [id, setId] = useState(null);
  const [token, setToken] = useState();
  const [loading, setLoading] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [typing, setTyping] = useState(null);
  const [files, setFiles] = useState([]);
  const [modalSource, setModalSource] = useState(null);
  const [modalIndex, setModalIndex] = useState(null);
  const [status, setStatus] = useState("online");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationBar, setNotificationBar] = useState([]);
  const [selectedMessageId, setSelectedMessageId] = useState(null);

  useEffect(() => {
    const handleTyping = () => {
      socket.emit("user typing", {
        conversationKey: id,
        userName,
      });
    };
    
    if (input.length > 0) {
      handleTyping();
    }
  }, [input, id, userName]);

  useEffect(() => {
    if(localStorage.getItem("jwt")){
      setToken(localStorage.getItem("jwt") || null);
    }
  },[]);

  useEffect(() => {
    fetchConversations(token, setConversations, user);
  }, [user, token]);

  useEffect(() => {
    fetchMessages(id, token, setMessages, setLoading);
  }, [id, token]);

  useEffect(() => {
    socket.emit("join", { id });
    setMessages([]);
  }, [id, user]);

  useEffect(() => {
    handleSocketEvents(socket, user, id, setMessages, setAdmins, setTyping, setConversations, setNotificationBar);
  }, [user, id]);

  useEffect(() => {
    return () => socket.emit("logout", { id: localStorage.getItem("id") });
  }, [id]);

  
  useEffect(() => {
    messages.forEach((message) => {
    if (message.parentId && user?.role === "admin" && message?.seen === false) {
    setNotificationBar((prev) => {
      const newNotifications = Array.isArray(prev) ? [...prev] : [];
      newNotifications.push({
        message: `${message.sender} replied to your message`,
        id: message.parentId,
      });

      return Array.from(new Set(newNotifications.map((n) => n.id))).map((id) =>
        newNotifications.find((n) => n.id === id),
      );
    })
    }
  })
  },[messages])


  return (
    <ChatContext.Provider
      value={{
        admins,
        conversations,
        email,
        files,
        id,
        input,
        loading,
        messages,
        notificationsEnabled,
        setConversations,
        setEmail,
        setFiles,
        setId,
        setInput,
        setIsLoggedIn,
        setMessages,
        setModalIndex,
        setModalSource,
        setNotificationsEnabled,
        setUser,
        setUserName,
        setToken,
        setStatus,
        status,
        socket,
        typing,
        user,
        userName,
        setNotificationBar,
        notificationBar,
        selectedMessageId,
        setSelectedMessageId
      }}
    >
      {!isLoggedIn ? (
        <LoginForm
          setUserName={setUserName}
          setIsLoggedIn={setIsLoggedIn}
          setUser={setUser}
          setEmail={setEmail}
        />
      ) : (
        <div className="animate__animated animate__fadeIn coyleChat">
          {user?.role === "admin" && <SideBar />}
          <div className="chatStack">
            <div className="messages">
              <Conversation />
            </div>
            <div className="notificationBarContainer">
            <div className="notificationBar">
                  {Boolean(notificationBar?.length) && (
                notificationBar.map((notification) => (
                  <div className="notification">
                  <p>{notification.message}</p>
                  {selectedMessageId}
                  <button onClick={()=>{
                    setSelectedMessageId(notification.id)
                    setNotificationBar((prev) => prev.filter((n) => n.id !== notification.id))
                    }}>
                  <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="40px" width="40px" xmlns="http://www.w3.org/2000/svg"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  </button>
                  <button onClick={() => setNotificationBar((prev) => prev.filter((n) => n.id !== notification.id))}>
                    <CloseIcon/>
                  </button>
        
                  </div>
                ))
              )}
              </div>
              </div>
            <div className="chatInputArea">
              <ChatControls />
            </div>
          </div>
        </div>
      )}
      {modalSource?.length > 0 && <LightBox setModalSource={setModalSource} modalSource={modalSource} modalIndex={modalIndex} />}
    </ChatContext.Provider>
  );
};

export default Chat;