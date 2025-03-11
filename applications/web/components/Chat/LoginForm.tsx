import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import React, { ChangeEvent, FormEvent, useContext, useState } from "react";
import { ChatContext } from "./ChatContext";

export const LoginForm: React.FC = () => {
  const { id, userName, setUser, setUserName, email, setEmail, setIsLoggedIn, setToken } =
    useContext(ChatContext);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [password, setPassword] = useState("");

  React.useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(">>>>>>",data.user)
          setUser(data.user);
          setUserName(data.user.name);
          setEmail(data.user.email);
          setIsLoggedIn(true);
        });
    }
  }, []);

  const formStyle: React.CSSProperties = {
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

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    boxSizing: "border-box",
  };

  const buttonStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  };

  const iconContainer: React.CSSProperties = {
    backgroundColor: "#000",
    borderRadius: "50%",
    padding: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "15px auto",
    width: 150,
    height: 150,
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!showAdminLogin) {
      if (!userName || !email) {
        alert("Please enter both name and email.");
        return;
      }
       fetch("/api/auth/guest-token", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ conversationKey:id, name: userName, email }),
            })
              .then((res) => res.json())
              .then((data) => {
                if (data?.token) {
                  setToken(data.token);
                  localStorage.setItem("jwt", data.token);
                  setIsLoggedIn(true);
                }
              })
              .catch((err) => {
                console.error("Error fetching guest token:", err);
              });
      
    } else {
      if (!email || !password) {
        alert("Please enter both email and password.");
        return;
      }
      fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            alert(data.error);
          } else {
            const jwt = data.token;
            localStorage.setItem("jwt", jwt);
            fetch("/api/auth/me", {
              headers: {
                Authorization: `Bearer ${jwt}`,
              },
            })
              .then((res) => res.json())
              .then((data) => {
                data.user.token = jwt;
                setUser(data.user);
                setIsLoggedIn(true);
              });
          }
        });
    }
  };

  return (
    <form style={formStyle} onSubmit={handleSubmit}>
      <p>
        Want to chat with PhilaPrints?
        <br />
        Enter your name and email.
      </p>
      <div style={iconContainer}>
        <DotLottieReact
          style={{ width: "auto", height: "auto", transform: "scale(2)" }}
          src="https://lottie.host/1ae6808e-3519-498e-a1bf-f85a9dec2b3b/COxuVY2DPb.lottie"
          loop
          autoplay
        />
      </div>
      {!showAdminLogin && (
        <div>
          <label>
            Name:
            <input
              type="text"
              value={userName}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setUserName(e.target.value)
              }
              style={inputStyle}
              required
            />
          </label>
        </div>
      )}
      <div>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            style={inputStyle}
            required
          />
        </label>
      </div>
      {showAdminLogin && (
        <div>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              style={inputStyle}
              required
            />
          </label>
        </div>
      )}
      <button type="submit" style={buttonStyle}>
        Chat Now
      </button>
      <div style={{ marginTop: "20px" }}>
        <small onClick={() => setShowAdminLogin(!showAdminLogin)}>
          {showAdminLogin ? "Customer Login" : "Admin Login"}
        </small>
      </div>
    </form>
  );
};
