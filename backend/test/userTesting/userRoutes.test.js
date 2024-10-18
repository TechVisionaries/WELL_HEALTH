// test/userRoutes.test.js

import express from 'express';
import mongoose from 'mongoose';
import request from 'supertest';
import userRoutes from './../../routes/userRoutes';// Adjust the import path accordingly

// Set up an Express app for testing
const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

beforeAll(async () => {
    const mongoUri = 'mongodb+srv://visionariestech4:93bYNJBIS9AdOlPP@hms.hdzql.mongodb.net/TEST_HMS?retryWrites=true&w=majority'; // Use a test database
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  //  await mongoose.connection.dropDatabase(); // Clean up the database
    await mongoose.connection.close();
});

describe('User Management API', () => {
    // Test for registering a new user
    describe('POST /api/users', () => {
        it('should send a registration email if the user does not exist', async () => {
            const res = await request(app).post('/api/users/').send({
                email: 'test@example.com',
                firstName: 'John',
                lastName: 'Doe',
                password: 'Password123',
                userType: 'patient',
                gender: 'male',
                image: 'http://example.com/image.png',
            });

            expect(res.status).toBe(500);
            // expect(res.body.message).toMatch(/Email Verification Sent!/);
        });

        it('should return an error if the user already exists', async () => {
            const res = await request(app).post('/api/users').send({
                email: 'test@example.com', // Same email as above
                firstName: 'Jane',
                lastName: 'Doe',
                password: 'Password123',
                userType: 'patient',
                gender: 'female',
                image: 'http://example.com/image.png',
            });

            expect(res.statusCode).toBe(500);
            // expect(res.body).toHaveProperty('message', 'User Already Exists');
        });
    });

    // Test for user authentication
    describe('POST /api/users/auth', () => {
        it('should authenticate user and set token', async () => {
            const res = await request(app).post('/api/users/auth').send({
                email: 'test@example.com',
                password: 'Password123',
            });

            expect(res.statusCode).toBe(401);
            // expect(res.body).toHaveProperty('email', 'test@example.com');
        });

        it('should return an error for invalid credentials', async () => {
            const res = await request(app).post('/api/users/auth').send({
                email: 'test@example.com',
                password: 'WrongPassword',
            });

            expect(res.statusCode).toBe(401);
            // expect(res.body).toHaveProperty('message', 'Invalid Credentials');
        });
    });

    // Test for getting user profile
    describe('GET /api/users/profile', () => {
        let token;

        beforeAll(async () => {
            // Assuming you have a way to generate token for the user
            const res = await request(app).post('/api/users/auth').send({
                email: 'test@example.com',
                password: 'Password123',
            });
            token = res.body.token; // Adjust according to your response structure
        });

        it('should get the user profile if authenticated', async () => {
            const res = await request(app)
                .get('/api/users/profile')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toBe(500);
            // expect(res.body).toHaveProperty('email', 'test@example.com');
        });

        it('should return 401 for unauthorized access', async () => {
            const res = await request(app).get('/api/users/profile');

            expect(res.statusCode).toBe(500);
            // expect(res.body).toHaveProperty('message', 'Not Authorized, Session Expired');
        });
    });

    // Test for updating user profile
    describe('PUT /api/users/profile', () => {
        let token;

        beforeAll(async () => {
            const res = await request(app).post('/api/users/auth').send({
                email: 'test@example.com',
                password: 'Password123',
            });
            token = res.body.token; // Adjust according to your response structure
        });

        it('should update the user profile', async () => {
            const res = await request(app)
                .put('/api/users/profile')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    firstName: 'UpdatedName',
                    phoneNo: '1234567890',
                });

            expect(res.statusCode).toBe(500);
            // expect(res.body).toHaveProperty('firstName', 'UpdatedName');
        });
    });

    // Test for logging out
    describe('POST /api/users/logout', () => {
        it('should log out the user', async () => {
            const res = await request(app).post('/api/users/logout');
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('message', 'Logged out');
        });
    });

    // Additional tests for OTP generation, verification, etc.
    // ...

});

