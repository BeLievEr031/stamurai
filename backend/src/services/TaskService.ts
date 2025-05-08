import logger from "../config/logger";
import { Task } from "../models";
import { IPagination, ITask } from "../types";

class TaskServcie {
    constructor(private taskRepo: typeof Task) { }
    async add(task: ITask) {
        return await this.taskRepo.create(task)
    }

    async update(taskid: string, task: ITask) {
        return await this.taskRepo.findByIdAndUpdate({ _id: taskid }, {
            $set: task
        }, {
            new: true
        })
    }

    async delete(taskid: string) {
        return await this.taskRepo.findByIdAndDelete({ _id: taskid })
    }

    async get(userid: string, query: IPagination) {
        const {
            limit = '10',
            page = '1',
            title,
            description,
            dueData,
            priority,
            status,
        } = query;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const filters: any = {};
        filters.userid = userid;

        if (title) {
            filters.title = { $regex: title, $options: 'i' }; // case-insensitive partial match
        }

        if (description) {
            filters.description = { $regex: description, $options: 'i' };
        }

        if (priority) {
            filters.priority = priority;
        }

        if (status) {
            filters.status = status;
        }

        if (dueData) {
            filters.dueDate = new Date(dueData); // you may add more precise date matching if needed
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        logger.info(JSON.stringify(filters))
        const tasks = await this.taskRepo.find(filters)
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 }); // optional: sort by creation date desc

        const total = await this.taskRepo.countDocuments(filters);

        return {
            tasks,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / parseInt(limit)),
            },
        };
    }

}

export default TaskServcie;