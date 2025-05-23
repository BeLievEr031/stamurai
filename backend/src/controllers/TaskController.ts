import { NextFunction, Response } from "express";
import { TaskService } from "../services";
import { AddTaskRequest, DeleteTaskRequest, EditTaskRequest, IPayload, PaginationRequest } from "../types";
import { validationResult } from "express-validator";
import { HttpStatus } from "../utils/constant";
import createHttpError from "http-errors";
import logger from "../config/logger";
import { Request } from "express-jwt";

class TaksController {
    constructor(private taskService: TaskService) { }

    async add(req: AddTaskRequest, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });
                return;
            }

            const task = await this.taskService.add(req.body)
            res.status(HttpStatus.CREATED).json({
                success: true,
                message: "Taks created successfully.",
                task
            })

        } catch (error) {
            next(error)
        }
    }

    async update(req: EditTaskRequest, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                logger.error(JSON.stringify({ errors: errors.array() }))
                res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });
                return;
            }

            const { id } = req.params
            const task = await this.taskService.update(id, req.body)

            if (!task) {
                next(createHttpError(HttpStatus.NOT_FOUND, "Invalid task."))
            }

            res.status(HttpStatus.OK).json({
                success: true,
                message: "Taks Updated successfully.",
                task
            })

        } catch (error) {
            next(error)
        }
    }

    async delete(req: DeleteTaskRequest, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });
                return;
            }

            const { id } = req.params
            const isDeleted = await this.taskService.delete(req.auth?.userid, id)
            if (!isDeleted) {
                next(createHttpError(HttpStatus.BAD_REQUEST, "Invalid task."))
                return;
            }

            res.status(HttpStatus.CREATED).json({
                success: true,
                message: "Taks Delete successfully.",
            })

        } catch (error) {
            next(error)
        }
    }

    async get(req: PaginationRequest, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });
                return;
            }

            const { userid } = req.auth as IPayload
            const task = await this.taskService.get(userid, req.query)

            res.status(HttpStatus.CREATED).json({
                success: true,
                message: "Task fetched successfully.",
                task
            })

        } catch (error) {
            next(error)
        }
    }

    async stat(req: Request, res: Response, next: NextFunction) {
        try {
            const { userid } = req.auth as IPayload
            const result = await this.taskService.stat(userid)
            res.status(HttpStatus.OK).json({
                success: true,
                message: "Task statistics retrieved successfully",
                stat: result[0],
            });
        } catch (error) {
            next(error)
        }
    }

    async singleTask(req: DeleteTaskRequest, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });
                return;
            }

            const { userid } = req.auth as IPayload

            const task = await this.taskService.singleTask(userid, req.params.id);
            if (!task) {
                next(createHttpError(HttpStatus.NOT_FOUND, "Invalid task-id."))
                return;
            }

            res.status(HttpStatus.CREATED).json({
                success: true,
                message: "Task fetched successfully.",
                task
            })
        } catch (error) {
            next(error)
        }
    }
}

export default TaksController;