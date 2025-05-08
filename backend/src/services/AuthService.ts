import { RefreshToken, User } from "../models";
import { IRefreshToken, IUser } from "../types";
import { comparePassword } from "../utils";

class AuthService {
    constructor(private userRepo: typeof User, private refreshTokenRepo: typeof RefreshToken) { }

    async register(user: IUser) {
        const isUser = await this.userRepo.findOne({ email: user.email })
        if (isUser) {
            return null;
        }
        return await this.userRepo.create(user);
    }

    async login(user: IUser) {
        const isUser = await this.userRepo.findOne({ email: user.email })
        if (!isUser) {
            return null;
        }

        const isPassword = await comparePassword(user.password, isUser.password)

        if (!isPassword) {
            return null;
        }

        return isUser;
    }

    async persistRefreshToken(data: IRefreshToken) {
        return this.refreshTokenRepo.create(data);
    }

    async deleteRefreshToken(userid: string) {
        return this.refreshTokenRepo.findOneAndDelete({ userid })
    }

    async self(_id: string) {
        return await this.userRepo.findById(_id).select("-password")
    }

    async logout(userid: string) {
        return this.refreshTokenRepo.findOneAndDelete({ userid })
    }
}

export default AuthService;