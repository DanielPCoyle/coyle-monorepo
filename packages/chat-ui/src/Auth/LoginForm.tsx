import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import React, { FormEvent, useContext, useState } from "react";
import { ChatContext } from "../ChatContext";
import { AdminLogin } from "./AdminLogin";
import { GuestLogin } from "./GuestLogin";
import { useAuth } from "../hooks/useAuth";

export const LoginForm: React.FC = () => {
  const { getAndSetUser } = useAuth();
  const { userName, setUserName, email, setEmail, setToken, setIsLoggedIn } =
    useContext(ChatContext);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [password, setPassword] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const endpoint = showAdminLogin
      ? "/api/auth/login"
      : "/api/auth/guest-token";

    const id = Math.random().toString(36).substring(2, 15);

    const payload = showAdminLogin
      ? { email, password }
      : { conversationKey: id, name: userName, email };

    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert(data.error);
        } else {
          const jwt = data.token;
          localStorage.setItem("jwt", jwt);
          setToken(jwt);
          setIsLoggedIn(true);
          getAndSetUser(jwt);
        }
      })
      .catch((err) => console.error("Error fetching token:", err));
  };

  return (
    <form
      className="formStyle"
      onSubmit={handleSubmit}
      data-testid="login-form"
    >
      <p data-testid="login-message">
        Want to chat with PhilaPrints? <br /> Enter your name and email.
      </p>
      <div className="iconContainer" data-testid="lottie-container">
        <DotLottieReact
          src="https://lottie.host/1ae6808e-3519-498e-a1bf-f85a9dec2b3b/COxuVY2DPb.lottie"
          loop
          autoplay
        />
      </div>
      {showAdminLogin ? (
        <div data-testid="admin-login">
          <AdminLogin
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            handleSubmit={handleSubmit}
          />
        </div>
      ) : (
        <div data-testid="guest-login">
          <GuestLogin
            userName={userName}
            setUserName={setUserName}
            email={email}
            setEmail={setEmail}
            handleSubmit={handleSubmit}
          />
        </div>
      )}
      <div>
        <small
          onClick={() => setShowAdminLogin(!showAdminLogin)}
          data-testid="toggle-login-mode"
        >
          {showAdminLogin ? "Customer Login" : "Admin Login"}
        </small>
      </div>
    </form>
  );
};
