import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const auth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const accessToken = process.env.TOKEN_SECRET;

  if (!authHeader)
    return res.status(401).json({ message: "No authorization header found" });

  const token = authHeader.split(" ")[1];

  jwt.verify(token, accessToken, (err, user) => {
    if (err) return res.status(403).json(err);

    req.user = user;
    next();
  });
};

export { auth };
