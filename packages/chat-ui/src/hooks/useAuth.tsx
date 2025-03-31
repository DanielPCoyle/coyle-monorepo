import { useContext, useEffect } from "react";
import ChatContext from "../ChatContext";

export const useAuth = () => {
  const {
    setUser,
    setUserName,
    setEmail,
    setIsLoggedIn,
    setId,
    setNotificationsEnabled,
    setToken,
    token,
    socket,
    setLanguage,
    setInit,
  } = useContext(ChatContext);
  const getAndSetUser = async (jwtToken: string) => {
    try {
      const response = await fetch(
        process.env.REACT_APP_API_BASE_URL + "/api/auth/me",
        {
          headers: { Authorization: `Bearer ${jwtToken}` },
          credentials: "include",
        },
      );
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
      if (data?.conversation?.language) {
        setLanguage(data?.conversation?.language);
      }

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
        setIsLoggedIn(true);
        setInit(true);
      }
    } catch (error) {
      setInit(true);
      console.error("Failed to fetch user data:", error);
    }
  };

  useEffect(() => {
    fetch(process.env.REACT_APP_API_BASE_URL + "/api/auth/cookie", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        }
      })
      .then((data) => {
        if (data?.jwt === undefined) {
          setInit(true);
          return;
        }
        const jwtToken = data.jwt;
        if (jwtToken) {
          setToken(jwtToken);
          getAndSetUser(jwtToken);
        }
      })
      .catch((err) => {
        setInit(true);
        console.error("Error fetching token:", err);
      });
  }, []);

  useEffect(() => {
    if (token) {
      getAndSetUser(token);
    }
  }, [token]);

  return { getAndSetUser };
};
