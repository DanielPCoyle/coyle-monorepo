import "animate.css";
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { ChatContext } from "./ChatContext";
import { ChatControls } from "./ChatControls";
import { Conversation } from "./Conversation";
import { ConversationList } from "./ConversationList";
import { LoginForm } from "./LoginForm";

const socket = io(process.env.NEXT_PUBLIC_CURRENT_SITE, {
  path: "/api/socket",
});

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
  const emojiPickerRef = useRef(null);
  const [modalSource, setModalSource] = useState(null);
  const [modalIndex, setModalIndex] = useState(null);

  useEffect(() => {
    if (!username && username !== "admin") return;
    let controller = new AbortController();
    const signal = controller.signal;

    fetch("/api/getConversations", { signal })
      .then((res) => res.json())
      .then((data) => {
        if (signal.aborted || !data?.length) return;
        setHistoricConversations(
          data?.map((convo) => {
            convo.username = convo.name;
            convo.id = convo.conversation_key;
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
      "ID from localStorage:", localStorage.getItem("id");
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
    fetch(`/api/getMessages?conversation_key=${id}`)
      .then((res) => res.json())
      .then((data) => {
        const sortedMessages = data.sort((a, b) => a.id - b.id);
        setMessages(sortedMessages);
      });
  }, [id]);

  useEffect(() => {
    if (!currentConversation?.id) return;
    fetch(`/api/getMessages?conversation_key=${currentConversation.id}`)
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
         console.log({message})
        if (message.parentId) {
          const parentMessage = newMessages.find((msg) => msg.id === message.parentId);
          if (parentMessage) {
            parentMessage.replies = parentMessage.replies || [];
            parentMessage.replies.push(message);
            parentMessage.replies = parentMessage.replies.filter(
              (reply, index, self) =>
              index === self.findIndex((r) => r.id === reply.id)
            );
          }
        } else {
          newMessages.push(message);
        }
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

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiPickerRef]);

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
          {username === "admin" && <ConversationList />}
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
