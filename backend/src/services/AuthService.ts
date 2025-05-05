import { User } from "../models";
import { IUser } from "../types";
import { comparePassword } from "../utils";

class AuthService {
    constructor(private userRepo: typeof User) { }

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
}

export default AuthService;