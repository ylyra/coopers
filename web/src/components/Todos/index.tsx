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
  const {
    todos,
    editTodo,
    eraseAllRemaining,
    handleCreateNewTodo,
    handleUpdateTodo,
  } = useContext(TodoContext);
  const { isLogged } = useContext(UserContext);
  const formRef = useRef<FormHandles>(null);
  const editFormRef = useRef<FormHandles>(null);

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

      {editTodo && (
        <Form
          ref={editFormRef}
          onSubmit={handleUpdateTodo}
          className={styles.editableTodo}
        >
          <button type="submit">
            <img src="/check-icon.svg" alt="Check Icon" />
          </button>
          <div>
            <Input
              name="text"
              defaultValue={editTodo.text}
              placeholder="Edit todo..."
              autoFocus
            />
          </div>
        </Form>
      )}

      {todos.length > 0 && (
        <button onClick={eraseAllRemaining}>erase all</button>
      )}
    </section>
  );
}
