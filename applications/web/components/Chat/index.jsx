import "animate.css";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { ChatContext } from "./ChatContext";
import { ChatControls } from "./ChatControls";
import { Conversation } from "./Conversation";
import { ConversationList } from "./ConversationList";
import { LoginForm } from "./LoginForm";
import { Settings } from "./Settings";

/* eslint-disable no-undef */
const socketSite = process.env.NEXT_PUBLIC_SOCKET_SITE;
const socket = io(socketSite);

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [historicConversations, setHistoricConversations] = useState([]);
  const [input, setInput] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [id, setId] = useState("");
  const [windowWidth, setWindowWidth] = useState(null);
  const [typing, setTyping] = useState(null);
  const [files, setFiles] = React.useState([]);
  const [modalSource, setModalSource] = useState(null);
  const [modalIndex, setModalIndex] = useState(null);

  useEffect(() => {
    if (!username && username !== "admin") return;
    let controller = new AbortController();
    const signal = controller.signal;

    fetch("/api/chat/conversations", { signal })
      .then((res) => res.json())
      .then((data) => {
        if (signal.aborted || !data?.length) return;
        setHistoricConversations(
          data?.map((convo) => {
            convo.username = convo.name;
            convo.id = convo.conversationKey;
            return convo;
          }),
        );
      })
      .catch((err) => {
        if (err.name === "AbortError") {
          console.log("Fetch aborted");
        } else {
          console.error("Fetch error:", err);
        }
      });

    return () => {
      controller.abort();
    };
  }, [username]);

  useEffect(() => {
    if (localStorage.getItem("id")) {
      setId(localStorage.getItem("id"));
    } else {
      const randomString = Math.random().toString(36).substring(7);
      setId(randomString);
      localStorage.setItem("id", randomString);
    }

    if (localStorage.getItem("isLoggedIn") === "true") {
      setIsLoggedIn(true);
      setWindowWidth(window.innerWidth);
      setUsername(localStorage.getItem("username") || "");
      setEmail(localStorage.getItem("email") || "");
      setCurrentConversation(
        JSON.parse(localStorage.getItem("currentConversation")) || null,
      );
    }
    setWindowWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/chat/messages?conversationKey=${id}`)
      .then((res) => res.json())
      .then((data) => {
        const sortedMessages = data.sort((a, b) => a.id - b.id);
        setMessages(sortedMessages);
      });
  }, [id]);

  useEffect(() => {
    if (!currentConversation?.id) return;
    fetch(`/api/chat/messages?conversationKey=${currentConversation.id}`)
      .then((res) => res.json())
      .then((data) => {
        const sortedMessages = data.sort((a, b) => a.id - b.id);
        setMessages(sortedMessages);
      });
  }, [currentConversation]);

  useEffect(() => {
    if (currentConversation && username.toLocaleLowerCase() === "admin") {
      socket.emit("join", { id: currentConversation.id });
      setMessages([]);
    }
  }, [currentConversation, username]);

  useEffect(() => {
    socket.on("conversations", (conversations) => {
      setConversations(conversations); // Admin sees all
    });
  }, [currentConversation, username]);

  useEffect(() => {
    if (isLoggedIn) {
      const conversationId = `${id}`;
      const loginEmitData = {
        id,
        username,
        email,
        conversationId,
        socketId: socket.id,
      };
      socket.emit("login", loginEmitData);

      setCurrentConversation({
        id,
        username,
        email,
        conversationId,
        recipient: "admin",
      });

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", username);
      localStorage.setItem("email", email);
      localStorage.setItem(
        "currentConversation",
        JSON.stringify({
          id,
          username,
          email,
          conversationId,
          recipient: "Admin",
        }),
      );
    } else {
      localStorage.setItem("isLoggedIn", "false");
    }
  }, [isLoggedIn, username, email, id]);

  useEffect(() => {
    socket.on("chat message", (message) => {
      setMessages((prev) => {
        const newMessages = [...prev];

        if (message.parentId) {
          const parentMessage = newMessages.find(
            (msg) => msg.id === message.parentId,
          );
          if (parentMessage) {
            parentMessage.replies = parentMessage.replies || [];
            parentMessage.replies.push(message);
            parentMessage.replies = parentMessage.replies.filter(
              (reply, index, self) =>
                index === self.findIndex((r) => r.id === reply.id),
            );
          }
        }
        newMessages.push(message);
        const uniqueMessages = newMessages.filter(
          (msg, index, self) =>
            index === self.findIndex((m) => m.id === msg.id),
        );
        uniqueMessages.sort((a, b) => a.id - b.id);
        return uniqueMessages;
      });
    });
  }, []);

  useEffect(() => {
    if (!currentConversation?.id) return;
    socket.on("update messages request", (convoId) => {
      if (
        convoId === currentConversation.id &&
        messages.length > 0 &&
        username.toLocaleLowerCase() !== "admin"
      ) {
        socket.emit("update messages action", {
          id: currentConversation.id,
          messages,
        });
      }
    });

    if (username.toLocaleLowerCase() !== "admin") return;
    socket.on("update messages result", ({ convoId, messages }) => {
      if (convoId === currentConversation.id) {
        setMessages(messages);
      }
    });
  }, [currentConversation, messages, username]);

  useEffect(() => {
    if (username.toLocaleLowerCase() === "admin") return;
    localStorage.setItem("messages", JSON.stringify(messages));
  }, [messages, currentConversation, username]);

  useEffect(() => {
    return () => {
      socket.emit("logout", { id: localStorage.getItem("id") });
    };
  }, [id]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!currentConversation) return;
    const handleTyping = () => {
      socket.emit("user typing", {
        conversationId: currentConversation.id,
        username,
      });
    };

    if (input.length > 0) {
      handleTyping();
    }
  }, [input, currentConversation, username]);

  useEffect(() => {
    socket.on("user typing", (data) => {
      if (
        data.conversationId === currentConversation?.id &&
        data.username !== username
      ) {
        setTyping(data);
      }
    });

    socket.on("user not typing", (data) => {
      if (
        data.conversationId === currentConversation?.id &&
        data.username !== username
      ) {
        setTyping(null);
      }
    });
  }, [currentConversation, username]);

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 1500);
  }, [messages, windowWidth]);

  return (
    <ChatContext.Provider
      value={{
        conversations,
        currentConversation,
        email,
        files,
        historicConversations,
        id,
        input,
        messages,
        socket,
        typing,
        username,
        setModalSource,
        setModalIndex,
        setCurrentConversation,
        setEmail,
        setFiles,
        setInput,
        setIsLoggedIn,
        setMessages,
        setUsername,
      }}
    >
      {!isLoggedIn ? (
        <LoginForm
          setIsLoggedIn={setIsLoggedIn}
          setUsername={setUsername}
          setEmail={setEmail}
        />
      ) : (
        <div className="animate__animated animate__fadeIn chatFlex">
          {username === "admin" && <SideBar />}
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

      {modalSource?.length > 0 && (
        <div className="modal">
          <div className="modalContent">
            <img
              src={modalSource[modalIndex]}
              alt="file"
              style={{ width: "100%", borderRadius: 10 }}
            />
            <button
              onClick={() => {
                setModalSource(null);
              }}
              style={{
                position: "fixed",
                top: "5px",
                right: "5px",
                background: "red",
                color: "white",
                border: "none",
                borderRadius: "50%",
                cursor: "pointer",
              }}
            >
              X
            </button>
          </div>
        </div>
      )}
    </ChatContext.Provider>
  );
}



const SideBar = () => {
  const [view,setView] = useState("conversations");
  return <>
    <div className="sidebar">
      <div className="sidebarToggle">
      {view === "conversations" ? <button className="animate__animated animate__slideInUp" onClick={() => setView("settings")}>
      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-gear" viewBox="0 0 16 16">
        <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0"/>
        <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z"/>
      </svg>

      </button> :
        <button className="animate__animated animate__slideInUp" onClick={() => setView("conversations")}>
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-arrow-left-circle" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z"/>
        </svg>
          <span>Back to chat</span>
          </button> }
      </div>
      {view === "conversations" ?  <ConversationList /> :<Settings/>}
    </div>
  </>
}


