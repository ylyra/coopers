import { Request, Response } from "express";

import { TodosService } from "../services/TodosService";

class TodosController {
  async findAllFromUser(req: Request, res: Response) {}

  async createTodo(req: Request, res: Response) {}

  async updateTodo(req: Request, res: Response) {}

  async deleteTodo(req: Request, res: Response) {}
}

export { TodosController };
