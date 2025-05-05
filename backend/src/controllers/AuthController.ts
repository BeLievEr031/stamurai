import { NextFunction, Response } from "express";
import { AuthService } from "../services";
import { AuthRequest } from "../types";
import { validationResult } from "express-validator";
import { HttpStatus } from "../utils/constant";

class AuthController {
    constructor(private authService: AuthService) { }

    async register(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });
                return;
            }

            const registeredUser = await this.authService.register(req.body);

            res.status(HttpStatus.CREATED).json({
                message: "User registered successfully.",
                user: registeredUser
            })

        } catch (error) {
            next(error);
        }
    }
}

export default AuthController;