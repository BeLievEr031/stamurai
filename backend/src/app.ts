import express, { Request, Response, NextFunction } from "express";
import cors from "cors"
import cookieParser from "cookie-parser"
import helmet from "helmet"
import Config from "./config/config";
import { HttpError } from "http-errors";
import { authRouter } from "./routes/v1";

const app = express();

app.use(express.json({ limit: "1MB" }))
app.use(express.urlencoded({ extended: true, limit: "1MB" }))
app.use(cors({
    credentials: true,
    origin: Config.ORIGINS?.split(",") || []
}))
app.use(cookieParser())
app.use(helmet())


app.use("/api/v1/auth", authRouter)

app.get("/api/v1/health", (req: Request, res: Response) => {
    res.status(201).json({
        message: "Api is working fine."
    })
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: HttpError, req: Request, res: Response, _next: NextFunction) => {
    const statusCode = err.statusCode || err.status || 500;
    res.status(statusCode).json({
        statusCode,
        type: err.name,
        message: err.message,
        url: req.url,
        ip: req.ip,
        success: false,
        stack: Config.NODE_ENV === 'production' ? null : err.stack,
    });
});
export default app;
