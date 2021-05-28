import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { DropResult } from "react-beautiful-dnd";
import { api } from "../services/api";

import { UserContext } from "./UserContext";

type ITodoProvider = {
  children: ReactNode;
};

type ITodo = {
  id: string;
  text: string;
  hasCompleted: boolean;
};

type IResultMove = {
  todos: ITodo[];
  completedTodos: ITodo[];
  movedTodo: ITodo;
};

type IMoveProps = {
  droppableId: string;
  index: number;
};

type ITodoContext = {
  todos: ITodo[];
  completedTodos: ITodo[];

  updateTodos: (todoList: ITodo[]) => void;
  updateCompletedTodos: (todoList: ITodo[]) => void;
  onDragEnd: (result: DropResult) => Promise<void>;
  handleDeleteItem: (todo: ITodo) => void;
  eraseAllRemaining: () => Promise<void>;
  eraseAllCompleted: () => Promise<void>;
};

export const TodoContext = createContext({} as ITodoContext);

export function TodoProvider({ children }: ITodoProvider) {
  const { isLogged } = useContext(UserContext);
  const [todos, setTodos] = useState<ITodo[]>([]);
  const [completedTodos, setCompletedTodos] = useState<ITodo[]>([]);

  useEffect(() => {
    async function getUserTodos() {
      if (isLogged) {
        try {
          const { data } = await api.get("todos");
          setTodos(data.todos);
          setCompletedTodos(data.completedTodos);
        } catch (err) {}
      }
    }

    getUserTodos();
  }, [isLogged])

  function updateTodos(todoList: ITodo[]) {
    setTodos(todoList);
  }

  function updateCompletedTodos(todoList: ITodo[]) {
    setCompletedTodos(todoList);
  }

  function move(
    source: ITodo[],
    destination: ITodo[],
    droppableSource: IMoveProps,
    droppableDestination: IMoveProps
  ) {
    const sourceClone: ITodo[] = Array.from(source);
    const destClone: ITodo[] = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    let result: IResultMove = {} as IResultMove;
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;
    result["movedTodo"] = removed;

    return result;
  }

  async function onDragEnd(result: DropResult) {
    const { source, destination } = result;

    if (!destination) return;

    if (source.droppableId !== destination.droppableId) {
      const from = source.droppableId === "todos" ? todos : completedTodos;
      const to = destination.droppableId === "todos" ? todos : completedTodos;

      const result: IResultMove = move(from, to, source, destination);

      setTodos([...result.todos]);
      setCompletedTodos([...result.completedTodos]);

      try {
        const hasCompleted = destination.droppableId === "todos" ? false : true;
        const data = {
          ...result.movedTodo,
          hasCompleted,
        };
        await api.put(`todos/update/${result.movedTodo.id}`, data);
      } catch (err) {}
    }
  }

  async function deleteTodo(todo: ITodo) {
    let index = todos.indexOf(todo);

    if (index > -1) {
      const newTodos = [...todos];
      newTodos.splice(index, 1);
      setTodos(newTodos);

      try {
        await api.delete(`todos/delete/${todo.id}`);
      } catch (err) {}
    }
  }

  async function deleteCompletedTodo(todo: ITodo) {
    let index = completedTodos.indexOf(todo);

    if (index > -1) {
      const newcompletedTodos = [...completedTodos];
      newcompletedTodos.splice(index, 1);
      setCompletedTodos(newcompletedTodos);

      try {
        await api.delete(`todos/delete/${todo.id}`);
      } catch (err) {}
    }
  }

  function handleDeleteItem(todo: ITodo) {
    deleteTodo(todo);
    deleteCompletedTodo(todo);
  }

  async function eraseAllRemaining() {
    setTodos([]);

    if (isLogged) {
      await api.delete("todos/deleteAll/0");
    }
  }

  async function eraseAllCompleted() {
    setCompletedTodos([]);

    if (isLogged) {
      await api.delete("todos/deleteAll/1");
    }
  }

  const valueProvider = {
    todos,
    completedTodos,

    updateTodos,
    updateCompletedTodos,
    onDragEnd,
    handleDeleteItem,
    eraseAllRemaining,
    eraseAllCompleted,
  };

  return (
    <TodoContext.Provider value={valueProvider}>
      {children}
    </TodoContext.Provider>
  );
}
