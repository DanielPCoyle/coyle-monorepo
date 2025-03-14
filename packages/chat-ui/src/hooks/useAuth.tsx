import { useContext, useEffect, useState } from "react";
import ChatContext from "../ChatContext";

export const useAuth = () => {
  
  const { setUser, setUserName, setEmail, setIsLoggedIn, setNotificationsEnabled} = useContext(ChatContext);
  const [token, setToken] = useState(null);
  const getAndSetUser = async (jwtToken:string) => fetch("/api/auth/me", { headers: { Authorization: `Bearer ${jwtToken}` } })
    .then((res) => res.json())
    .then((data) => {
      setUser(data.user);
      setUserName(data.user.name);
      setEmail(data.user.email);
      setNotificationsEnabled(data.user.notificationsEnabled);
      setIsLoggedIn(true);
      if(token !== jwtToken){
        setToken(jwtToken);
      }
  });

  useEffect(() => {
    if(localStorage.getItem("jwt")){
      setToken(localStorage.getItem("jwt") || "");
    }
  },[])
  
  useEffect(() => {
    if (token) {
      getAndSetUser(token);
    }
  }, [getAndSetUser,token]);

  return { getAndSetUser };
};
