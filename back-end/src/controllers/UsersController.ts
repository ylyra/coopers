import { Request, Response } from "express";

import { UsersService } from "../services/UsersService";

class UsersController {
  async findUser(req: Request, res: Response) {}

  async createUser(req: Request, res: Response) {}

  async validateToken(req: Request, res: Response) {}
}

export { UsersController };
