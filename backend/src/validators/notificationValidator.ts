import { checkSchema } from 'express-validator';

export const notificationValidator = checkSchema({
    taskid: {
        in: ['body'],
        exists: {
            errorMessage: 'Task ID is required',
        },
        isMongoId: {
            errorMessage: 'Task ID must be a valid MongoDB ObjectId',
        },
    },
    userid: {
        in: ['body'],
        exists: {
            errorMessage: 'User ID is required',
        },
        isMongoId: {
            errorMessage: 'User ID must be a valid MongoDB ObjectId',
        },
    },
    read: {
        in: ['body'],
        optional: true,
        isBoolean: {
            errorMessage: 'Read must be a boolean value',
        },
        toBoolean: true, // Converts the value to boolean
    },
});
