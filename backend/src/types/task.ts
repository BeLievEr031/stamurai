import { Request } from 'express-jwt';
import { Document, Schema, } from 'mongoose';

export interface ITask extends Document {
    userid: Schema.Types.ObjectId;
    title: string;
    description?: string;
    dueDate: Date;
    priority: 'low' | 'medium' | 'high';
    status: 'pending' | 'in-progress' | 'completed';
    assignerid?: Schema.Types.ObjectId
}

export interface AddTaskRequest extends Request {
    body: ITask
}

export interface EditTaskRequest extends Request {
    params: {
        _id: string;
    },
    body: ITask
}

// export interface 
