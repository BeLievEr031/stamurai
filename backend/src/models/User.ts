import { model, Schema } from "mongoose"
import { IUser } from "../types"

const userSchema = new Schema<IUser>({
    email: {
        type: String,
        unique: [true, "Email must be Unique."],
        index: true,
        required: [true, "Email must be given."]
    },
    name: {
        type: String,
        required: [true, "Name must be given."],
        trim: true,
        min: 3,
        max: 50
    },
    password: {
        type: String,
        required: [true, "Password must be given."]
    }
}, {
    timestamps: true
})

const User = model("User", userSchema)

export default User;