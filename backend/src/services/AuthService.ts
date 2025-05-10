import { RefreshToken, User } from "../models";
import { IRefreshToken, IUser, IUserQuery } from "../types";
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

    async getUser(query: IUserQuery) {
        const {
            limit = "10",
            page = '1',
            search
        } = query;

        const skip = (parseInt(page) - 1) * parseInt(limit);
        let users = null;

        let total = 0

        users = await this.userRepo.find({
            $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }]
        })
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        total = await this.userRepo.countDocuments({
            $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }]
        });

        return {
            users,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / parseInt(limit)),
            },
        };
    }
}

export default AuthService;