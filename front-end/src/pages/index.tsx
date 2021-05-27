import { FormEvent, Fragment, useState } from "react";
import { GetServerSideProps } from "next";
import Image from "next/image";
import Head from "next/head";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { Button, Link } from "react-scroll";

import styles from "../styles/home.module.scss";
import { api } from "../services/api";

type ITodo = {
  id: string;
  text: string;
  hasCompleted: boolean;
};

type IHomeProps = {
  isLogged: boolean;
};

type IResultMove = {
  todos: ITodo[];
  completedTodos: ITodo[];
};

type IMoveProps = {
  droppableId: string;
  index: number;
};

const defaultTodos = [
  {
    id: "dd37f921-9122-4a5c-9f74-b2dfead7bdcd",
    text: "Develop the To-do list page",
    hasCompleted: false,
  },
  {
    id: "0fd7f5fe-5116-46f1-b397-2d1f9ee0c5ed",
    text: "Create the drag-and-drop function",
    hasCompleted: false,
  },
  {
    id: "57140069-f67d-4d58-8c45-669514810f8a",
    text: "Add new tasks",
    hasCompleted: false,
  },
  {
    id: "65365e8b-bba6-47f3-b8ce-b90e5b1fe3a7",
    text: "Delete itens",
    hasCompleted: false,
  },
  {
    id: "f7b73bfc-1f07-4756-96de-e181561a7e7f",
    text: "Erase all",
    hasCompleted: false,
  },
  {
    id: "fb30555c-f1e6-4fc4-ad40-0c47a626e993",
    text: "Checked item goes to Done list",
    hasCompleted: false,
  },
  {
    id: "fb30555c-f1e6-4fc4-ad40-0c47a626e993",
    text: "This item label may be edited",
    hasCompleted: false,
  },
];

const defaultCompletedTodos = [
  {
    id: "279ace51-167f-4c81-963b-05361509138d",
    text: "Get FTP credentials",
    hasCompleted: false,
  },
  {
    id: "30772478-c4ac-48a6-a9c0-94a34a7ba624",
    text: "Home Page Design",
    hasCompleted: false,
  },
  {
    id: "f0b7056f-4e52-448c-bb4b-d0e9d50580b6",
    text: "E-mail John about the deadline",
    hasCompleted: false,
  },
  {
    id: "3fa816af-b097-4bab-9104-207cbbc3c4d3",
    text: "Create a Google Drive folder",
    hasCompleted: false,
  },
  {
    id: "5dd8f951-dd5d-475b-b289-e963d4380d8a",
    text: "Send a gift to the client",
    hasCompleted: false,
  },
];

