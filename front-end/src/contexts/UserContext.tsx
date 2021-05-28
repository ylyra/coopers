import { createContext, FormEvent, ReactNode, useState } from "react";
import Cookies from "js-cookie";
import addHours from "date-fns/addHours";

import { api } from "../services/api";

type IUserProvider = {
  children: ReactNode;
};

type IUserContext = {
  isLogged: boolean;
  isModalOpen: boolean;

  verifyLogin: (token: string) => Promise<void>;
  handleLogin: (event: FormEvent) => Promise<void>;
  handleOpenModal: () => void;
  handleCloseModal: () => void;
};

export const UserContext = createContext({} as IUserContext);

export function UserProvider({ children }: IUserProvider) {
  const [isLogged, setIsLogged] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function verifyLogin(token: string) {
    try {
      await api.post("user/verify", {
        token: token,
      });
      setIsLogged(true);

      api.interceptors.request.use(function (config) {
        config.headers.Authorization = `Bearer ${token}`;
        return config;
      });
    } catch (err) {}
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
          const token = response.data.token;
          api.defaults.headers.common = {
            Authorization: `Bearer ${token}`,
          };

          Cookies.set("_coopers_user_token", token, {
            expires: addHours(new Date(), 12),
          });

          setIsLogged(true);
        }
      } catch (err) {}
    }
  }

  function handleOpenModal() {
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
  }

  const valueProvider = {
    isLogged,
    isModalOpen,

    verifyLogin,
    handleLogin,
    handleOpenModal,
    handleCloseModal,
  };

  return (
    <UserContext.Provider value={valueProvider}>
      {children}
    </UserContext.Provider>
  );
}
