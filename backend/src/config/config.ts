import dotenvFlow from 'dotenv-flow';
dotenvFlow.config();

const Config = {
    PORT: process.env.PORT,
    DB_URI: process.env.DB_URI,
    ORIGINS: process.env.ORIGINS,
    NODE_ENV: process.env.NODE_ENV,
    SALT_ROUND: process.env.SALT_ROUND,
    JWT_SECRET: process.env.JWT_SECRET,
} as const;

export default Config;