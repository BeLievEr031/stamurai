import { Notification } from "../models";
import { INotification } from "../types";

class NotificationService {
    constructor(private notificationRepo: typeof Notification) { }

    async create(notification: INotification) {
        return await this.notificationRepo.create(notification)
    }
}

export default NotificationService;