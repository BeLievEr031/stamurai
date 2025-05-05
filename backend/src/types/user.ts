import { Request } from "express";
export interface IUser {
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
