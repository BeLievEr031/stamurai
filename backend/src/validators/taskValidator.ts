import { checkSchema } from 'express-validator';

export const addTaskValidator = checkSchema({
    userid: {
        in: ['body'],
        isMongoId: true,
        errorMessage: 'Valid user ID is required',
    },
    title: {
        in: ['body'],
        isString: true,
        trim: true,
        isLength: {
            options: { min: 3 },
            errorMessage: 'Title must be at least 3 characters long',
        },
    },
    tab: {
        in: ['body'],
        isString: true,
        trim: true,
        optional: true
    },

    description: {
        in: ['body'],
        isString: true,
        trim: true,
        isLength: {
            options: { min: 5, max: 500 },
            errorMessage: 'Description must be between 5 and 500 characters',
        },
    },
    dueDate: {
        in: ['body'],
        isISO8601: true,
        toDate: true,
        errorMessage: 'Valid due date is required',
    },
    priority: {
        in: ['body'],
        optional: true,
        isIn: {
            options: [['low', 'medium', 'high']],
            errorMessage: 'Priority must be one of: low, medium, high',
        },
    },
    status: {
        in: ['body'],
        optional: true,
        isIn: {
            options: [['pending', 'in-progress', 'completed']],
            errorMessage: 'Status must be one of: pending, in-progress, completed',
        },
    },

    assignerid: {
        in: ['body'],
        optional: true,
        isString: true,
        trim: true,
    }
});

export const updateTaskValidator = checkSchema({
    id: {
        in: ['params'],
        isMongoId: true,
        errorMessage: 'Valid Task ID is required',
    },
    userid: {
        in: ['body'],
        isMongoId: true,
        errorMessage: 'Valid user ID is required',
    },
    title: {
        in: ['body'],
        isString: true,
        trim: true,
        isLength: {
            options: { min: 3 },
            errorMessage: 'Title must be at least 3 characters long',
        },
    },
    description: {
        in: ['body'],
        isString: true,
        trim: true,
        isLength: {
            options: { min: 5, max: 500 },
            errorMessage: 'Description must be between 5 and 500 characters',
        },
    },
    dueDate: {
        in: ['body'],
        isISO8601: true,
        toDate: true,
        errorMessage: 'Valid due date is required',
    },
    priority: {
        in: ['body'],
        optional: true,
        isIn: {
            options: [['low', 'medium', 'high']],
            errorMessage: 'Priority must be one of: low, medium, high',
        },
    },
    status: {
        in: ['body'],
        optional: true,
        isIn: {
            options: [['pending', 'in-progress', 'completed']],
            errorMessage: 'Status must be one of: pending, in-progress, completed',
        },
    },
    assignerid: {
        in: ['body'],
        optional: true,
        isString: true,
        trim: true,
    }
});

export const deleteTaskValidator = checkSchema({
    id: {
        in: ['params'],
        isMongoId: true,
        errorMessage: 'Valid Task ID is required',
    },
})


export const taskIdValidator = checkSchema({
    id: {
        in: ['params'],
        isMongoId: true,
        errorMessage: 'Valid Task ID is required',
    },
})

export const paginationQueryValidator = checkSchema({
    page: {
        in: ['query'],
        optional: true,
        isInt: {
            errorMessage: 'Page must be an integer',
        },
        toInt: true,
    },
    limit: {
        in: ['query'],
        optional: true,
        isInt: {
            errorMessage: 'Limit must be an integer',
        },
        toInt: true,
    },
    search: {
        in: ['query'],
        optional: true,
        isString: {
            errorMessage: 'Search must be a string',
        },
        trim: true,
    },
    status: {
        in: ['query'],
        optional: true,
        isIn: {
            options: [['all', 'pending', 'in-progress', 'completed']],
            errorMessage: 'Invalid status value',
        },
    },
    priority: {
        in: ['query'],
        optional: true,
        isIn: {
            options: [['all', 'low', 'medium', 'high']],
            errorMessage: 'Invalid priority value',
        },
    },
    dueData: {
        in: ['query'],
        optional: true,
        // isISO8601: {
        //     errorMessage: 'Due date must be a valid ISO 8601 date string',
        // },
        toDate: true,
    },
});

