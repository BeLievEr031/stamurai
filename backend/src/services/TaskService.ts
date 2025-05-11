import { Types } from "mongoose";
import { Notification, Task } from "../models";
import { IPagination, ITask } from "../types";
import { io, onlineUsers } from "../server";

class TaskServcie {
    constructor(private taskRepo: typeof Task, private notificationRepo: typeof Notification) { }
    async add(task: ITask) {
        const newTask = await this.taskRepo.create(task)
        if (task.assignerid) {
            // Emit notification to assignee
            const assigneeSocketId = onlineUsers.get(task.userid);
            if (assigneeSocketId) {
                io.to(assigneeSocketId).emit('task-assigned', newTask);
                await this.notificationRepo.create({
                    taskid: newTask._id,
                    userid: newTask.userid
                });
            }
        }
        return newTask;
    }

    async update(taskid: string, task: ITask) {
        const {
            userid,
            title,
            description,
            dueDate,
            priority,
            status,
            assignerid,
        } = task;

        if (assignerid) {
            return await this.taskRepo.findByIdAndUpdate({ _id: taskid }, {
                $set: {

                    userid,
                    title,
                    description,
                    dueDate,
                    priority,
                    status,
                    assignerid,

                }

            }, {
                new: true
            })
        }

        return await this.taskRepo.findByIdAndUpdate({ _id: taskid }, {
            $set: {

                userid,
                title,
                description,
                dueDate,
                priority,
                status,
            }

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
            tab
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

        if (priority && priority !== "all") {
            filters.priority = priority;
        }

        if (status && status !== "all") {
            filters.status = status;
        }

        if (dueData) {
            filters.dueDate = new Date(dueData);
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        let tasks = null;

        let total = 0


        if (tab === "all") {
            delete filters.userid
            tasks = await this.taskRepo.find({
                ...filters,
                $or: [
                    { assignerid: new Types.ObjectId(userid) },
                    { userid: new Types.ObjectId(userid) },
                ]
            })
                .skip(skip)
                .limit(parseInt(limit))
                .sort({ createdAt: -1 });
            total = await this.taskRepo.countDocuments(filters);
        }

        if (tab === "assigned") {
            tasks = await this.taskRepo.find({
                ...filters, $or: [
                    { assignerid: { $exists: true } },
                    { assignerid: { $ne: null } }
                ]
            })
                .skip(skip)
                .limit(parseInt(limit))
                .sort({ createdAt: -1 });

            total = await this.taskRepo.countDocuments({
                ...filters, $or: [
                    { assignerid: { $exists: true } },
                    { assignerid: { $ne: null } }
                ]
            });
        }

        if (tab === 'created') {
            delete filters.userid
            tasks = await this.taskRepo.find({
                ...filters, $or: [
                    { assignerid: new Types.ObjectId(userid) },
                    {
                        $and: [{ userid: new Types.ObjectId(userid) },
                        {
                            $or: [
                                { assignerid: { $exists: false } },
                                { assignerid: { $eq: null } }
                            ]
                        }
                        ]
                    }
                ]
            })
                .skip(skip)
                .limit(parseInt(limit))
                .sort({ createdAt: -1 });
            total = await this.taskRepo.countDocuments({
                ...filters, $or: [
                    { assignerid: { $exists: false } },
                    { assignerid: null }
                ]
            });
        }

        if (tab === 'overdue') {
            const now = new Date();
            tasks = await this.taskRepo.find({
                ...filters,
                dueDate: { $lt: now },
                $or: [
                    { assignerid: { $exists: false } },
                    { assignerid: { $eq: null } }
                ]
            })
                .skip(skip)
                .limit(parseInt(limit))
                .sort({ createdAt: -1 });

            total = await this.taskRepo.countDocuments({
                ...filters,
                dueDate: { $lt: now },
                $or: [
                    { assignerid: { $exists: false } },
                    { assignerid: { $eq: null } }
                ]
            });
        }


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

    async stat(userid: string) {
        return this.taskRepo.aggregate([
            {
                $facet: {
                    assignedToMe: [
                        { $match: { userid: new Types.ObjectId(userid), assignerid: { $exists: true } } },
                        { $count: "count" }
                    ],
                    createdByMe: [
                        { $match: { $or: [{ userid: new Types.ObjectId(userid), assignerid: { $exists: false } }, { assignerid: new Types.ObjectId(userid) }] } },
                        { $count: "count" }
                    ],
                    overdue: [
                        { $match: { $and: [{ userid: new Types.ObjectId(userid) }, { dueDate: { $lt: new Date() } }] } },
                        { $count: "count" }
                    ]
                }
            },
            {
                $project: {
                    assignedToMe: { $ifNull: [{ $arrayElemAt: ["$assignedToMe.count", 0] }, 0] },
                    createdByMe: { $ifNull: [{ $arrayElemAt: ["$createdByMe.count", 0] }, 0] },
                    overdue: { $ifNull: [{ $arrayElemAt: ["$overdue.count", 0] }, 0] },
                }
            }
        ]);
    }
    async singleTask(userid: string, taskid: string) {
        return await this.taskRepo.findOne({ _id: taskid, $or: [{ userid: new Types.ObjectId(userid) }, { assignerid: new Types.ObjectId(userid) }] })
    }
}

export default TaskServcie;