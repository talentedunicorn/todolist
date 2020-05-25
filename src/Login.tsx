import React, { useContext, useState } from "react";
import Styles from "./Login.module.css";
import { AuthContext } from "./context/authContext";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    login({ username, password });
  };

  return (
    <div data-testid="Login" className={Styles.Wrapper}>
      <h2 className={Styles.Title}>
        <span>ToDone</span>
      </h2>

      <form className={Styles.Form} onSubmit={handleSubmit}>
        <label>
          <span className="visually-hidden">Username</span>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className={Styles.Input}
            placeholder="Username"
          />
        </label>

        <label>
          <span className="visually-hidden">Password</span>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className={Styles.Input}
            placeholder="Password"
          />
        </label>

        <div className={Styles.Controls}>
          <button
            className={Styles.Login}
            type="submit"
            disabled={!username || !password}
          >
            Log in
          </button>
          <button className={Styles.Offline} onClick={_ => login("offline")}>
            Use offline
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
