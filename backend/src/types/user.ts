import { Request } from "express-jwt";
import mongoose, { Document } from "mongoose";
export interface IUser extends Document {
    email: string;
    name: string;
    password: string;
    role: string
}

export interface IPayload {
    userid: string;
    email: string;
    name: string;
    role: string;
}

export interface AuthRequest extends Request {
    body: IUser
}

export interface IRefreshToken {
    userid: mongoose.Types.ObjectId;
    token: string;
}

export interface IUserQuery {
    limit: string;
    page: string;
    search: string
}

export interface FetchUserRequest extends Request {
    query: {
        limit: string;
        page: string;
        search: string
    }
}