import { forwardRef, useContext } from "react";
import {
  DraggableProvidedDraggableProps,
  DraggableProvidedDragHandleProps,
  DraggingStyle,
  NotDraggingStyle,
} from "react-beautiful-dnd";

import { TodoContext } from "../../contexts/TodoContex";

import styles from "./styles.module.scss";

type ITodo = {
  id: string;
  text: string;
  hasCompleted: boolean;
};

type ITodoItem = {
  draggableStyle?: DraggingStyle | NotDraggingStyle;
  draggableProps: DraggableProvidedDraggableProps;
  dragHandleProps: DraggableProvidedDragHandleProps;
  item: ITodo;
  isCompleted?: boolean;
};

export type Ref = HTMLDivElement;

const TodoItem = forwardRef<Ref, ITodoItem>(
  (
    {
      draggableStyle,
      draggableProps,
      dragHandleProps,
      item,
      isCompleted = false,
    },
    ref
  ) => {
    const { editTodo, handleDeleteItem, createEditForm, completeTodo } =
      useContext(TodoContext);

    return (
      <div
        ref={ref}
        className={`${styles.todoItem} ${
          editTodo && editTodo.id === item.id ? styles.todoBeenEdited : ""
        }`}
        style={draggableStyle}
        {...draggableProps}
        {...dragHandleProps}
      >
        <div>
          {isCompleted ? (
            <button className={styles.isCompleted}>
              <img src="/completed.svg" alt="Completed icon" />
            </button>
          ) : (
            <button onClick={() => completeTodo(item)} />
          )}
          <div className={styles.draggableDiv}>
            <p>{item.text}</p>
          </div>
        </div>

        <span>
          {!isCompleted && (
            <button onClick={() => createEditForm(item)}>edit</button>
          )}
          <button onClick={() => handleDeleteItem(item)}>delete</button>
        </span>
      </div>
    );
  }
);

export { TodoItem };
