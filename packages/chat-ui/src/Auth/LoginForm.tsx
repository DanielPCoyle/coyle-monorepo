import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import React, { ChangeEvent, FormEvent, useContext, useState } from "react";
import { ChatContext } from "../ChatContext";

export const LoginForm: React.FC = () => {
  const {
    id,
    userName,
    setUser,
    setUserName,
    email,
    setEmail,
    setIsLoggedIn,
    setToken,
    setNotificationsEnabled,
  } = useContext(ChatContext);
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
          setUser(data.user);
          setUserName(data.user.name);
          setEmail(data.user.email);
          setNotificationsEnabled(data.user.notificationsEnabled);
          setIsLoggedIn(true);
        });
    }
  }, []);

  

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
        body: JSON.stringify({ conversationKey: id, name: userName, email }),
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
    <form className="formStyle" onSubmit={handleSubmit}>
      <p>
        Want to chat with PhilaPrints?
        <br />
        Enter your name and email.
      </p>
      <div className="iconContainer">
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
              className="inputStyle"
              required
            />
          </label>
        </div>
      )}
      <div>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            className="inputStyle"
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
              className="inputStyle"
              required
            />
          </label>
        </div>
      )}
      <button type="submit" className="buttonStyle">
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
