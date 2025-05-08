import { NextFunction, Response, Router } from "express";
import authenticate from "../../middleware/authenticate";
import { addTaskValidator, deleteTaskValidator, paginationQueryValidator, updateTaskValidator } from "../../validators";
import { TaskService } from "../../services";
import { TaskController } from "../../controllers/"
import { Task } from "../../models";
import { Request } from "express-jwt";
import { AddTaskRequest, DeleteTaskRequest, EditTaskRequest, PaginationRequest } from "../../types";
import { taskIdValidator } from "../../validators/taskValidator";
const taskRouter = Router();
const taskService = new TaskService(Task)
const taskController = new TaskController(taskService);

taskRouter.post('/', authenticate, addTaskValidator, (req: Request, res: Response, next: NextFunction) => taskController.add(req as AddTaskRequest, res, next))

taskRouter.put('/:id', authenticate, updateTaskValidator, (req: Request, res: Response, next: NextFunction) => taskController.update(req as EditTaskRequest, res, next))

taskRouter.delete('/:id', authenticate, deleteTaskValidator, (req: Request, res: Response, next: NextFunction) => taskController.delete(req as DeleteTaskRequest, res, next))

taskRouter.get('/', authenticate, paginationQueryValidator, (req: Request, res: Response, next: NextFunction) => taskController.get(req as PaginationRequest, res, next))

taskRouter.get('/single-task/:id', authenticate, taskIdValidator, (req: Request, res: Response, next: NextFunction) => taskController.singleTask(req as DeleteTaskRequest, res, next))

export default taskRouter;