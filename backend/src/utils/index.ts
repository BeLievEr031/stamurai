import Config from "../config/config";
import logger from "../config/logger"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { IPayload } from "../types";
export const hashPassword = async (password: string) => {
    try {
        const salt = await bcrypt.genSalt(+Config.SALT_ROUND!);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        logger.error(error)
    }
}



export const comparePassword = async (password: string, hashedPassword: string) => {
    return await bcrypt.compare(password, hashedPassword)
}

export const generateAccessToken = (payload: IPayload) => {
    return jwt.sign(payload, Config.ACCESS_TOKEN_SECRET!, {
        algorithm: "HS256",
        issuer: "stamrai-backend",
        jwtid: payload._id,
        expiresIn: "1h"
    })
}
export const generateRefreshToken = (payload: IPayload) => {
    return jwt.sign(payload, Config.REFRESH_TOKEN_SECRET!, {
        algorithm: "HS256",
        issuer: "stamrai-backend",
        jwtid: payload._id,
        expiresIn: "7d"
    })
}