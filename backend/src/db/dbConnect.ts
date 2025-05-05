import mongoose from "mongoose";
import Config from "../config/config";
import logger from "../config/logger";

const dbConnect = async () => {
    try {
        if (!Config.DB_URI) {
            logger.error("DB URI Not provided.");
            process.exit(1)
        }

        mongoose.connection.on("connected", () => {
            logger.info("Connected to db!!");
        })

        mongoose.connection.on("error", (error) => {
            logger.error(error)
            process.exit(1)
        })

        await mongoose.connect(Config.DB_URI);
    } catch (error) {
        logger.error(error);
        process.exit(1)
    }
}

export default dbConnect;