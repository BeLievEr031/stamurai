import { expressjwt } from "express-jwt"
import Config from "../config/config";
import { IPayload } from "../types";
import { RefreshToken } from "../models";

const validateRefreshToken = expressjwt({
    algorithms: ['HS256'],
    secret: Config.REFRESH_TOKEN_SECRET!,
    getToken: function (req) {
        return req.cookies?.refreshToken || null;
    },

    isRevoked: async function (req, token) {
        const userId = (token?.payload as IPayload).userid;
        const tokenString = req.cookies?.refreshToken;

        const tokenInDb = await RefreshToken.findOne({
            userid: userId,
            token: tokenString,
        });

        return !tokenInDb;
    },
});

export default validateRefreshToken;