import { Request, Response } from "express";

import { TodosService } from "../services/TodosService";
import { User } from "../entities/User";

type IFindPropsBody = {
  user: User;
};

class TodosController {
  async findAllFromUser(req: Request, res: Response): Promise<Response> {
    const { user }: IFindPropsBody = req.body;
    const todosService = new TodosService();

    try {
      const todos = await todosService.findAllFromUser(user.id);

      return res.json(todos);
    } catch (err) {
      return res.status(404).json(err);
    }
  }

  async createTodo(req: Request, res: Response) {}

  async updateTodo(req: Request, res: Response) {}

  async deleteTodo(req: Request, res: Response) {}
}

export { TodosController };
