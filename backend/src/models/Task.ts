import mongoose, { Schema } from 'mongoose';
import { ITask } from '../types';


const TaskSchema: Schema<ITask> = new Schema(
    {
        userid: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        title: {
            type: String,
            required: true,
            trim: true,
            min: 3
        },
        description: {
            type: String,
            required: true,
            trim: true,
            min: 5,
            max: 500
        },
        dueDate: {
            type: Date,
            required: true,
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'medium',
        },
        status: {
            type: String,
            enum: ['pending', 'in-progress', 'completed'],
            default: 'pending',
        },
        assignerid: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        }
    },
    {
        timestamps: true,
    }
);

const Task = mongoose.model<ITask>('Task', TaskSchema);
export default Task;
