import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { UsersService } from "../services/UsersService";

const tokenSecret = process.env.TOKEN_SECRET;

class UsersController {
  async findUser(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;
    const usersService = new UsersService();

    const user = await usersService.findUser({ email });

    if (!user) return res.status(401).json({ message: "User not found" });

    const result = await bcrypt.compare(password, user.password);

    if (!result)
      return res.status(404).json({ message: "Type the right password" });

    const token = jwt.sign({ email: user.email }, tokenSecret);

    await usersService.updateUser(user.id, { token });

    return res.status(200).json({
      token,
    });
  }

  async createUser(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;
    const usersService = new UsersService();

    const pass = await bcrypt.hash(password, 10);

    try {
      const user = await usersService.createUser({ email, password: pass });

      if (!user)
        return res
          .status(401)
          .json({ message: "Unable to create a user with this e-mail" });

      return res.status(201).json(user);
    } catch (err) {
      return res.status(401).json({ message: "Unable to create user" });
    }
  }

  async validateToken(req: Request, res: Response): Promise<Response> {
    const { token } = req.body;
    const usersService = new UsersService();

    try {
      const user = await usersService.validateToken(token);
      if (!user)
        return res.status(401).json({ message: "Unable to validate user" });

      return res.status(200).json({ isLogged: true });
    } catch (err) {
      return res.status(404).json(err);
    }
  }
}

export { UsersController };
