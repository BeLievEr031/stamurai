import { INotificationQuery, IPagination, ITask, IUser, IUserQuery } from "@/types";
import api from ".";

export const registerUser = async (data: IUser) => api.post("/auth/register", data)
export const loginUser = async (data: IUser) => api.post("/auth/login", data)
export const self = async () => api.get("/auth/self")
export const refreshToken = async () => api.post("/auth/refresh")
export const logout = async () => api.delete("/auth/logout")

export const getUser = async (query: IUserQuery) => api.get(`/auth/users?search=${query.search}&page=${query.page}&limit=${query.limit}`)

// Api for the tasks
export const createTask = async (data: ITask) => api.post("/task", data)

export const getTasks = async (query: IPagination) => api.get(`/task?title=${query.title}&description=${query.description}&priority=${query.priority}&dueData=${query.dueData}&status=${query.status}&limit=${query.limit}&page=${query.page}&tab=${query.tab}`)

export const getSingleTask = async (id: string) => api.get(`/task/single-task/${id}`)
export const updateTask = async (task: { taskid: string, data: ITask }) => api.put(`/task/${task.taskid}`, task.data)

export const getStat = async () => api.get("/task/stat")

// Notification
export const fetchNotification = async (query: INotificationQuery) => api.get(`/notification?limit=${query.limit}&page=${query.page}`)

