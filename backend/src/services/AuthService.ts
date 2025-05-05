import { User } from "../models";
import { IUser } from "../types";

class AuthService {
    constructor(private userRepo: typeof User) { }

    async register(user: IUser) {
        const isUser = await this.userRepo.findOne({ email: user.email })
        if (isUser) {
            return null;
        }
        return await this.userRepo.create(user);
    }
}

export default AuthService;