import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { DropResult } from "react-beautiful-dnd";
import { SubmitHandler, FormHelpers } from "@unform/core";

import { api } from "../services/api";
import { UserContext } from "./UserContext";

import { fakeTodo } from "../utils/fakeTodo";
import { fakeCompletedTodo } from "../utils/fakeCompletedTodo";

type FormData = {
  text: string;
};

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
  editTodo: ITodo;

  updateTodos: (todoList: ITodo[]) => void;
  updateCompletedTodos: (todoList: ITodo[]) => void;
  onDragEnd: (result: DropResult) => Promise<void>;
  handleDeleteItem: (todo: ITodo) => void;
  eraseAllRemaining: () => Promise<void>;
  eraseAllCompleted: () => Promise<void>;
  handleCreateNewTodo: (data: FormData, helpers: FormHelpers) => void;
  handleUpdateTodo: (data: FormData, helpers: FormHelpers) => void;
  createEditForm: (todo: ITodo) => void;
  completeTodo: (todo: ITodo) => Promise<void>;
};

export const TodoContext = createContext({} as ITodoContext);

export function TodoProvider({ children }: ITodoProvider) {
  const { isLogged } = useContext(UserContext);

  const [todos, setTodos] = useState<ITodo[]>(!isLogged ? fakeTodo : []);
  const [completedTodos, setCompletedTodos] = useState<ITodo[]>(
    !isLogged ? fakeCompletedTodo : []
  );
  const [editTodo, setEditTodo] = useState<ITodo>();

  useEffect(() => {
    async function getUserTodos() {
      if (isLogged) {
        try {
          const { data } = await api.get("todos");
          setTodos(data.todos);
          setCompletedTodos(data.completedTodos);
        } catch (err) {}
      } else {
        setTodos(fakeTodo);
        setCompletedTodos(fakeCompletedTodo);
      }
    }

    getUserTodos();
  }, [isLogged]);

  function updateTodos(todoList: ITodo[]) {
    setTodos(todoList);
  }

  function updateCompletedTodos(todoList: ITodo[]) {
    setCompletedTodos(todoList);
  }

  function reorder(list: ITodo[], startIndex: number, endIndex: number) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
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

    const from = source.droppableId === "todos" ? todos : completedTodos;

    if (source.droppableId === destination.droppableId) {
      const items = reorder(from, source.index, destination.index);

      if (source.droppableId === "todos") {
        setTodos(items);
      } else {
        setCompletedTodos(items);
      }
    } else {
      const to = destination.droppableId === "todos" ? todos : completedTodos;

      const result: IResultMove = move(from, to, source, destination);

      setTodos([...result.todos]);
      setCompletedTodos([...result.completedTodos]);
    }

    try {
      await api.put("todos/reorder", {
        todos,
        completedTodos,
      });
    } catch (err) {}
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

  const handleCreateNewTodo: SubmitHandler<FormData> = async (
    data,
    { reset }
  ) => {
    if (data.text) {
      try {
        const response = await api.post("todos/create", data);

        if (response.status === 201) {
          const newTodo = response.data;

          setTodos([...todos, newTodo]);
        }
      } catch (err) {}

      reset();
    }
  };

  const handleUpdateTodo: SubmitHandler<FormData> = async (data) => {
    if (data.text) {
      try {
        const todo = {
          ...editTodo,
          text: data.text,
        };
        const response = await api.put(`todos/update/${editTodo.id}`, todo);

        if (response.status === 202) {
          const newTodo = response.data;
          const allTodos = [...todos];
          const todoEditedIndex = allTodos.indexOf(editTodo);
          allTodos[todoEditedIndex] = newTodo;

          setTodos([...allTodos]);
          setEditTodo(undefined as ITodo);
        }
      } catch (err) {}
    }
  };

  function createEditForm(todo: ITodo) {
    setEditTodo(todo);
  }

  async function completeTodo(todo: ITodo) {
    try {
      const hasCompleted = true;
      const data = {
        ...todo,
        hasCompleted,
        order: completedTodos.length + 1,
      };

      await api.put(`todos/update/${todo.id}`, data);

      const allTodos = [...todos];
      const todoEditedIndex = allTodos.indexOf(editTodo);

      allTodos.splice(todoEditedIndex, 1);
      setTodos(allTodos);
      setCompletedTodos([...completedTodos, data]);
    } catch (err) {}
  }

  const valueProvider = {
    todos,
    completedTodos,
    editTodo,

    updateTodos,
    updateCompletedTodos,
    onDragEnd,
    handleDeleteItem,
    eraseAllRemaining,
    eraseAllCompleted,
    handleCreateNewTodo,
    handleUpdateTodo,
    createEditForm,
    completeTodo,
  };

  return (
    <TodoContext.Provider value={valueProvider}>
      {children}
    </TodoContext.Provider>
  );
}
