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
    const { handleDeleteItem } = useContext(TodoContext);

    return (
      <div
        ref={ref}
        className={styles.todoItem}
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
            <button />
          )}
          <p>{item.text}</p>
        </div>

        <button onClick={() => handleDeleteItem(item)}>delete</button>
      </div>
    );
  }
);

export { TodoItem };
