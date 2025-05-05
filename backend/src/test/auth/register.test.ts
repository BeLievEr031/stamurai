import request from 'supertest';
import app from '../../app';
import { User } from '../../models';

describe('POST /api/v1/auth/register', () => {

    const endpoint = '/api/v1/auth/register';

    it('should register a new user successfully', async () => {
        const res = await request(app).post(endpoint).send({
            email: 'test@example.com',
            name: 'Test User',
            password: 'StrongPassword123',
        });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message.toLowerCase()).toContain('registered');

        const user = await User.findOne({ email: 'test@example.com' });
        expect(user).not.toBeNull();
        expect(user?.name).toBe('Test User');
    });

    it('should fail if email is missing', async () => {
        const res = await request(app).post(endpoint).send({
            name: 'No Email',
            password: '123456',
        });

        expect(res.statusCode).toBe(422);
        expect(res.body.errors).toBeDefined();
    });

    it('should fail if password is missing', async () => {
        const res = await request(app).post(endpoint).send({
            email: 'nopass@example.com',
            name: 'No Password',
        });

        expect(res.statusCode).toBe(422);
        expect(res.body.errors).toBeDefined();
    });

    it('should fail if name is missing', async () => {
        const res = await request(app).post(endpoint).send({
            email: 'noname@example.com',
            password: 'SomePass123',
        });

        expect(res.statusCode).toBe(422);
        expect(res.body.errors).toBeDefined();
    });

    it('should fail if email is invalid', async () => {
        const res = await request(app).post(endpoint).send({
            email: 'invalid-email',
            name: 'Test',
            password: 'StrongPass1',
        });

        expect(res.statusCode).toBe(422);
        expect(res.body.errors).toBeDefined();
    });

    it('should fail if password is too short', async () => {
        const res = await request(app).post(endpoint).send({
            email: 'shortpass@example.com',
            name: 'Test Short',
            password: '123',
        });

        expect(res.statusCode).toBe(422);
        expect(res.body.errors).toBeDefined();
    });

    it('should fail if email already exists', async () => {
        // First register a user
        await User.create({
            email: 'duplicate@example.com',
            name: 'First User',
            password: 'StrongPass123',
        });

        // Attempt to register again
        const res = await request(app).post(endpoint).send({
            email: 'duplicate@example.com',
            name: 'Second User',
            password: 'AnotherPass123',
        });

        expect(res.statusCode).toBe(400); // or 409 depending on your error handling
        expect(res.body.message?.toLowerCase()).toContain('exists');
    });

    it('should hash the password before saving', async () => {
        const plainPassword = 'MySecret123';
        await request(app).post(endpoint).send({
            email: 'hashcheck@example.com',
            name: 'Hash Check',
            password: plainPassword,
        });

        const user = await User.findOne({ email: 'hashcheck@example.com' });
        expect(user).not.toBeNull();
        expect(user!.password).not.toBe(plainPassword);
        expect(user!.password.length).toBeGreaterThan(20); // bcrypt hashed
    });

    it('should return user ID or basic data after registration', async () => {
        const res = await request(app).post(endpoint).send({
            email: 'responsecheck@example.com',
            name: 'Res Check',
            password: 'MySecret123',
        });

        expect(res.statusCode).toBe(201);
        expect(res.body.user).toHaveProperty('_id');
    });

});
