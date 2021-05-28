import { TodoProvider } from "../contexts/TodoContex";
import { UserProvider } from "../contexts/UserContext";

import "../styles/globals.scss";

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <TodoProvider>
        <Component {...pageProps} />
      </TodoProvider>
    </UserProvider>
  );
}

export default MyApp;
