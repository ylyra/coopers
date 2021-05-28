import { FormEvent, useContext, useRef, useState } from "react";
import { FormHandles } from "@unform/core";
import { Form } from "@unform/web";
import { Draggable, Droppable } from "react-beautiful-dnd";

import { api } from "../../services/api";
import { TodoItem } from "../TodoItem";
import Input from "../Input";
import { TodoContext } from "../../contexts/TodoContex";
import { UserContext } from "../../contexts/UserContext";

import styles from "./styles.module.scss";

export function Todos() {
  const { todos, eraseAllRemaining, handleCreateNewTodo } =
    useContext(TodoContext);
  const { isLogged } = useContext(UserContext);
  const formRef = useRef<FormHandles>(null);

  return (
    <section
      className={`${styles.todosContainer} ${
        !isLogged ? styles.notLogged : ""
      }`}
    >
      <h3>To-do</h3>
      <h4>
        Take a breath. <br />
        Start doing.
      </h4>

      {isLogged && (
        <Form ref={formRef} onSubmit={handleCreateNewTodo}>
          <button type="submit">
            <img src="/check-icon.svg" alt="Check Icon" />
          </button>
          <div>
            <Input name="text" placeholder="Add new here..." />
          </div>

          <button type="submit">Sign in</button>
        </Form>
      )}

      <Droppable droppableId="todos">
        {(provided) => (
          <div ref={provided.innerRef}>
            {todos.map((todo, index) => (
              <Draggable key={todo.id} draggableId={todo.id} index={index}>
                {(provided) => (
                  <TodoItem
                    ref={provided.innerRef}
                    draggableStyle={provided.draggableProps.style}
                    draggableProps={provided.draggableProps}
                    dragHandleProps={provided.dragHandleProps}
                    item={todo}
                  />
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
