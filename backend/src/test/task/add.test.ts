import request from 'supertest';
import app from '../../app';
import { Task, User } from '../../models';
import { generateAccessToken } from '../../utils';

describe('POST /api/v1/task', () => {
    let accessToken: string;
    let userId: string;

    beforeAll(async () => {
        // Create a user
        const user = await User.create({
            email: 'taskuser@example.com',
            name: 'Task User',
            password: 'Test12345!',
            role: 'user'
        });

        userId = user._id as string;

        // Generate access token manually for test
        accessToken = generateAccessToken({
            userid: (user._id as string).toString(),
            email: user.email,
            name: user.name,
            role: user.role
        });
    });

    it('should successfully create a new task', async () => {
        const res = await request(app)
            .post('/api/v1/task')
            .set('Cookie', [`accessToken=${accessToken}`])
            .send({
                userid: userId,
                title: 'Test Task',
                description: 'This is a test task description',
                dueDate: new Date(Date.now() + 86400000).toISOString(), // tomorrow
                priority: 'high',
                status: 'pending',
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.task).toHaveProperty('title', 'Test Task');
        expect(res.body.task).toHaveProperty('priority', 'high');

        // Optional: Verify in database
        const taskInDb = await Task.findOne({ title: 'Test Task' });
        expect(taskInDb).toBeTruthy();
        expect(taskInDb?.userid.toString()).toBe(userId.toString());
    });

    it('should fail without access token', async () => {
        const res = await request(app)
            .post('/api/v1/task')
            .send({
                userid: userId,
                title: 'Unauthorized Task',
                description: 'This should fail',
                dueDate: new Date().toISOString(),
                priority: 'low',
                status: 'pending'
            });

        expect(res.statusCode).toBe(401);
    });

    it('should fail with invalid access token', async () => {
        const res = await request(app)
            .post('/api/v1/task')
            .set('Cookie', [`accessToken=invalidtoken`])
            .send({
                userid: userId,
                title: 'Invalid Token Task',
                description: 'This should fail',
                dueDate: new Date().toISOString(),
                priority: 'low',
                status: 'pending'
            });

        expect(res.statusCode).toBe(401);
    });

    it('should fail with missing required fields', async () => {
        const res = await request(app)
            .post('/api/v1/task')
            .set('Cookie', [`accessToken=${accessToken}`])
            .send({});

        expect(res.statusCode).toBe(422);
        expect(res.body.errors).toBeDefined();
    });

    it('should fail with invalid priority value', async () => {
        const res = await request(app)
            .post('/api/v1/task')
            .set('Cookie', [`accessToken=${accessToken}`])
            .send({
                userid: userId,
                title: 'Task with Bad Priority',
                description: 'Test',
                dueDate: new Date().toISOString(),
                priority: 'urgent', // invalid
                status: 'pending'
            });

        expect(res.statusCode).toBe(422);
        expect(res.body.errors).toBeDefined();
    });

    it('should fail with invalid status value', async () => {
        const res = await request(app)
            .post('/api/v1/task')
            .set('Cookie', [`accessToken=${accessToken}`])
            .send({
                userid: userId,
                title: 'Task with Bad Status',
                description: 'Test',
                dueDate: new Date().toISOString(),
                priority: 'low',
                status: 'done' // invalid
            });

        expect(res.statusCode).toBe(422);
        expect(res.body.errors).toBeDefined();
    });

    it('should fail with invalid due date', async () => {
        const res = await request(app)
            .post('/api/v1/task')
            .set('Cookie', [`accessToken=${accessToken}`])
            .send({
                userid: userId,
                title: 'Task with Bad Date',
                description: 'Test',
                dueDate: 'not-a-date',
                priority: 'low',
                status: 'pending'
            });

        expect(res.statusCode).toBe(422);
        expect(res.body.errors).toBeDefined();
    });

    it('should successfully create a new task', async () => {
        const res = await request(app)
            .post('/api/v1/task')
            .set('Cookie', [`accessToken=${accessToken}`])
            .send({
                userid: userId,
                title: 'Test Task',
                description: 'This is a test task description',
                dueDate: new Date(Date.now() + 86400000).toISOString(), // tomorrow
                priority: 'high',
                status: 'pending',
                assignerid: userId
            });


        expect(res.statusCode).toBe(201);
        expect(res.body.task).toHaveProperty('assignerid', String(userId));

    });
});
