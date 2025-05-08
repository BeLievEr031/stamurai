export interface IUser {
    name?: string;
    email: string;
    password: string;
}

export interface ITask {
    userid: string;
    title: string;
    description?: string;
    dueDate: Date;
    priority: 'low' | 'medium' | 'high';
    status: 'pending' | 'in-progress' | 'completed';
    assignerid?: string
}

export interface IPagination {
    page: string;
    limit: string;
    title?: string;
    description?: string;
    status?: string;
    priority?: string;
    dueData?: string;
    tab?: string;
}