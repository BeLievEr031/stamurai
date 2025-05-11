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

export interface INotificationQuery {
    page: string;
    limit: string;
}

export interface GetNotificationRequest extends Request {
    query: {
        page: string;
        limit: string;
    }
}