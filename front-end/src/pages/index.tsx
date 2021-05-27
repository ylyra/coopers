import { FormEvent, Fragment, useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import Image from "next/image";
import Head from "next/head";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { Link } from "react-scroll";
import Cookies from "js-cookie";
import addHours from "date-fns/addHours";

import styles from "../styles/home.module.scss";
import { api } from "../services/api";

type ITodo = {
  id: string;
  text: string;
  hasCompleted: boolean;
};

type IHomeProps = {
  token: string;
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

export default function Home({ token }: IHomeProps) {
  const [isLogged, setIsLogged] = useState(false);
  const [todos, setTodos] = useState<ITodo[]>([]);
  const [completedTodos, setCompletedTodos] = useState<ITodo[]>([]);
  const [todo, setTodo] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    async function handleVerify() {
      try {
        await api.post("user/verify", {
          token: token,
        });
        setIsLogged(true);

        api.interceptors.request.use(function (config) {
          config.headers.Authorization = `Bearer ${token}`;
          return config;
        });

        const { data } = await api.get("todos");
        setTodos(data.todos);
        setCompletedTodos(data.completedTodos);
      } catch (err) {}
    }
    handleVerify();
  }, []);

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

      //console.log(result.movedTodo);

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

          setTodos([...todos, newTodo]);
          setTodo("");
        }
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

  function handleOpenModal() {
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
  }

  async function handleLogin(event: FormEvent) {
    event.preventDefault();

    if (email && password) {
      try {
        const data = {
          email,
          password,
        };

        const response = await api.post("user/login", data);

        if (response.status === 200) {
          setIsLogged(true);
          const token = response.data.token;
          api.defaults.headers.common = {
            Authorization: `Bearer ${token}`,
          };

          Cookies.set("_coopers_user_token", token, {
            expires: addHours(new Date(), 12),
          });

          const { data } = await api.get("todos");

          setTodos(data.todos);
          setCompletedTodos(data.completedTodos);
        }
      } catch (err) {}
    }
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

        {isLogged ? (
          <button>sair</button>
        ) : (
          <button onClick={handleOpenModal}>entrar</button>
        )}
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
  const { _coopers_user_token } = ctx.req.cookies;

  return {
    props: {
      token: _coopers_user_token,
    },
  };
};
