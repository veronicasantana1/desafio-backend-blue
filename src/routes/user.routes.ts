import { Router } from "express";
import { createUser, getUserData } from "../controllers/userController";
import { userLogin } from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";


const userRouter = Router();

userRouter.post("/createUser", createUser);
userRouter.post("/login", userLogin);
userRouter.get("/profile", authMiddleware, getUserData);

export default userRouter;
