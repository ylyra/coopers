import { useContext } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";

import { TodoContext } from "../../contexts/TodoContex";

import styles from "./styles.module.scss";

export function CompletedTodos() {
  const { completedTodos, handleDeleteItem, eraseAllCompleted } =
    useContext(TodoContext);

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
                  <div
                    ref={provided.innerRef}
                    className={styles.todoItem}
                    style={provided.draggableProps.style}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <div>
                      <button>
                        <img src="/completed.svg" alt="Completed icon" />
                      </button>
                      <p>{completedTodo.text}</p>
                    </div>

                    <button onClick={() => handleDeleteItem(completedTodo)}>
                      delete
                    </button>
                  </div>
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
