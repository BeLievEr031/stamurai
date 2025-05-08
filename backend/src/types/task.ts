import { Request } from 'express-jwt';
import mongoose from 'mongoose';
export interface ITask {
    userid: mongoose.Types.ObjectId;
    title: string;
    description?: string;
    dueDate: Date;
    priority: 'low' | 'medium' | 'high';
    status: 'pending' | 'in-progress' | 'completed';
    assignerid?: mongoose.Types.ObjectId
}

export interface AddTaskRequest extends Request {
    body: ITask
}

export interface EditTaskRequest extends Request {
    params: {
        id: string;
    },
    body: ITask
}

export interface DeleteTaskRequest extends Request {
    params: {
        id: string;
    }
}

export interface IPagination {
    page: string;
    limit: string;
    title?: string;
    description?: string;
    status?: string;
    priority?: string;
    dueData?: string;
    tab?: string;
}

export interface PaginationRequest extends Request {
    query: {
        page: string;
        limit: string;
        title?: string;
        description?: string;
        status?: string;
        priority?: string;
        dueData?: string;
    }
}

