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
import "@simpler-development/chat-ui/src/assets/chat.scss";
import './utils/i18n'; // 👈 Initialize i18n before anything else
import { useTranslation } from 'react-i18next';
import { CloseIcon } from "./assets/svg/CloseIcon";
import { LoadingIcon } from "./assets/svg/LoadingIcon";
import { useAuth } from "./hooks/useAuth";

const socketSite = process.env.REACT_APP_SOCKET_SITE;
const socket = io(socketSite);


interface ChatProps {
  isChatCaddy: boolean;
  setOpen: (open: boolean) => void;
}

export const Chat = ({isChatCaddy,setOpen} : ChatProps) => {
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [input, setInput] = useState("");
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [id, setId] = useState(null);
  const [token, setToken] = useState(null);
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
  const messagesRef = React.useRef(null);
  const [language, setLanguage] = useState("en");
  const { i18n } = useTranslation();
  const [init, setInit] = useState(false);

  useEffect(() => {
   if(!token || !id) return;
    i18n.changeLanguage(language);
    localStorage.setItem("language", language);
    document.documentElement.setAttribute("lang", language);
    document.documentElement.setAttribute("dir", language === "ar" ? "rtl" : "ltr");
    i18n.changeLanguage();

      fetch(process.env.REACT_APP_API_BASE_URL + "/api/chat/update-conversation-language?conversationKey="+id, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, language }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Language updated successfully:", data);
        })
        .catch((error) => {
          console.error("Error updating language:", error);
      })

  }, [language,token,id]);

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
    fetchConversations(token, setConversations, user);
  }, [user, token]);

  useEffect(() => {
    if(!token) return;
    fetchMessages(id, token, setMessages, setLoading);
  }, [id, token]);

  useEffect(() => {
    socket.emit("join", { id });
    setMessages([]);
  }, [id, user]);

  useEffect(() => {
    handleSocketEvents(socket, user, id, setMessages, setAdmins, setTyping, setConversations, setNotificationBar, messagesRef);
  }, [user, id]);

  
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
        setSelectedMessageId,
        messagesRef,
        token,
        setLanguage,
        language,
        setInit,
      }}
    >

      { 
      !init && (
        <div className="loading">
          <div className="loadingIcon">
          <LoadingIcon />
          </div>
        </div>
      ) }

       <Auth isLoggedIn={isLoggedIn} init={init} />  
       
       { (isLoggedIn && init) && (
        
        <div  className="animate__animated animate__fadeIn simpler-developmentChat">
          {isChatCaddy && (
            <button onClick={()=>setOpen(false)} className="closeChatCaddy">
              <CloseIcon  />
            </button>
          )}
          {user?.role === "admin" && <SideBar />}
          <div className="chatStack">
            <div className="messages" ref={messagesRef}>
              <Conversation />
            </div>
            {Boolean(notificationBar?.length) && ( <div className="notificationBarContainer">
            <div className="notificationBar">
                  
                {notificationBar.map((notification, i) => (
                  <div key={"notification_"+i} className="notification">
                  <p>{notification.message}</p>
                  <button onClick={()=>{
                    setSelectedMessageId(notification.id)
                    setNotificationBar((prev) => prev.filter((n) => n.id !== notification.id))
                    }}>
                  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="40px" width="40px" xmlns="http://www.w3.org/2000/svg"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  </button>
                  </div>
                ))
              }
              </div>
              </div> ) }
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



interface AuthProps {
  isLoggedIn: boolean;
  init: boolean;
}
const Auth = ({isLoggedIn, init}: AuthProps) => {
  const { getAndSetUser } = useAuth();
  return !isLoggedIn && init ? (
        <LoginForm  getAndSetUser={getAndSetUser} />
    ) : null
}