import app from "./app";
import { createServer } from 'node:http';
import Config from "./config/config";
import logger from "./config/logger";
import dbConnect from "./db/dbConnect";
import { Server } from "socket.io";

const server = createServer(app);
export const io = new Server(server);
export const onlineUsers = new Map();



dbConnect().then(() => {
    const PORT = Config.PORT;
    server.listen(PORT, () => {
        logger.info(`Connected to server at ${PORT}`);
    })

    io.on('connection', (socket) => {
        console.log('a user connected');

        socket.on('register', (userId) => {
            onlineUsers.set(userId, socket.id);
            console.log(`User registered: ${userId} with socket ID ${socket.id}`);
        });

        socket.on('disconnect', () => {
            for (const [userId, sockId] of onlineUsers.entries()) {
                if (sockId === socket.id) {
                    onlineUsers.delete(userId);
                    break;
                }
            }
            console.log('A user disconnected:', socket.id);
        });

    })

}).catch((error) => {
    logger.error(error);
    process.exit(1)
})