import { model, Schema } from "mongoose"
import { INotification } from "../types"

const notificationSchema = new Schema<INotification>({
    taskid: {
        type: Schema.Types.ObjectId,
        ref: "Task",
        required: true
    },
    userid: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    read: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
})

const Notification = model("Notification", notificationSchema)
export default Notification;