import "animate.css";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { ChatContext } from "./ChatContext";
import { ChatControls } from "./ChatControls";
import { Conversation } from "./Conversation";
import { LoginForm } from "./LoginForm";
import useSound from "use-sound";
import bubbleSFX from "./bubble.mp3";
import { SideBar } from "./AdminSidebar/SideBar";

/* eslint-disable no-undef */
const socketSite = process.env.NEXT_PUBLIC_SOCKET_SITE;
const socket = io(socketSite);

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [historicConversations, setHistoricConversations] = useState([]);
  const [input, setInput] = useState("");
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [id, setId] = useState("");
  const [windowWidth, setWindowWidth] = useState(null);
  const [typing, setTyping] = useState(null);
  const [files, setFiles] = React.useState([]);
  const [modalSource, setModalSource] = useState(null);
  const [modalIndex, setModalIndex] = useState(null);
  const [play] = useSound(bubbleSFX);
  const [token, setToken] = useState(null);
  const [init, setInit] = useState(false);

  useEffect(() => {
    if ((!user && user?.role !== "admin") || !token) return;
    let controller = new AbortController();
    const signal = controller.signal;

    fetch("/api/chat/conversations", {
      signal,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (signal.aborted || !data?.length) return;
        setHistoricConversations(
          data?.map((convo) => {
            convo.user = convo.name;
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
  }, [user, token]);

  useEffect(() => {
    setToken(localStorage.getItem("jwt"));
  }, []);

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
      setUserName(localStorage.getItem("userName") || "");
      setEmail(localStorage.getItem("email") || "");
      setCurrentConversation(
        JSON.parse(localStorage.getItem("currentConversation")) || null,
      );
    }
    setWindowWidth(window.innerWidth);
  }, []);



  useEffect(() => {
    if (!currentConversation?.id) return;
    fetch(`/api/chat/messages?conversationKey=${currentConversation?.conversationKey || currentConversation.id}`)
      .then((res) => res.json())
      .then((data) => {
        const sortedMessages = data.sort((a, b) => a.id - b.id);
        setMessages(sortedMessages);
      });
  }, [currentConversation]);

  useEffect(() => {
    if (currentConversation && user && user?.role === "admin") {
      socket.emit("join", { id: currentConversation.conversationKey || currentConversation.id });
      setMessages([]);
    }
  }, [currentConversation, user]);

  useEffect(() => {
    socket.on("conversations", (conversations) => {
      if(user?.role !== "admin") return
      console.log("A", { conversations });
      setConversations(conversations); // Admin sees all
    });
  }, [currentConversation, user]);

  useEffect(() => {
    if (isLoggedIn && !init) {
      const conversationKey = `${id}`;
      const loginEmitData = {
        id,
        userName: user?.name || userName,
        email,
        conversationKey,
        socketId: socket.id,
        isAdmin: user?.role === "admin",
      };
      socket.emit("login", loginEmitData);

      setCurrentConversation({
        id,
        user,
        email,
        conversationKey,
        recipient: "admin",
      });

      if (user?.role === "admin") return;
      fetch("/api/auth/guest-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, name: userName, email }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.token) {
            setToken(data.token);
            localStorage.setItem("jwt", data.token);
          }
        })
        .catch((err) => {
          console.error("Error fetching guest token:", err);
        });

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userName", loginEmitData.userName);
      localStorage.setItem("email", email);
      localStorage.setItem(
        "currentConversation",
        JSON.stringify({
          id,
          user,
          email,
          conversationKey,
          recipient: "Admin",
        }),
      );
      setInit(true);
    } else {
      localStorage.setItem("isLoggedIn", "false");
    }
  }, [isLoggedIn, user, email, id, init]);

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
        play();
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
        Boolean(user) &&
        Boolean(user?.role) &&
        user?.role !== "admin"
      ) {
        socket.emit("update messages action", {
          id: currentConversation.id,
          messages,
        });
      }
    });

    if (user && user?.role !== "admin") return;
    socket.on("update messages result", ({ convoId, messages }) => {
      if (convoId === currentConversation.id) {
        setMessages(messages);
      }
    });
  }, [currentConversation, messages, user]);

  // useEffect(() => {
  //   if (user.toLocaleLowerCase() === "admin") return;
  //   localStorage.setItem("messages", JSON.stringify(messages));
  // }, [messages, currentConversation, user]);

  useEffect(() => {
    return () => {
      socket.emit("logout", { id: localStorage.getItem("id") });
    };
  }, [id]);

  useEffect(() => {
    if (user?.name) {
      setUserName(user?.name);
    }
  }, [user]);

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
      console.log("TYPING",userName)
      socket.emit("user typing", {
        conversationKey: currentConversation?.conversationKey || currentConversation.id,
        userName,
      });
    };

    if (input.length > 0) {
      handleTyping();
    }
  }, [input, currentConversation, userName]);

  useEffect(() => {
    socket.on("user typing", (data) => {
      if (
        data.conversationKey === (currentConversation?.conversationKey || currentConversation?.id ) &&
        data.name !== userName
      ) {
        setTyping(data);
      }
    });

    socket.on("user not typing", (data) => {
      if (
        data.conversationKey === currentConversation?.id &&
        data.user !== user
      ) {
        setTyping(null);
      }
    });
  }, [currentConversation, user]);

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
        user,
        userName,
        setModalSource,
        setModalIndex,
        setCurrentConversation,
        setEmail,
        setFiles,
        setInput,
        setIsLoggedIn,
        setMessages,
        setUser,
        setUserName,
        setConversations,
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
        <div className="animate__animated animate__fadeIn chatFlex">
          {user && user?.role === "admin" && <SideBar />}
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
