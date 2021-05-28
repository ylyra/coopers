import { useContext } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";

import { TodoContext } from "../../contexts/TodoContex";
import { TodoItem } from "../TodoItem";

import styles from "./styles.module.scss";

export function CompletedTodos() {
  const { completedTodos, eraseAllCompleted } = useContext(TodoContext);

  return (
    <section className={styles.completedTodoContainer}>
      <h3>Done</h3>
      <h4>
        {completedTodos.length > 0 && (
          <>
            Congratulions! <br />
          </>
        )}
        <strong>You have done {completedTodos.length} tasks</strong>
      </h4>

      <Droppable droppableId="completedTodos">
        {(provided) => (
          <div ref={provided.innerRef}>
            {completedTodos.map((completedTodo, index) => (
              <Draggable
                key={completedTodo.id}
                draggableId={completedTodo.id}
                index={index}
              >
                {(provided) => (
                  <TodoItem
                    ref={provided.innerRef}
                    draggableStyle={provided.draggableProps.style}
                    draggableProps={provided.draggableProps}
                    dragHandleProps={provided.dragHandleProps}
                    item={completedTodo}
                    isCompleted
                  />
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {completedTodos.length > 0 && (
        <button onClick={eraseAllCompleted}>erase all</button>
      )}
    </section>
  );
}
