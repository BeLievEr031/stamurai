import { expressjwt } from "express-jwt";
import Config from "../config/config";

const authenticate = expressjwt({
    algorithms: ["HS256"],
    secret: Config.ACCESS_TOKEN_SECRET as string,
    getToken: function (req) {
        const { accessToken } = req.cookies
        if (accessToken) {
            return accessToken;
        }

        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            return req.headers.authorization.split(" ")[1];
        }

        return null;
    }
})

export default authenticate;