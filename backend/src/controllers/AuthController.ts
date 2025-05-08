import mongoose from 'mongoose';
import { NextFunction, Response } from "express";
import { AuthService } from "../services";
import { AuthRequest, IPayload } from "../types";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { HttpStatus } from './../utils/constant';
import { generateAccessToken, generateRefreshToken } from "../utils";
import { Request as AuthenticateRequest } from 'express-jwt';

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
                userid: String(user._id),
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

    async logout(req: AuthenticateRequest, res: Response, next: NextFunction) {
        try {
            const { userid } = req.auth as IPayload;
            await this.authService.logout(userid)
            res.clearCookie("accessToken")
            res.clearCookie("refreshToken")

            res.status(HttpStatus.OK).json({
                success: true,
                message: "User logout successfully."
            })
        } catch (error) {
            next(error)
        }
    }
    async self(req: AuthenticateRequest, res: Response, next: NextFunction) {
        try {
            const user = await this.authService.self(req.auth?.userid)
            const data = {
                userid: user?._id,
                email: user?.email,
                role: user?.role,
                name: user?.name
            }
            res.status(HttpStatus.OK).json({
                success: true,
                message: "User data fetched.",
                user: data
            })
        } catch (error) {
            next(error)
        }
    }

    async refresh(req: AuthenticateRequest, res: Response, next: NextFunction) {
        try {
            const { userid, email, name, role } = (req.auth as IPayload)

            const payload: IPayload = {
                userid,
                email,
                name,
                role
            }

            // Generate access and refresh token
            const accessToken = generateAccessToken(payload);
            const refreshToken = generateRefreshToken(payload);

            // Delete Prev token
            const isDeleted = await this.authService.deleteRefreshToken(userid)

            if (!isDeleted) {
                next(createHttpError(HttpStatus.UNAUTHORIZED, "Invalid refresh token."));
            }

            await this.authService.persistRefreshToken({
                userid: new mongoose.Types.ObjectId(userid),
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
                message: 'Token refreshed successfully.',
            })
        } catch (error) {
            next(error)
        }
    }
}

export default AuthController;