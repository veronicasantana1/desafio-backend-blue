import { NextFunction } from "express";
import { Request, Response } from "express";
import { UnauthorizedError } from "../helpers/api-errors";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/userRepository";

type JwtPayload = {
    id: number;
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;

    if (!authorization) {
      throw new UnauthorizedError("Unauthorized");
    }

    const token = authorization.split(" ")[1];
    const { id } = jwt.verify(token, process.env.JWT_SECRET ?? '') as JwtPayload;

    const user = await UserRepository.findOneBy({ id });
    if (!user) {
      throw new UnauthorizedError("Unauthorized");
    }
    const { password: _, ...loggedUser } = user;

    req.user = loggedUser;
    
    next();
}