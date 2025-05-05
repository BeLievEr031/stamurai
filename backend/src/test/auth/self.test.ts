import request from 'supertest';
import app from '../../app';
import { User } from '../../models';

describe('POST /api/v1/auth/self', () => {
    const endpoint = '/api/v1/auth/login';

    it('should login and fetch user data using accessToken', async () => {
        await User.create({
            email: 'loginuser2@example.com',
            name: 'Login User',
            password: "Test12345!"
        });

        // Step 1: Login
        const loginRes = await request(app).post(endpoint).send({
            email: 'loginuser2@example.com',
            password: 'Test12345!',
        });

        expect(loginRes.statusCode).toBe(200);
        expect(loginRes.body.success).toBe(true);

        // Step 2: Extract cookies from login response
        // const cookies = loginRes.headers['set-cookie'];
        const cookies = loginRes.headers['set-cookie']

        expect(cookies).toEqual(
            expect.arrayContaining([
                expect.stringContaining('accessToken='),
                expect.stringContaining('refreshToken='),
            ])
        );

        const cookiesArr: string[] = []
        // Step 3: Reuse accessToken cookie in next request
        for (const cookie of cookies) {
            cookiesArr.push(cookie.split(";")[0])
        }

        // Step 4: Call protected route
        const selfRes = await request(app)
            .get('/api/v1/auth/self') // Adjust to your actual "self" endpoint
            .set('Cookie', cookiesArr); // Send cookie with accessToken

        // // Step 5: Validate response
        expect(selfRes.statusCode).toBe(200);
        expect(selfRes.body).toHaveProperty('user');
        expect(selfRes.body.user.email).toBe('loginuser2@example.com');
    });


});

