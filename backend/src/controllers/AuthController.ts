import mongoose from 'mongoose';
import { NextFunction, Response } from "express";
import { AuthService } from "../services";
import { AuthRequest, IPayload } from "../types";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { HttpStatus } from './../utils/constant';
import { generateAccessToken, generateRefreshToken } from "../utils";

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
            if (!registeredUser) {
                next(createHttpError(HttpStatus.BAD_REQUEST, "Email already exists."))
                return;
            }

            res.status(HttpStatus.CREATED).json({
                message: "User registered successfully.",
                user: registeredUser
            })

        } catch (error) {
            next(error);
        }
    }

    async login(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });
                return;
            }

            const user = await this.authService.login(req.body)
            if (!user) {
                next(createHttpError(HttpStatus.UNAUTHORIZED, "Invalid credentials."))
                return;
            }

            const payload: IPayload = {
                _id: String(user._id),
                email: user.email,
                name: user.name,
                role: "user"
            }

            // Generate access and refresh token
            const accessToken = generateAccessToken(payload);
            const refreshToken = generateRefreshToken(payload);

            await this.authService.persistRefreshToken({
                userid: new mongoose.Types.ObjectId(user._id as string),
                token: refreshToken
            });

            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60,
                secure: true,
                sameSite: "strict"
            })

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24 * 7,
                secure: true,
                sameSite: "strict"
            })

            res.status(HttpStatus.OK).json({
                success: true,
                message: 'User logged in successfully.',
            })
        } catch (error) {
            next(error)
        }
    }
}

export default AuthController;