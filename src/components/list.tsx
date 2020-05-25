import React, { useContext, useState } from "react";
import ReactMarkdown from "react-markdown";
import Styles from "./list.module.css";
import { TodoContext } from "../context/todoContext";
import { Todo } from "../models/todo";

const List = ({ items }: { items: Array<Todo> }) => {
  const { toggleTodo, deleteTodo, editTodo } = useContext(TodoContext);
  const [selectedTodo, setSelected] = useState<null | any>(null);

  const handleEdit = (e: any) =>
    setSelected({ ...selectedTodo, content: e.target.value });

  const canDelete = (item: Todo) => {
    if (selectedTodo) {
      return selectedTodo.id !== item.id && !item.completed;
    }

    return true;
  };
  const handleSave = (e: any) => {
    e.preventDefault();
    editTodo(selectedTodo.id, selectedTodo.content);
    setSelected(null);
  };
  const handleSelected = (item: any, e: any) => {
    // Prevent links triggering click events
    if (e.target.tagName.toLowerCase() === "a") {
      e.target.target = "blank";
      e.stopPropagation();
      return;
    }

    setSelected(item);
  };

  return (
    <ol
      data-testid="List"
      className={Styles.List}
      data-empty-message="All done..."
    >
      {items &&
        items
          .sort((a, b) => b.id - a.id)
          .map(item => (
            <li className={Styles.ListItem} key={item.id}>
              <input
                className={Styles.ListCheckbox}
                type="checkbox"
                defaultChecked={item.completed}
                onClick={() => toggleTodo(item.id)}
              />
              {selectedTodo && selectedTodo.id === item.id ? (
                <form onSubmit={handleSave} className={Styles.ListForm}>
                  <textarea
                    rows={1}
                    className={Styles.ListInput}
                    value={selectedTodo.content}
                    onChange={handleEdit}
                  />
                  <button className="Button-icon save">Save</button>
                  <button
                    className="Button-icon cancel"
                    onClick={_ => setSelected(null)}
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <div
                  className={Styles.ListContent}
                  title={item.content}
                  data-completed={item.completed ? true : undefined}
                  onClick={e => handleSelected(item, e)}
                >
                  <ReactMarkdown source={item.content} />
                </div>
              )}
              {canDelete(item) && (
                <button
                  onClick={() => deleteTodo(item.id)}
                  className="Button-icon delete"
                >
                  Delete
                </button>
              )}
            </li>
          ))}
    </ol>
  );
};

export default List;
