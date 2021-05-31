import axios from "axios";
import Cookies from "js-cookie";

const token = Cookies.get("_coopers_user_token");

export const api = axios.create({
  baseURL: "http://localhost:3333",
});

if (token) {
  api.defaults.headers.common = {
    Authorization: `Bearer ${token}`,
  };
}
