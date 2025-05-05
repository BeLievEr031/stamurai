// __tests__/auth/login.test.ts

import request from 'supertest';
import app from '../../app';
import { User } from '../../models';

describe('POST /api/v1/auth/login', () => {
    const endpoint = '/api/v1/auth/login';

    beforeAll(async () => {
        // Seed user for login tests
        await User.create({
            email: 'loginuser@example.com',
            name: 'Login User',
            password: "Test12345!"
        });
    });

    it('should login successfully with valid credentials', async () => {
        const res = await request(app).post(endpoint).send({
            email: 'loginuser@example.com',
            password: 'Test12345!',
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message.toLowerCase()).toContain('success');

        // Check cookies
        const cookies = res.headers['set-cookie'];
        expect(cookies).toEqual(
            expect.arrayContaining([
                expect.stringContaining('accessToken='),
                expect.stringContaining('refreshToken='),
            ])
        );
    });

    it('should fail with wrong password', async () => {
        const res = await request(app).post(endpoint).send({
            email: 'loginuser@example.com',
            password: 'WrongPass123',
        });

        expect(res.statusCode).toBe(401);
        expect(res.body.message?.toLowerCase()).toContain('invalid');
    });

    it('should fail with missing email', async () => {
        const res = await request(app).post(endpoint).send({
            password: 'SomePassword',
        });

        expect(res.statusCode).toBe(422);
        expect(res.body.errors).toBeDefined();
    });

    it('should fail with missing password', async () => {
        const res = await request(app).post(endpoint).send({
            email: 'loginuser@example.com',
        });

        expect(res.statusCode).toBe(422);
        expect(res.body.errors).toBeDefined();
    });

    it('should fail with unregistered email', async () => {
        const res = await request(app).post(endpoint).send({
            email: 'notfound@example.com',
            password: 'AnyPass123',
        });

        expect(res.statusCode).toBe(401);
        expect(res.body.message?.toLowerCase()).toContain('invalid');
    });
});
