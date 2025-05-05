import { Request } from "express";
import mongoose, { Document } from "mongoose";
export interface IUser extends Document {
    email: string;
    name: string;
    password: string;
    role: string
}

export interface IPayload {
    _id: string;
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