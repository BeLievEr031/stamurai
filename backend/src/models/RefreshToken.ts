import { model, Schema } from "mongoose"
import { IRefreshToken } from "../types"

const refreshTokenSchema = new Schema<IRefreshToken>({
    userid: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    token: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

const RefreshToken = model("RefreshToken", refreshTokenSchema)
export default RefreshToken;