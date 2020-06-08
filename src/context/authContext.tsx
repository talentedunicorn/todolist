import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";

import { LOGIN } from "../services/boba";

type contextProps = {
  token: string | null;
  login: any;
  logout: any;
};

const AuthContext = React.createContext<Partial<contextProps>>({});

const AuthProvider = (props: any) => {
  const STORAGE_TYPE = process.env.REACT_APP_STORAGE_TYPE;
  const [token, setToken] = useState<string | null>(null);
  const history = useHistory();
  const location = useLocation();

  const login = async (creds: any) => {
    // Login then set token
    await LOGIN(creds).then((data: any) => {
      setToken(data);
      window.sessionStorage.setItem("token", data);
      return history.push("/app");
    });

    return false;
  };

  const logout = () => {
    setToken(null);
    window.sessionStorage.removeItem("token");
    return history.replace("/");
  };

  useEffect(() => {
    // Offline, skip login
    if (STORAGE_TYPE === "offline") {
      if (location.pathname === "/") {
        return history.replace("/app");
      }
    } else {
      const cachedToken = window.sessionStorage.getItem("token");
      if (cachedToken) {
        setToken(cachedToken);
        return history.push("/app");
      }

      if (location.pathname === "/app" && !Boolean(token)) {
        return history.replace("/");
      }
    }
  }, [STORAGE_TYPE, location.pathname, history, token]);

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
