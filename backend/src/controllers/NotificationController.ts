import { NextFunction, Response } from "express";
import { NotificationService } from "../services";
import { NotificationRequest } from "../types";
import { validationResult } from "express-validator";
import { HttpStatus } from "../utils/constant";
import { GetNotificationRequest } from "../types/notification";

class NotificationController {
    constructor(private notificationService: NotificationService) { }

    async create(req: NotificationRequest, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });
                return;
            }

            const notification = await this.notificationService.create(req.body);
            res.status(HttpStatus.CREATED).json({
                success: true,
                message: "Notification fetched successfully.",
                notification
            })

        } catch (error) {
            next(error)
        }
    }

    async get(req: GetNotificationRequest, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });
                return;
            }

            const notification = await this.notificationService.get(req.auth?.userid, req.query)

            res.status(HttpStatus.OK).json({
                success: true,
                message: "Notification fetched successfully.",
                notification
            })

        } catch (error) {
            next(error)
        }
    }
}

export default NotificationController;