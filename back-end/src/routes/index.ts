import { Router } from "express";

import { UsersController } from "../controllers/UsersController";
import { TodosController } from "../controllers/TodosController";
import { auth } from "../middlewares/auth";

const routes = Router();
const usersController = new UsersController();
const todosController = new TodosController();

routes.get("/todos", auth, todosController.findAllFromUser);
routes.post("/todos/create", auth, todosController.createTodo);
routes.put("/todos/update/:todo_id", auth, todosController.updateTodo);
routes.delete("/todos/delete/:todo_id", auth, todosController.deleteTodo);
routes.delete("/todos/deleteAll", auth, todosController.deleteAll);

routes.post("/user/login", usersController.findUser);
routes.post("/user/verify", usersController.validateToken);
routes.post("/user/create", usersController.createUser);

export { routes };
