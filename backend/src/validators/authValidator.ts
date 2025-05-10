import { checkSchema } from 'express-validator';

export const registerValidator = checkSchema({
    email: {
        in: ['body'],
        isEmail: {
            errorMessage: 'Email must be valid',
        },
        normalizeEmail: true,
        notEmpty: {
            errorMessage: 'Email is required',
        },
    },
    name: {
        in: ['body'],
        isString: {
            errorMessage: 'Name must be a string',
        },
        isLength: {
            options: { min: 3, max: 50 },
            errorMessage: 'Name must be between 2 and 50 characters',
        },
        trim: true,
        notEmpty: {
            errorMessage: 'Name is required',
        },
    },
    password: {
        in: ['body'],
        isString: {
            errorMessage: 'Password must be a string',
        },
        isLength: {
            options: { min: 6 },
            errorMessage: 'Password must be at least 6 characters long',
        },
        notEmpty: {
            errorMessage: 'Password is required',
        },
    },
});

export const loginValidator = checkSchema({
    email: {
        in: ['body'],
        isEmail: {
            errorMessage: 'Email must be valid',
        },
        normalizeEmail: true,
        notEmpty: {
            errorMessage: 'Email is required',
        },
    },
    password: {
        in: ['body'],
        isString: {
            errorMessage: 'Password must be a string',
        },
        isLength: {
            options: { min: 6 },
            errorMessage: 'Password must be at least 6 characters long',
        },
        notEmpty: {
            errorMessage: 'Password is required',
        },
    },
});


export const userPaginationValidator = checkSchema({
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
            errorMessage: 'Title must be a string',
        },
        trim: true,
    },
});