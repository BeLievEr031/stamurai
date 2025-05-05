import { User } from "../models";

class AuthService {
    constructor(private userRepo: typeof User) { }
}

export default AuthService;