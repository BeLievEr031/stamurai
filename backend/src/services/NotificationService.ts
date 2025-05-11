import { Types } from "mongoose";
import { Notification } from "../models";
import { INotification, INotificationQuery } from "../types";

class NotificationService {
    constructor(private notificationRepo: typeof Notification) { }

    async create(notification: INotification) {
        return await this.notificationRepo.create(notification)
    }

    async get(userid: string, query: INotificationQuery) {
        const { limit, page } = query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        return await this.notificationRepo.find({ userid: new Types.ObjectId(userid) })
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 })
            .populate("taskid");
    }
}

export default NotificationService;