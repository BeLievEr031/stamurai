import request from 'supertest';
import app from '../../app';
import { RefreshToken, User } from '../../models';

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

    it('should persist refresh token in the database on login', async () => {
        // Step 1: Create a user in the database (if needed)
        const user = await User.create({
            email: 'loginuser1@example.com',
            name: 'Login User',
            password: 'Test12345!', // ensure password is hashed if needed
            role: 'user',
        });

        // Step 2: Make the login request
        const res = await request(app)
            .post(endpoint)
            .send({
                email: 'loginuser1@example.com',
                password: 'Test12345!',
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message.toLowerCase()).toContain('success');

        const cookies = res.headers['set-cookie'];

        let refreshToken: string | null = null;

        for (const cookie of cookies) {
            if (cookie.startsWith('refreshToken=')) {
                refreshToken = cookie.split(';')[0].split('=')[1];
                break;
            }
        }

        // Step 3: Check if refresh token exists in the response cookies
        expect(cookies).toEqual(
            expect.arrayContaining([
                expect.stringContaining('accessToken='),
                expect.stringContaining('refreshToken='),
            ])
        );

        // Step 4: Retrieve the refresh token from the database
        const refreshTokenRecord = await RefreshToken.findOne({
            userid: user._id,
            token: refreshToken
        });

        // Step 5: Verify that the refresh token was persisted
        expect(refreshTokenRecord).toBeTruthy();
        expect(refreshTokenRecord?.token).toBeDefined(); // The token should exist
        expect(refreshTokenRecord?.userid.toString()).toBe((user._id as string).toString()); // Ensure it's the same user

    });
});

