import { FormEvent, Fragment, useContext, useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import Image from "next/image";
import Head from "next/head";
import { DragDropContext } from "react-beautiful-dnd";
import { Link } from "react-scroll";
import Cookies from "js-cookie";
import addHours from "date-fns/addHours";

import { api } from "../services/api";
import { Todos } from "../components/Todos";
import { CompletedTodos } from "../components/CompletedTodos";

import { TodoContext } from "../contexts/TodoContex";
import { UserContext } from "../contexts/UserContext";

import styles from "../styles/home.module.scss";
import { Modal } from "../components/Modal";

type IHomeProps = {
  isLoggedIn: boolean;
};

export default function Home({ isLoggedIn }: IHomeProps) {
  const { onDragEnd } = useContext(TodoContext);
  const { isLogged, changeLoggedState, handleOpenModal, handleLogout } =
    useContext(UserContext);

  useEffect(() => {
    changeLoggedState(isLoggedIn);
  }, []);

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
          <button onClick={handleLogout}>log out</button>
        ) : (
          <button onClick={handleOpenModal}>log in</button>
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
          <Todos />

          <CompletedTodos />
        </DragDropContext>
      </main>

      <footer className={styles.footerContainer}>
        <h5>Need help?</h5>

        <a href="mailto:coopers@coopers.pro">coopers@coopers.pro</a>

        <p>© 2021 Coopers. All rights reserved.</p>
      </footer>

      <Modal />
    </Fragment>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { _coopers_user_token: token } = ctx.req.cookies;
  let isLoggedIn = false;

  if (token) {
    try {
      await api.post("user/verify", {
        token: token,
      });
      isLoggedIn = true;
    } catch (err) {}
  }

  return {
    props: {
      isLoggedIn,
    },
  };
};
