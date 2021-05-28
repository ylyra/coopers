import { useContext, useState } from "react";

import { UserContext } from "../../contexts/UserContext";

import styles from "./styles.module.scss";

export function Modal() {
  const { isLogged, isModalOpen, handleCloseModal, handleLogin } =
    useContext(UserContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!isLogged) return null;

  return (
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
  );
}
