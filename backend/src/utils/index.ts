import Config from "../config/config";
import logger from "../config/logger"
import bcrypt from "bcrypt"
export const hashPassword = async (password: string) => {
    try {
        const salt = await bcrypt.genSalt(+Config.SALT_ROUND!);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        logger.error(error)
    }
}



