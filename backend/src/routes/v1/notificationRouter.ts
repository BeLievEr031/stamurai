import { NextFunction, Response, Router } from "express";
import authenticate from "../../middleware/authenticate";
import { NotificationService } from "../../services";
import { Notification } from "../../models";
import { NotificationController } from "../../controllers";
import { notificationValidator } from "../../validators";
import { Request } from "express-jwt";
import { NotificationRequest } from "../../types";

const notificationRouter = Router()
const notificationService = new NotificationService(Notification);
const notificationController = new NotificationController(notificationService);

notificationRouter.post('/', authenticate, notificationValidator, (req: Request, res: Response, next: NextFunction) => notificationController.create(req as NotificationRequest, res, next))

export default notificationRouter;