import { Request, NextFunction, Response, Router } from "express";
import { Request as AuthenticatRequest } from "express-jwt";
import { AuthService } from "../../services";
import { RefreshToken, User } from "../../models";
import { AuthController } from "../../controllers";
import { loginValidator, registerValidator, userPaginationValidator } from "../../validators";
import { AuthRequest, FetchUserRequest } from "../../types";
import authenticate from "../../middleware/authenticate";
import validateRefreshToken from "../../middleware/validateRefreshToken";

const authRouter = Router();
const authService = new AuthService(User, RefreshToken)
const authController = new AuthController(authService);

authRouter.post("/register", registerValidator, (req: Request, res: Response, next: NextFunction) => authController.register(req as AuthRequest, res, next))

authRouter.post("/login", loginValidator, (req: Request, res: Response, next: NextFunction) => authController.login(req as AuthRequest, res, next))

authRouter.get("/self", authenticate, (req: AuthenticatRequest, res: Response, next: NextFunction) => authController.self(req, res, next))

authRouter.delete("/logout", authenticate, (req: AuthenticatRequest, res: Response, next: NextFunction) => authController.logout(req, res, next))

authRouter.post("/refresh", validateRefreshToken, (req: AuthenticatRequest, res: Response, next: NextFunction) => authController.refresh(req, res, next))

authRouter.get("/users", authenticate, userPaginationValidator, (req: FetchUserRequest, res: Response, next: NextFunction) => authController.getUser(req, res, next))


export default authRouter;

