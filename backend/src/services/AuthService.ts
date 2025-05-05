import { User } from "../models";
import { IUser } from "../types";

class AuthService {
    constructor(private userRepo: typeof User) { }

    async register(user: IUser) {
        return await this.userRepo.create(user);
    }
}

export default AuthService;