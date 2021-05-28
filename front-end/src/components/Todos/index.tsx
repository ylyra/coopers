import { FormEvent, useContext, useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";

import { api } from "../../services/api";
import { TodoContext } from "../../contexts/TodoContex";

import styles from "./styles.module.scss";

const isLogged = false;

export function Todos() {
  const { todos, handleDeleteItem, eraseAllRemaining, updateTodos } =
    useContext(TodoContext);

  const [todo, setTodo] = useState("");

  async function handleCreateNewTodo(event: FormEvent) {
    event.preventDefault();

    if (todo) {
      try {
        const data = {
          text: todo,
        };

        const response = await api.post("todos/create", data);

        if (response.status === 201) {
          const newTodo = response.data;

          updateTodos([...todos, newTodo]);
          setTodo("");
        }
      } catch (err) {}
    }
  }

  return (
    <section className={styles.todosContainer}>
      <h3>To-do</h3>
      <h4>
        Take a breath. <br />
        Start doing.
      </h4>

      {isLogged && (
        <form onSubmit={handleCreateNewTodo}>
          <button type="submit">
            <img src="/check-icon.svg" alt="Check Icon" />
          </button>

          <input
            type="text"
            placeholder="Add new here..."
            value={todo}
            onChange={(event) => setTodo(event.target.value)}
          />
        </form>
      )}

      <Droppable droppableId="todos">
        {(provided) => (
          <div ref={provided.innerRef}>
            {todos.map((todo, index) => (
              <Draggable key={todo.id} draggableId={todo.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    className={styles.todoItem}
                    style={provided.draggableProps.style}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <div>
                      <button />
                      <p>{todo.text}</p>
                    </div>

                    <button onClick={() => handleDeleteItem(todo)}>
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

      {todos.length > 0 && (
        <button onClick={eraseAllRemaining}>erase all</button>
      )}
    </section>
  );
}
