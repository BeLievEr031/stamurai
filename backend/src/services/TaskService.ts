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

    async delete(userid: string, taskid: string) {
        return await this.taskRepo.findOneAndDelete({ userid: new Types.ObjectId(userid), _id: taskid })
    }

    async get(userid: string, query: IPagination) {
        const {
            limit = '10',
            page = '1',
            search,
            dueData,
            priority,
            status,
            tab
        } = query;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const filters: any = {};
        filters.userid = userid;

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
        let total = 0;

        const searchFilter = search
            ? {
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ]
            }
            : {};

        if (tab === "all") {
            delete filters.userid;
            const baseQuery = {
                $and: [
                    filters,
                    searchFilter,
                    {
                        $or: [
                            { assignerid: new Types.ObjectId(userid) },
                            { userid: new Types.ObjectId(userid) }
                        ]
                    }
                ]
            };

            tasks = await this.taskRepo.find(baseQuery)
                .skip(skip)
                .limit(parseInt(limit))
                .sort({ createdAt: -1 });

            total = await this.taskRepo.countDocuments(baseQuery);
        }

        if (tab === "assigned") {
            const baseQuery = {
                $and: [
                    filters,
                    searchFilter,
                    {
                        $or: [
                            { assignerid: { $exists: true } },
                            { assignerid: { $ne: null } }
                        ]
                    }
                ]
            };

            tasks = await this.taskRepo.find(baseQuery)
                .skip(skip)
                .limit(parseInt(limit))
                .sort({ createdAt: -1 });

            total = await this.taskRepo.countDocuments(baseQuery);
        }

        if (tab === "created") {
            delete filters.userid;

            const baseQuery = {
                $and: [
                    filters,
                    searchFilter,
                    {
                        $or: [
                            { assignerid: new Types.ObjectId(userid) },
                            {
                                $and: [
                                    { userid: new Types.ObjectId(userid) },
                                    {
                                        $or: [
                                            { assignerid: { $exists: false } },
                                            { assignerid: { $eq: null } }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            };

            tasks = await this.taskRepo.find(baseQuery)
                .skip(skip)
                .limit(parseInt(limit))
                .sort({ createdAt: -1 });

            total = await this.taskRepo.countDocuments(baseQuery);
        }

        if (tab === "overdue") {
            const now = new Date();

            const baseQuery = {
                $and: [
                    filters,
                    searchFilter,
                    { dueDate: { $lt: now } },
                    {
                        $or: [
                            { assignerid: { $exists: false } },
                            { assignerid: { $eq: null } }
                        ]
                    }
                ]
            };

            tasks = await this.taskRepo.find(baseQuery)
                .skip(skip)
                .limit(parseInt(limit))
                .sort({ createdAt: -1 });

            total = await this.taskRepo.countDocuments(baseQuery);
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