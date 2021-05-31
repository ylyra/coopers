import { createContext, ReactNode, useState } from "react";
import { FormHelpers, SubmitHandler } from "@unform/core";
import Cookies from "js-cookie";
import addHours from "date-fns/addHours";

import { api } from "../services/api";

type IUserProvider = {
  children: ReactNode;
};

type FormData = {
  email: string;
  password: string;
};

type IUserContext = {
  // Booleans
  isLogged: boolean;
  isModalOpen: boolean;
  isVerifyingLogin: boolean;
  hasErrorLogin: boolean;

  // Functions
  verifyLogin: (token: string) => Promise<void>;
  handleLogin: (data: FormData, helpers: FormHelpers) => void;
  handleOpenModal: () => void;
  handleCloseModal: () => void;
  handleLogout: () => void;
};

export const UserContext = createContext({} as IUserContext);

export function UserProvider({ children }: IUserProvider) {
  const [isLogged, setIsLogged] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVerifyingLogin, setIsVerifyingLogin] = useState(false);
  const [hasErrorLogin, setHasErrorLogin] = useState(false);

  async function verifyLogin(token: string) {
    if (token) {
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
  }

  const handleLogin: SubmitHandler<FormData> = async (data, { reset }) => {
    setIsVerifyingLogin(true);
    if (data.email && data.password) {
      try {
        const response = await api.post("user/login", data);
        if (response.status === 200) {
          const token = response.data.token;
          api.defaults.headers.common = {
            Authorization: `Bearer ${token}`,
          };
          Cookies.set("_coopers_user_token", token, {
            expires: addHours(new Date(), 12),
          });
          reset();
          setIsLogged(true);
        }
      } catch (err) {
        setHasErrorLogin(true);
      }
    }
    setIsVerifyingLogin(false);
  };

  function handleLogout() {
    setIsLogged(false);
    api.defaults.headers.common = {
      Authorization: "",
    };
    Cookies.remove("_coopers_user_token");
  }

  function handleOpenModal() {
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
  }

  const valueProvider = {
    // Booelans
    isLogged,
    isModalOpen,
    isVerifyingLogin,
    hasErrorLogin,

    // Functions
    verifyLogin,
    handleLogin,
    handleOpenModal,
    handleCloseModal,
    handleLogout,
  };

  return (
    <UserContext.Provider value={valueProvider}>
      {children}
    </UserContext.Provider>
  );
}
