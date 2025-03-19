import { useContext, useEffect, useState } from "react";
import ChatContext from "../ChatContext";

export const useAuth = () => {
  const {
    setUser,
    setUserName,
    setEmail,
    setIsLoggedIn,
    setId,
    setNotificationsEnabled,
    socket,
  } = useContext(ChatContext);
  const [token, setToken] = useState(null);
  const getAndSetUser = async (jwtToken: string) => {
    try {
      const response = await fetch(process.env.REACT_APP_API_BASE_URL+"/api/auth/me", {
        headers: { Authorization: `Bearer ${jwtToken}` },
        credentials: "include", 
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUser(data.user);
      setUserName(data.user.name);
      setEmail(data.user.email);
      setNotificationsEnabled(data.user.notificationsEnabled);
      setId(data.user.conversationKey);
      setIsLoggedIn(true);

      if (data.user.role !== "admin") {
        socket.emit("login", {
          userName: data.user.name,
          email: data.user.email,
          id: data.user.conversationKey,
          isAdmin: false,
        });
      }
      if (token !== jwtToken) {
        setToken(jwtToken);
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  useEffect(() => {
    const jwtToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("jwt="))
      ?.split("=")[1];
    if (jwtToken) {
      setToken(jwtToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      console.log({ token });
      getAndSetUser(token);
    }
  }, [ token]);

  return { getAndSetUser };
};
