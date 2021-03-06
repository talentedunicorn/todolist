import React, { useContext, useEffect, useState, useRef } from "react";
import List from "./components/list";
import Form from "./components/form";
import Loading from "./components/loading";
import { Todo } from "./models/todo";

import Styles from "./App.module.css";

import { TodoContext } from "./context/todoContext";
import { AuthContext } from "./context/authContext";
import { NotificationContext } from "./context/notificationContext";
import { exportData, importData } from "./services/localStorage";

const App = () => {
  const [loading, setLoading] = useState(true);
  const inputRef = useRef<any>(null);
  const {
    todolist,
    selected,
    selectTodo,
    onAddTodo,
    getTodos,
    editTodo,
  } = useContext(TodoContext);
  const { logout } = useContext(AuthContext);
  const { notify } = useContext(NotificationContext);
  const OFFLINE_MODE = process.env.REACT_APP_OFFLINE_MODE;

  const completedTodos = todolist
    ? todolist.filter((todo: Todo) => todo.completed === true)
    : [];
  const incompleteTodos = todolist
    ? todolist.filter((todo: Todo) => todo.completed === false)
    : [];

  const handleClick = async (e: any) => {
    e.preventDefault();
    inputRef.current.click();
  };

  const handleInputChange = async () => {
    const FR = new FileReader();
    if (!inputRef.current) return false;

    const { files } = inputRef.current;
    if (!files || files.length < 1) return false;

    FR.addEventListener("load", (event: any) => {
      const { result } = event.target;
      if (!result) return false;

      try {
        const results = JSON.parse(event.target.result);
        upload(results.data);
      } catch (error: any) {
        notify("Invalid file. Please try a different file", "error");
      }
    });

    FR.readAsText(files[0]);
  };

  const handleFormSubmit = (data: any) => {
    selected ? editTodo(selected.id, data.content) : onAddTodo(data);
    selectTodo(null);
  };

  const upload = async (data: any) => {
    try {
      await importData(data);
      await getTodos();
      notify("Data restored", "success");
    } catch (e) {
      notify("Failed to restore data", "error");
    }

    inputRef.current.value = "";
  };

  useEffect(() => {
    async function initialLoad() {
      try {
        if (!todolist) {
          await getTodos();
        }
      } catch (error) {
        if (error.response?.status && error.response?.status === 401) {
          logout();
        }
      }
      setLoading(false);
    }

    initialLoad();
  }, [getTodos, todolist, logout]);

  return (
    <main data-testid="App" className={Styles.Layout}>
      <header className={Styles.Header}>
        <h1 className={Styles.Logo}>{process.env.REACT_APP_WEBSITE_NAME}</h1>
        <a
          className={Styles.Hint}
          title="This app uses Markdown. Click to learn how to use it"
          target="blank"
          href="https://www.markdownguide.org/cheat-sheet"
        >
          Markdown cheatsheet
        </a>
        {OFFLINE_MODE === "true" ? (
          <div className={Styles.OfflineControls}>
            <form className={Styles.ImportForm}>
              <input
                data-testid="uploadInput"
                ref={inputRef}
                type="file"
                accept=".json"
                onChange={handleInputChange}
              />
              <button
                onClick={handleClick}
                title="Import from file"
                className={Styles.Import}
              >
                Upload
              </button>
            </form>
            <button
              title="Save to file"
              className={Styles.Export}
              disabled={!todolist || todolist.length < 1}
              onClick={(_) => exportData()}
            >
              Save to file
            </button>
          </div>
        ) : (
          <button className={Styles.Logout} onClick={logout}>
            {" "}
            Logout
          </button>
        )}
      </header>
      {loading ? (
        <Loading className={Styles.Loading} />
      ) : (
        <>
          <Form
            handleFormSubmit={handleFormSubmit}
            defaultValue={selected && selected.content}
            onReset={() => selectTodo(null)}
          />
          <div className={Styles.LayoutContent}>
            <List title="To be done" items={incompleteTodos} />
            {completedTodos.length > 0 && (
              <List title="Done" items={completedTodos} />
            )}
          </div>
        </>
      )}
      <footer className={Styles.Footer}>
        <p>
          Made with{" "}
          <span role="img" aria-label="heart">
            ❤️
          </span>{" "}
          by <a href="https://talentedunicorn.com">TalentedUnicorn</a>{" "}
          <sup>&copy;</sup>&nbsp;{new Date().getFullYear()}.
        </p>
      </footer>
    </main>
  );
};

export default App;
