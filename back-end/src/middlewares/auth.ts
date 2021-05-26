import { NextFunction, Request, Response } from "express";

import { UsersService } from "../services/UsersService";

const auth = async (req: Request, res: Response, next: NextFunction) => {
  const usersService = new UsersService();
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ message: "No authorization header found" });

  const token = authHeader.split(" ")[1];
  const userInfo = await usersService.validateToken(token);

  if (!userInfo)
    return res.status(401).json({ message: "Unable to validate user token" });

  req.body.user = userInfo;
  next();
};

export { auth };
