import app from "./app";
import Config from "./config/config";
import logger from "./config/logger";
import dbConnect from "./db/dbConnect";

dbConnect().then(() => {
    const PORT = Config.PORT;
    app.listen(PORT, () => {
        logger.info(`Connected to server at ${PORT}`);
    })

}).catch((error) => {
    logger.error(error);
    process.exit(1)
})