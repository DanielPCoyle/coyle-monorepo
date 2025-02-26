import React from "react";

import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { ChatContext } from "./ChatContext";


export const LoginForm = () => {
    const { username, setUsername, email, setEmail, setIsLoggedIn, socket } = React.useContext(ChatContext);
    const [showAdminLogin, setShowAdminLogin] = React.useState(false);
    const [password, setPassword] = React.useState("");
    const formStyle = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#fff",
        width: "300px",
        textAlign: "center",
        zIndex: 1,
    };

    const inputStyle = {
        width: "100%",
        padding: "10px",
        margin: "10px 0",
        boxSizing: "border-box"
    };

    const buttonStyle = {
        width: "100%",
        padding: "10px",
        backgroundColor: "#007BFF",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer"
    };

    const iconContainer = {
        backgroundColor: "#000",
        borderRadius: "50%",
        padding: "20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "15px auto",
        width: 150,
        height: 150,
    }

    return (
        <form
            style={formStyle}
            onSubmit={!showAdminLogin ? (e) => {
                e.preventDefault();
                if (!username || !email) {
                    alert("Please enter both username and email.");
                    return;
                }
                setIsLoggedIn(true);
            } : (e) => {
                e.preventDefault();
                if (!email || !password) {
                    alert("Please enter both email and password.");
                    return;
                }
                fetch("/api/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email, password })
                })
                    .then((res) => res.json())
                    .then((data) => {
                        if (data.error) {
                            alert(data.error);
                        } else {
                            setIsLoggedIn(true);
                        }
                    });
            }}
        >
            <p>Want to chat with PhilaPrints?<br/>Enter your name and email.</p>
            <div style={iconContainer}>
            <DotLottieReact
            style={{width:"auto", height:"auto", transform: "scale(2)"}}
      src="https://lottie.host/1ae6808e-3519-498e-a1bf-f85a9dec2b3b/COxuVY2DPb.lottie"
      loop
      autoplay
    />
    </div>
            {!showAdminLogin && <div>
                <label>
                    Name:
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={inputStyle}
                        required />
                </label>
            </div> }
            <div>
                <label>
                    Email
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={inputStyle}
                        required />
                </label>
            </div>
            {showAdminLogin && <div>
                <label>
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={inputStyle}
                        required />
                </label>
            </div> }
            <button type="submit" style={buttonStyle}>Chat Now</button>
            <div style={{marginTop: "20px"}}>
            <small
                onClick={() => setShowAdminLogin(!showAdminLogin)}
            >
                {showAdminLogin ? "Customer Login" : "Admin Login"  } 
            </small>
            </div>
        </form>
    );
};
