import { Request } from 'express-jwt';
import { Schema } from 'mongoose';

export interface INotification {
    _id?: string;
    userid: Schema.Types.ObjectId;
    taskid: Schema.Types.ObjectId;
    read: boolean;
}

export interface NotificationRequest extends Request {
    body: INotification
}

