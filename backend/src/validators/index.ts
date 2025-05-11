import { notificationValidator, notificationPaginationValidator } from './notificationValidator';
import { registerValidator, loginValidator, userPaginationValidator } from "./authValidator"
import { addTaskValidator, updateTaskValidator, deleteTaskValidator, paginationQueryValidator } from './taskValidator';

export {
    registerValidator, loginValidator, userPaginationValidator,
    addTaskValidator, updateTaskValidator, deleteTaskValidator, paginationQueryValidator, notificationValidator, notificationPaginationValidator
};