import { Request } from "express";

export interface IUser {
    email: string;
    name: string;
    password: string;
}

export interface AuthRequest extends Request {
    body: IUser
}
