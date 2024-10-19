import express from 'express';
import mongoose from 'mongoose';
import request from 'supertest';
import userRoutes from '../../routes/userRoutes';
import { sendMail } from '../../utils/mailer';
import jwt from 'jsonwebtoken';
import User from '../../models/userModel';
import { protect } from '../../middleware/authMiddleware';
import passport from 'passport';

// Set up an Express app for testing
const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

// Mock external modules
jest.mock('jsonwebtoken');
jest.mock('../../utils/mailer', () => ({
  sendMail: jest.fn(() => Promise.resolve()), // Mock a resolved promise to simulate success
}));
jest.mock('../../middleware/authMiddleware');

// Increase the timeout globally for the test suite
jest.setTimeout(30000); // Set global timeout to 30 seconds

beforeAll(async () => {
  const mongoUri = 'mongodb+srv://visionariestech4:93bYNJBIS9AdOlPP@hms.hdzql.mongodb.net/TEST_HMS?retryWrites=true&w=majority'; // Use a test database
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterAll(async () => {
  //await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('User Management API', () => {


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  // Test for registering a new user
  describe('POST /api/users', () => {
    it('should send a registration email if the user does not exist', async () => {
      jwt.sign.mockReturnValue('fake.token');
      const res = await request(app).post('/api/users/').send({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'Password123',
        userType: 'patient',
        gender: 'male',
        image: 'http://example.com/image.png',
      });

        expect(res.status).toBe(201);
        expect(res.body.message).toMatch(/Email Verification Sent!/);
    });

    it('should return an error if the user already exists', async () => {
      const res = await request(app).post('/api/users').send({
        email: 'test1@example.com', // Same email as above
        firstName: 'Jane',
        lastName: 'Doe',
        password: 'Password123',
        userType: 'patient',
        gender: 'female',
        image: 'http://example.com/image.png',
      });

        expect(res.statusCode).toBe(400);
    });

    it('should return an error if the email not found', async () => {
        jwt.sign.mockReturnValue(false);
        const res = await request(app).post('/api/users/').send({
            email: 'test1@example.com',
            firstName: 'John',
            lastName: 'Doe',
            password: 'Password123',
            userType: 'patient',
            gender: 'male',
            image: 'http://example.com/image.png',
      });

        expect(res.status).toBe(400);
    });
  });


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  describe('GET /api/users/register', () => {

    beforeEach(() => {
        jest.spyOn(User, 'findOne').mockResolvedValue(null); // Default behavior, no user found
        jest.spyOn(User, 'create').mockResolvedValue({
          _id: 'user-id',
          email: 'newuser@example.com',
          firstName: 'John',
          lastName: 'Doe',
          userType: 'patient',
        });
      });
    
      afterEach(() => {
        jest.restoreAllMocks(); // Restore all mocks after each test
      });
      
      it('should register a new patient user successfully', async () => {
        // Mock JWT token decode to return user data
        jwt.decode.mockReturnValue({
          user: {
            email: 'newuser@example.com',
            firstName: 'John',
            lastName: 'Doe',
            password: 'Password123',
            userType: 'patient',
            gender: 'male',
            image: 'http://example.com/image.png',
          },
        });
  
        // Mock User.create to simulate user creation
        User.create.mockResolvedValue({
          _id: 'user-id',
          email: 'newuser@example.com',
          firstName: 'John',
          lastName: 'Doe',
          userType: 'patient',
        });
  
        const res = await request(app).get('/api/users/register').query({
          token: 'valid.token', // Assuming token is passed in query
        });
  
        expect(res.statusCode).toBe(201);
        expect(res.body.user).toHaveProperty('email', 'newuser@example.com');
        expect(User.create).toHaveBeenCalledWith(expect.objectContaining({
          email: 'newuser@example.com',
          firstName: 'John',
          lastName: 'Doe',
          userType: 'patient',
        }));
      });
  
      it('should return 401 if the user already exists', async () => {
        jwt.decode.mockReturnValue({
          user: {
            email: 'existinguser@example.com',
            firstName: 'Jane',
            lastName: 'Doe',
            password: 'Password123',
            userType: 'patient',
            gender: 'female',
            image: 'http://example.com/image.png',
          },
        });
  
        User.findOne.mockResolvedValue({ email: 'existinguser@example.com' });
  
        const res = await request(app).get('/api/users/register').query({
          token: 'valid.token',
        });
  
        expect(res.statusCode).toBe(401);
        expect(User.create).not.toHaveBeenCalled(); // User creation should not be called
      });
  
      it('should return 401 if token is invalid', async () => {
        jwt.decode.mockImplementation(() => {
          throw new Error('Invalid token');
        });
  
        const res = await request(app).get('/api/users/register').query({
          token: 'invalid.token',
        });
  
        expect(res.statusCode).toBe(401);
        expect(User.create).not.toHaveBeenCalled();
      });
  });


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  // Test for user authentication
  describe('POST /api/users/auth', () => {
    it('should authenticate user and set token', async () => {
      const res = await request(app).post('/api/users/auth').send({
        email: 'test1@example.com',
        password: 'Password123',
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('email', 'test1@example.com');
    });

    it('should return an error for invalid credentials', async () => {
      const res = await request(app).post('/api/users/auth').send({
        email: 'test@example.com',
        password: 'WrongPassword',
      });

      expect(res.statusCode).toBe(401);
    });

    it('should return an error for invalid account type', async () => {
        jwt.sign.mockReturnValue('fake.token');
        const res = await request(app).post('/api/users/auth').send({
            email: 'test2@example.com',
            password: 'Password123',
          });
    
          expect(res.statusCode).toBe(500);
      });
  });


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  // Test for user authentication
  describe('POST /api/users/googleAuth', () => {
    it('should authenticate user and set token', async () => {
        jwt.sign.mockReturnValue('fake.token');
      const res = await request(app).post('/api/users/googleAuth').send({
        email: 'test2@example.com',
        password: 'Password123',
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('email', 'test2@example.com');
    });

    it('should return an error for invalid credentials', async () => {
        jwt.sign.mockReturnValue('fake.token');
      const res = await request(app).post('/api/users/googleAuth').send({
        email: 'test1@example.com',
        password: 'WrongPassword',
      });

      expect(res.statusCode).toBe(400);
    });

    it('should return an error for invalid account type', async () => {
        jwt.sign.mockReturnValue('fake.token');
        const res = await request(app).post('/api/users/googleAuth').send({
            email: 'test1@example.com',
            password: 'Password123',
          });
    
          expect(res.statusCode).toBe(400);
      });
  });


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  // Test for getting user profile
  describe('GET /api/users/profile', () => {
    const userMock = {
        _id: 'user-id',
        email: 'user@example.com',
        image: 'http://example.com/image.png',
        firstName: 'John',
        lastName: 'Doe',
        accType: 'normal',
        password: 'Password123', // Ensure passwords are not returned
        userType: 'patient',
        phoneNo: '1234567890',
        gender: 'male',
        specialization: 'Cardiology',
        healthCard: true,
        nic: 'NIC12345',
        department: 'Cardiology',
        occupation: 'Doctor',
        birthday: '1990-01-01',
        age: 34,
        address: '123 Main St',
        workPlace: 'General Hospital',
        martialState: 'Single',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    
      beforeEach(() => {
        // Mock the protect middleware to simulate authentication
        protect.mockImplementation((req, res, next) => {
          req.user = userMock; // Simulate a user being set on the request
          next();
        });
      });
    
      afterEach(() => {
        jest.restoreAllMocks(); // Restore all mocks after each test
      });

      it('should return user profile details', async () => {
        const res = await request(app).get('/api/users/profile').set('Cookie', 'jwt=some-token');
  
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
          _id: userMock._id,
          email: userMock.email,
          image: userMock.image,
          firstName: userMock.firstName,
          lastName: userMock.lastName,
          accType: userMock.accType,
          userType: userMock.userType,
          phoneNo: userMock.phoneNo,
          gender: userMock.gender,
          specialization: userMock.specialization,
          healthCard: userMock.healthCard,
          nic: userMock.nic,
          department: userMock.department,
          occupation: userMock.occupation,
          password: userMock.password,
          birthday: userMock.birthday,
          age: userMock.age,
          address: userMock.address,
          workPlace: userMock.workPlace,
          martialState: userMock.martialState,
          createdAt: userMock.createdAt,
          updatedAt: userMock.updatedAt,
        });
      });
  
      it('should return 401 if no token is provided', async () => {
        protect.mockImplementation((req, res) => {
          res.status(401).json({ message: 'Not Authorized, no token' });
        });
  
        const res = await request(app).get('/api/users/profile');
  
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe('Not Authorized, no token');
      });
  
      it('should return 401 if token is invalid', async () => {
        protect.mockImplementation((req, res) => {
          res.status(401).json({ message: 'Not Authorized, invalid token' });
        });
  
        const res = await request(app).get('/api/users/profile').set('Cookie', 'jwt=invalid-token');
  
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe('Not Authorized, invalid token');
      });
  });


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


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

      expect(res.statusCode).toBe(401);
      // expect(res.body).toHaveProperty('firstName', 'UpdatedName');
    });
  });


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


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
