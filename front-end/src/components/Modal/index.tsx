import { useContext, useRef } from "react";
import { FormHandles } from "@unform/core";
import { Form } from "@unform/web";

import Input from "../Input";
import { UserContext } from "../../contexts/UserContext";

import styles from "./styles.module.scss";

export function Modal() {
  const { isLogged, isModalOpen, handleCloseModal, handleLogin } =
    useContext(UserContext);
  const formRef = useRef<FormHandles>(null);

  if (isLogged) return null;

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

          <Form ref={formRef} onSubmit={handleLogin}>
            <div>
              <Input name="email" label="E-mail:" type="email" />
            </div>

            <div>
              <Input name="password" label="Password:" type="password" />
            </div>

            <button type="submit">Sign in</button>
          </Form>
          <button className={styles.closeModal} onClick={handleCloseModal}>
            close
          </button>
        </div>
      </div>
    </div>
  );
}
