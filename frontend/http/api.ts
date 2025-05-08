import { ITask, IUser } from "@/types";
import api from ".";

export const registerUser = async (data: IUser) => api.post("/auth/register", data)
export const loginUser = async (data: IUser) => api.post("/auth/login", data)
export const self = async () => api.get("/auth/self")
export const refreshToken = async () => api.post("/auth/refresh")


// Api for the tasks
export const createTask = async (data: ITask) => api.post("/task", data)