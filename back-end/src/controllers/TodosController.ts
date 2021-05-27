import { Request, Response } from "express";

import { TodosService } from "../services/TodosService";
import { User } from "../entities/User";

type IPropsBody = {
  user: User;
};

type ITodo = {
  text?: string;
  hasCompleted?: boolean;
};

interface ICreateProps extends IPropsBody {
  text: string;
}

class TodosController {
  async findAllFromUser(req: Request, res: Response): Promise<Response> {
    const { user }: IPropsBody = req.body;
    const todosService = new TodosService();

    try {
      const todos = await todosService.findAllFromUser(user.id);

      return res.json(todos);
    } catch (err) {
      return res.status(404).json(err);
    }
  }

  async createTodo(req: Request, res: Response): Promise<Response> {
    const { text, user }: ICreateProps = req.body;
    const todosService = new TodosService();

    try {
      const todo = await todosService.create({ text, user_id: user.id });

      return res.status(201).json(todo);
    } catch (err) {
      return res.status(404).json(err);
    }
  }

  async updateTodo(req: Request, res: Response): Promise<Response> {
    const { text, hasCompleted } = req.body;
    const { todo_id } = req.params;
    const todosService = new TodosService();

    try {
      const todoUpdated = await todosService.update(todo_id, {
        text,
        hasCompleted,
      });

      if (!todoUpdated) res.status(404).json({ message: "Todo not found" });

      return res.status(202).json(todoUpdated);
    } catch (err) {
      return res.status(404).json(err);
    }
  }

  async deleteTodo(req: Request, res: Response): Promise<Response> {
    const { todo_id } = req.params;
    const todosService = new TodosService();

    try {
      const response = await todosService.delete(todo_id);

      if (!response) return res.status(404).json({ message: "Todo not found" });

      return res.status(200).json({ message: "Todo delete successfully" });
    } catch (err) {
      return res.status(404).json(err);
    }
  }

  async deleteAll(req: Request, res: Response): Promise<Response> {
    const { user } = req.body;
    const { hasCompleted } = req.params;
    const todosService = new TodosService();

    try {
      const response = await todosService.deleteAll(
        user.id,
        hasCompleted == "0" ? false : true
      );

      if (!response) return res.status(404).json({ message: "Todo not found" });

      return res.status(200).json({ message: "Todos delete successfully" });
    } catch (err) {
      return res.status(404).json(err);
    }
  }
}

export { TodosController };
