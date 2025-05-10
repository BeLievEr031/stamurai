export interface IUser {
    _id?: string;
    name?: string;
    email: string;
    password: string;
}

export interface ITask {
    userid: string;
    title: string;
    description?: string;
    dueDate: Date;
    priority: string | 'low' | 'medium' | 'high';
    status: string | 'pending' | 'in-progress' | 'completed';
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

export interface IUserQuery {
    page: string;
    limit: string;
    search: string;
}