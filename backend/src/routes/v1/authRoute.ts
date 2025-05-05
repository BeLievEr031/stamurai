import { Request, NextFunction, Response, Router } from "express";
import { AuthService } from "../../services";
import { User } from "../../models";
import { AuthController } from "../../controllers";
import { loginValidator, registerValidator } from "../../validators";
import { AuthRequest } from "../../types";

const authRouter = Router();
const authService = new AuthService(User)
const authController = new AuthController(authService);

authRouter.post("/register", registerValidator, (req: Request, res: Response, next: NextFunction) => authController.register(req as AuthRequest, res, next))

authRouter.post("/login", loginValidator, (req: Request, res: Response, next: NextFunction) => authController.login(req as AuthRequest, res, next))

export default authRouter;