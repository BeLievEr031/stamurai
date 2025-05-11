import { NextFunction, Response } from "express";
import { NotificationService } from "../services";
import { NotificationRequest } from "../types";
import { validationResult } from "express-validator";
import { HttpStatus } from "../utils/constant";

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
}

export default NotificationController;