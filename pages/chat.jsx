import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { LoginForm } from "../components/Chat/LoginForm";
import { ThreeJsMessages } from "../components/Chat/ThreeJsMessages";
import { ConversationList } from "../components/Chat/ConversationList";
import { ChatContainer } from "../components/Chat/ChatContainer";

const socket = io("http://localhost:3000", {
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
    const [color, setColor] = useState("yellow");  
    const [files, setFiles] = React.useState([]);
    

    useEffect(() => {
        if (!username && username !== "admin") return;
        let controller = new AbortController();
        const signal = controller.signal;

        fetch("/api/getConversations", { signal }).then((res) => res.json()).then((data) => {
            if (signal.aborted || !data?.length) return;
            setHistoricConversations(data?.map((convo) => {
                convo.username = convo.name;
                convo.id = convo.conversation_key;
                return convo;
            }));
        }).catch((err) => {
            if (err.name === 'AbortError') {
                console.log('Fetch aborted');
            } else {
                console.error('Fetch error:', err);
            }
        });

        return () => {
            controller.abort();
        };
    }, [ username]);

    

    useEffect(() => {
        // get id from localStorage or socket.id
        if (localStorage.getItem("id")) {
            ("ID from localStorage:", localStorage.getItem("id"));
            setId(localStorage.getItem("id"));
        } else {
            const randomString = Math.random().toString(36).substring(7);
            setId(randomString);
            localStorage.setItem("id",randomString);
        }

        if (localStorage.getItem("isLoggedIn") === "true") {
            setIsLoggedIn(true);
            setWindowWidth(window.innerWidth);
            setUsername(localStorage.getItem("username") || "");
            setEmail(localStorage.getItem("email") || "");
            setCurrentConversation(JSON.parse(localStorage.getItem("currentConversation")) || null);
        }

        
        setWindowWidth(window.innerWidth);
    }, []);

    useEffect(() => {
        if(!id) return;
            fetch(`/api/getMessages?conversation_key=${id}`)
            .then((res) => res.json())
            .then((data) => {
                const sortedMessages = data.sort((a, b) => a.id - b.id);
                setMessages(sortedMessages);
            });
    },[id]);
    
    useEffect(() => {
        if(!currentConversation?.id) return;
            fetch(`/api/getMessages?conversation_key=${currentConversation.id}`)
            .then((res) => res.json())
            .then((data) => {
                const sortedMessages = data.sort((a, b) => a.id - b.id);
                setMessages(sortedMessages);
            });
    },[currentConversation]);



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
            // Generate a unique conversation ID for user-Admin chat
            const conversationId = `${id}`;
            
            // Emit login event with unique conversation
            const loginEmitData = { id, username, email, conversationId, socketId: socket.id };
            socket.emit("login", loginEmitData);
    
            // Set current conversation to always be with Admin
            setCurrentConversation({ id, username, email, conversationId, recipient: "admin" });
    
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("username", username);
            localStorage.setItem("email", email);
            localStorage.setItem("currentConversation", JSON.stringify({ id, username, email, conversationId, recipient: "Admin" }));
        } else {
            localStorage.setItem("isLoggedIn", "false");
        }
    }, [isLoggedIn, username, email, id]);

    useEffect(() => {
        socket.on("chat message", (message) => {
            setMessages((prev) => {
                const newMessages = [...prev, message];
                const uniqueMessages = newMessages.filter((msg, index, self) =>
                    index === self.findIndex((m) => m.id === msg.id)
                );
                uniqueMessages.sort((a, b) => a.id - b.id);
                return uniqueMessages;
            });
        });
    }, []);

    useEffect(() => {
        if(!currentConversation?.id) return;
        socket.on("update messages request", (convoId) => {
            if(convoId === currentConversation.id && messages.length > 0 && username.toLocaleLowerCase() !== "admin") {
                socket.emit("update messages action", { id: currentConversation.id, messages });
            }
         });

        if(username.toLocaleLowerCase() !== "admin") return;
         socket.on("update messages result", ({ convoId, messages }) => {
                if (convoId === currentConversation.id) {
                    setMessages(messages);
                }
            });
        }, [currentConversation,messages,username]);

    
    useEffect(() => {
        if(username.toLocaleLowerCase() === "admin") return;
        localStorage.setItem("messages", JSON.stringify(messages));
    }, [messages,currentConversation,username]);


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
            socket.emit("user typing", { conversationId: currentConversation.id, username });
        };

        if(input.length > 0) {
            handleTyping();
        }

    }, [input, currentConversation, username]);

    useEffect(() => {
        socket.on("user typing", (data) => {
            if ((data.conversationId === currentConversation?.id ) && (data.username !== username) ) {
                setTyping(data);
            }
        });

        socket.on("user not typing", (data) => {
            if (data.conversationId === currentConversation?.id && data.username !== username) {
                setTyping(null);
            }
        });
    }, [currentConversation, username]);


    // scroll to bottom of page when messages are updated
    useEffect(() => {
        setTimeout(() => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
        }, 1500);
    }, [messages, windowWidth]);



    
    return (
        <div className="animate__animated animate__fadeIn" >
        
            {!isLoggedIn ? (
                <LoginForm {...{ setIsLoggedIn, username, email, setEmail, setUsername }} />
            ) : (
                <ChatContainer {...{ 
                        styles,
                        input,
                        currentConversation,
                        socket,
                        setInput,
                        username,
                        typing,
                        setColor,
                         files,
                        setFiles
                 }} />
            )}
            {username === "admin" && (
               <ConversationList {
                ...{
                    conversations,
                    currentConversation,
                    setCurrentConversation,
                    socket,
                    id,
                    username,
                    email,
                    historicConversations
                }} />
            )}
            <div>  
                <ThreeJsMessages files={files} currentConversation={currentConversation} socket={socket} messages={messages} username={username} color={color} />
            </div>
        </div>
    );
}

export const styles = {
    authContainer: { position: "absolute", top: "30%", left: "50%", transform: "translate(-50%, -50%)", background: "#222", padding: "20px", borderRadius: "10px", color: "#fff", textAlign: "center" },
    input: { width: "100%", padding: "10px", margin: "5px 0", borderRadius: "5px", border: "none" },
    loginButton: { padding: "10px", background: "#007AFF", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" },
    adminPanel: { position: "absolute", top: "10px", left: "10px", background: "#333", padding: "10px", borderRadius: "5px", color: "#fff" },
    conversationItem: { cursor: "pointer", padding: "5px", borderBottom: "1px solid #444" },
    textarea: {
      flex: 1,
      background: "#333",
      color: "#fff",
      border: "none",
      padding: "10px",
      fontSize: "16px",
      borderRadius: "5px",
      resize: "none",
      outline: "none",
      height: 100,
    },
    sendButton: {
      marginLeft: "10px",
      background: "#007AFF",
      color: "#fff",
      border: "none",
      padding: "10px",
      fontSize: "16px",
      borderRadius: "5px",
      cursor: "pointer",
    },
    inputContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "20px 0",
    },
  };