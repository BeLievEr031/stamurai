import request from 'supertest';
import app from '../../app';
import { Task, User } from '../../models';
import { generateAccessToken } from '../../utils';

describe('PUT /api/v1/task/:id', () => {
    let accessToken: string;
    let userId: string;
    let taskId: string;

    beforeAll(async () => {
        const user = await User.create({
            email: 'updatetaskuser@example.com',
            name: 'Update User',
            password: 'Test12345!',
            role: 'user'
        });

        userId = (user._id as string).toString();

        accessToken = generateAccessToken({
            userid: userId,
            email: user.email,
            name: user.name,
            role: user.role
        });

        const task = await Task.create({
            userid: userId,
            title: 'Original Task',
            description: 'Original description',
            dueDate: new Date(Date.now() + 86400000),
            priority: 'medium',
            status: 'pending'
        });

        taskId = task._id.toString();
    });

    it('should update the task successfully', async () => {
        const res = await request(app)
            .put(`/api/v1/task/${taskId}`)
            .set('Cookie', [`accessToken=${accessToken}`])
            .send({
                userid: userId,
                title: 'Updated Task Title',
                description: 'Updated Description',
                priority: 'high',
                status: 'in-progress',
                dueDate: new Date(Date.now() + 86400000),

            });

        expect(res.statusCode).toBe(200);
        expect(res.body.task).toHaveProperty('title', 'Updated Task Title');
        expect(res.body.task).toHaveProperty('priority', 'high');
        expect(res.body.task).toHaveProperty('status', 'in-progress');

        const updatedTask = await Task.findById(taskId);
        expect(updatedTask?.title).toBe('Updated Task Title');
    });

    it('should return 404 if task not found', async () => {
        const fakeId = '64fdafcfdafcfdafcfdafcfd'; // valid format but fake

        const res = await request(app)
            .put(`/api/v1/task/${fakeId}`)
            .set('Cookie', [`accessToken=${accessToken}`])
            .send({
                userid: userId,
                title: 'Updated Task Title',
                description: 'Updated Description',
                priority: 'high',
                status: 'in-progress',
                dueDate: new Date(Date.now() + 86400000),

            });

        expect(res.statusCode).toBe(404);
    });

    it('should return 422 on invalid update data', async () => {
        const res = await request(app)
            .put(`/api/v1/task/${taskId}`)
            .set('Cookie', [`accessToken=${accessToken}`])
            .send({
                priority: 'invalid-priority',
                status: 'done'
            });

        expect(res.statusCode).toBe(422);
        expect(res.body.errors).toBeDefined();
    });

    it('should return 401 when unauthorized', async () => {
        const res = await request(app)
            .put(`/api/v1/task/${taskId}`)
            .send({
                title: 'No Auth'
            });

        expect(res.statusCode).toBe(401);
    });
});