export default function Home({ isLogged }: IHomeProps) {
  const [todos, setTodos] = useState<ITodo[]>(defaultTodos);
  const [completedTodos, setCompletedTodos] = useState<ITodo[]>(
    defaultCompletedTodos
  );
  const [todo, setTodo] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

    let result: IResultMove = {
      todos,
      completedTodos,
    };
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
  }

  function onDragEnd(result: DropResult) {
    const { source, destination } = result;

    if (!destination) return;

    if (source.droppableId !== destination.droppableId) {
      const result: IResultMove = move(
        todos,
        completedTodos,
        source,
        destination
      );

      setTodos([...result.todos]);
      setCompletedTodos([...result.completedTodos]);
    }
  }

  function handleCreateNewTodo(event: FormEvent) {
    event.preventDefault();
  }

  function deleteTodo(todo: ITodo) {
    let index = todos.indexOf(todo);

    if (index > -1) {
      const newTodos = [...todos];
      newTodos.splice(index, 1);
      setTodos(newTodos);
    }
  }

  function deleteCompletedTodo(todo: ITodo) {
    let index = completedTodos.indexOf(todo);

    if (index > -1) {
      const newcompletedTodos = [...completedTodos];
      newcompletedTodos.splice(index, 1);
      setCompletedTodos(newcompletedTodos);
    }
  }

  function handleDeleteItem(todo: ITodo) {
    deleteTodo(todo);
    deleteCompletedTodo(todo);

    if (isLogged) {
    }
  }

  function eraseAllRemaining() {
    setTodos([]);

    if (isLogged) {
    }
  }

  function eraseAllCompleted() {
    setCompletedTodos([]);

    if (isLogged) {
    }
  }

  function handleOpenModal() {
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
  }

  function handleLogin(event: FormEvent) {
    event.preventDefault();
  }

  return (
    <Fragment>
      <Head>
        <title>Coopers - Site para teste Fullstack</title>

        <meta name="rights" content="Coopers - Site para teste Fullstack" />
        <link rel="canonical" href="https://coopers.yanlyra.com.br/" />
        <meta
          name="description"
          content="Coopers - Site para teste Fullstack - Confira o site"
        />

        <meta property="og:url" content="https://coopers.yanlyra.com.br/" />
        <meta
          property="og:title"
          content="Coopers - Site para teste Fullstack - Confira o site"
        />
        <meta
          property="og:description"
          content="Coopers - Site para teste Fullstack - Confira o site"
        />
        <meta property="og:image" content="/banner.png" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="800" />
        <meta property="og:image:height" content="600" />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Coopers - Site para teste Fullstack - Confira o site"
        />
        <meta
          name="twitter:description"
          content="Coopers - Site para teste Fullstack - Confira o site"
        />
        <meta name="twitter:image" content="/banner.png" />

        <meta name="rating" content="general" />
        <meta
          property="og:site_name"
          content="Coopers - Site para teste Fullstack - Confira o site"
        />
        <meta property="og:locale" content="pt_BR" />
      </Head>
      <header className={styles.headerContainer}>
        <Image src="/logo.png" width={217} height={50} />

        <button onClick={handleOpenModal}>entrar</button>
      </header>

      <section className={styles.aboutContainer}>
        <div>
          <div>
            <h1>
              Organize <br />
              <span>your daily jobs</span>
            </h1>

            <p>The only way to get things done</p>

            <Link
              to="todoList"
              className={styles.goToTodo}
              smooth={true}
              duration={500}
            >
              Go to To-do list
            </Link>
          </div>

          <Image src="/foto.png" width={443} height={481} />
        </div>

        <Link
          className={styles.arrowDownButton}
          to="todoContainer"
          smooth={true}
          duration={500}
        >
          <img src="/arrow-down.svg" alt="Arrow Down" />
        </Link>
      </section>

      <section className={styles.todoContainer} id="todoContainer">
        <div>
          <h2>To-do List</h2>
          <p>
            Drag and drop to set your main priorities, check when done and
            create what´s new.
          </p>
        </div>
      </section>

      <main className={styles.mainContentContainer} id="todoList">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="todos">
            {(provided) => (
              <section
                ref={provided.innerRef}
                className={styles.todosContainer}
              >
                <h3>To-do</h3>
                <h4>
                  Take a breath. <br />
                  Start doing.
                </h4>

                {isLogged && (
                  <form onSubmit={handleCreateNewTodo}>
                    <input
                      type="text"
                      placeholder="start"
                      value={todo}
                      onChange={(event) => setTodo(event.target.value)}
                    />
                  </form>
                )}

                {todos.map((todo, index) => (
                  <Draggable key={todo.id} draggableId={todo.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        className={styles.todoItem}
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

                {todos.length > 0 && (
                  <button onClick={eraseAllRemaining}>erase all</button>
                )}
              </section>
            )}
          </Droppable>

          <Droppable droppableId="completedTodos">
            {(provided) => (
              <section
                ref={provided.innerRef}
                className={styles.completedTodoContainer}
              >
                <h3>Done</h3>
                <h4>
                  {completedTodos.length > 0 && (
                    <>
                      Congratulions! <br />
                    </>
                  )}
                  <strong>You have done {completedTodos.length} tasks</strong>
                </h4>
                {completedTodos.map((todo, index) => (
                  <Draggable key={todo.id} draggableId={todo.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        className={styles.todoItem}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <div>
                          <button>
                            <img src="/completed.svg" alt="Completed icon" />
                          </button>
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

                {completedTodos.length > 0 && (
                  <button onClick={eraseAllCompleted}>erase all</button>
                )}
              </section>
            )}
          </Droppable>
        </DragDropContext>
      </main>

      <footer className={styles.footerContainer}>
        <h5>Need help?</h5>

        <a href="mailto:coopers@coopers.pro">coopers@coopers.pro</a>

        <p>© 2021 Coopers. All rights reserved.</p>
      </footer>

      {!isLogged && (
        <div className={`${styles.modal} ${isModalOpen ? styles.active : ""}`}>
          <div className={styles.modalBackground} onClick={handleCloseModal} />
          <div className={styles.modalContent}>
            <div>
              <img src="/login.svg" alt="Login banner" />
            </div>

            <div>
              <h1>
                Sign in
                <span>to access your list</span>
              </h1>

              <form onSubmit={handleLogin}>
                <div>
                  <label htmlFor="email">E-mail:</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="password">Password:</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </div>

                <button type="submit">Sign in</button>
              </form>

              <button className={styles.closeModal} onClick={handleCloseModal}>
                close
              </button>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  let isLogged = false;
  let todos = {};
  let completedTodos = {};
  const { _coopers_user_token } = ctx.req.cookies;

  if (_coopers_user_token) {
    try {
      await api.get("/user/verify", {
        params: {
          token: _coopers_user_token,
        },
      });
      api.defaults.headers.common = {
        Authorization: `Bearer ${_coopers_user_token}`,
      };
      isLogged = true;
    } catch (err) {}
  }

  return {
    props: {
      isLogged,
      todos,
      completedTodos,
    },
  };
};
