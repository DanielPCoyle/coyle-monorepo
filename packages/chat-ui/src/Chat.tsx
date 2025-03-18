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

  useEffect(() => {
    const handleTyping = () => {
      socket.emit("user typing", {
        conversationKey: id,
        userName,
      });
    };
    
    if (input.length > 0) {
      console.log("Typing >>>",id,input);
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
    console.log("Joining room", id);
    socket.emit("join", { id });
    setMessages([]);
  }, [id, user]);

  useEffect(() => {
    handleSocketEvents(socket, user, id, setMessages, setAdmins, setTyping, setConversations);
  }, [user, id]);

  useEffect(() => {
    return () => socket.emit("logout", { id: localStorage.getItem("id") });
  }, [id]);

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