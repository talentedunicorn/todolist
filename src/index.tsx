import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./index.css";
import App from "./App";
import Login from "./Login";
import * as serviceWorker from "./serviceWorker";
import { TodoProvider } from "./context/todoContext";
import { AuthProvider } from "./context/authContext";

ReactDOM.render(
  <Router>
    <AuthProvider>
      <TodoProvider>
        <Switch>
          <Route path="/app">
            <App />
          </Route>
          <Route path="/">
            <Login />
          </Route>
        </Switch>
      </TodoProvider>
    </AuthProvider>
  </Router>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
serviceWorker.register();
