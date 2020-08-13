import localforage from "localforage";
import { Todo } from "../models/todo";

const DB_NAME = process.env.REACT_APP_DB_NAME || "todone_db";

// Configure database
const db = localforage.createInstance({
  name: DB_NAME
});

// Queries
const GET_TODOS = async () => {
  const allKeys = await db.keys();
  return Promise.all(allKeys.map(key => db.getItem(key.toString())));
};

const ADD_TODO = (content: string) => {
  const todo = {
    id: `${Date.now()}`,
    content,
    completed: false,
    updated_at: `${Date.now()}`
  };
  return db.setItem(todo.id, todo);
};

const EDIT_TODO = async (id: any, content: string) => {
  let todo: Todo = await db.getItem(id);
  todo.updated_at = `${Date.now()}`;
  todo.content = content;
  return db.setItem(id, { ...todo });
};

const TOGGLE_TODO = async (id: any, completed: boolean) => {
  let todo: Todo = await db.getItem(id);
  todo.completed = completed;
  return db.setItem(id, { ...todo });
};

const DELETE_TODOS = (ids: any[]) =>
  new Promise<any>(resolve => resolve(db.removeItem(ids[0])));

export default { GET_TODOS, ADD_TODO, EDIT_TODO, TOGGLE_TODO, DELETE_TODOS };
