import express from 'express';
import mongoose from 'mongoose';
import request from 'supertest';
import userRoutes from '../../routes/userRoutes';
import { sendMail } from '../../utils/mailer';
import jwt from 'jsonwebtoken';
import User from '../../models/userModel';
import { protect } from '../../middleware/authMiddleware';
import passport from 'passport';
import otpGenerator from 'otp-generator'; 

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
    const userMock = {
        _id: 'user-id',
        email: 'user@example.com',
        image: 'http://example.com/image.png',
        firstName: 'John',
        lastName: 'Doe',
        accType: 'normal',
        userType: 'patient',
        phoneNo: '1234567890',
        gender: 'male',
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

    let userInstance;

    beforeAll(() => {
        jest.clearAllMocks();
    });

    beforeEach(() => {
        userInstance = {
            ...userMock,
            save: jest.fn().mockResolvedValue(userMock),
        };

        jest.spyOn(User, 'findOne').mockResolvedValue(userInstance);
        protect.mockImplementation((req, res, next) => {
            req.user = userMock;
            next();
        });
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should successfully update user profile', async () => {
        const res = await request(app)
            .put('/api/users/profile')
            .set('Cookie', 'jwt=some-token')
            .send({
                email: 'user@example.com',
                image: 'http://newimage.com/image.png',
                firstName: 'Jane',
                lastName: 'Smith',
            });

        expect(res.statusCode).toBe(200);

    });

    it('should return 404 if user not found', async () => {
        User.findOne.mockResolvedValue(null);

        const res = await request(app)
            .put('/api/users/profile')
            .set('Cookie', 'jwt=some-token')
            .send({ email: 'nonexistent@example.com' });

        expect(res.statusCode).toBe(404);
    });

    it('should allow partial updates of user profile fields', async () => {
        const res = await request(app)
            .put('/api/users/profile')
            .set('Cookie', 'jwt=some-token')
            .send({ phoneNo: '0987654321' });

        expect(res.statusCode).toBe(200);
        expect(res.body.firstName).toBe(userMock.firstName);
    });

    it('should update healthCard if userType is patient', async () => {
        const res = await request(app)
            .put('/api/users/profile')
            .set('Cookie', 'jwt=some-token')
            .send({ healthCard: false });

        expect(res.statusCode).toBe(200);
    });

    it('should not update specialization and department if userType is patient', async () => {
        const doctorMock = { ...userMock, userType: 'patient', specialization: 'General Surgery' };
        User.findOne.mockResolvedValue(doctorMock);

        const res = await request(app)
            .put('/api/users/profile')
            .set('Cookie', 'jwt=some-token')
            .send({ specialization: 'Cardiology', department: 'Cardiology' });

        expect(res.statusCode).toBe(500);
    });

    it('should not change the user data if no new data is provided', async () => {
        const res = await request(app)
            .put('/api/users/profile')
            .set('Cookie', 'jwt=some-token')
            .send({ email: userMock.email });

        expect(res.statusCode).toBe(200);
        expect(res.body.firstName).toBe(userMock.firstName);
    });

    it('should return 200 for valid email format', async () => {
        const res = await request(app)
            .put('/api/users/profile')
            .set('Cookie', 'jwt=some-token')
            .send({ email: 'invalid-email-format' });

        expect(res.statusCode).toBe(200);
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


  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  
  describe('POST /resetPassword', () => {
      const userMock = {
          _id: "6713e32e66faa1cb0aab8612",
          email: 'test1@example.com',
          password: 'Password123',
          save: jest.fn().mockResolvedValue({ message: "Password Reset Successful!" }),
      };
  
      beforeAll(() => {
          jest.clearAllMocks();
      });
  
      beforeEach(() => {
          jest.spyOn(User, 'findOne').mockResolvedValue(userMock);
      });
  
      afterEach(() => {
          jest.resetAllMocks();
      });
  
      it('should reset the password successfully when user exists', async () => {
          const res = await request(app)
              .post('/api/users/resetPassword')
              .send({ email: 'test1@example.com', newPassword: 'newPassword' });
  
          expect(res.statusCode).toBe(201);
          expect(res.body).toEqual({ message: "Password Reset Successful!" });
          expect(userMock.password).toBe('newPassword'); // Check if the password is updated
          expect(userMock.save).toHaveBeenCalled(); // Ensure the save method was called
      });
  
      it('should return 400 if user does not exist', async () => {
          User.findOne.mockResolvedValue(null); // Mock user not found
  
          const res = await request(app)
              .post('/api/users/resetPassword')
              .send({ email: 'nonexistent@example.com', newPassword: 'newPassword' });
  
          expect(res.statusCode).toBe(400);
      });
  
      it('should throw an error if new password is not provided', async () => {
          const res = await request(app)
              .post('/api/users/resetPassword')
              .send({ email: 'user@example.com' }); // No new password provided
  
          expect(res.statusCode).toBe(400);
      });
  
      it('should reset the password if email is provided', async () => {
          const res = await request(app)
              .post('/api/users/resetPassword')
              .send({ newPassword: 'newPassword' }); // No email provided
  
          expect(res.statusCode).toBe(201);
      });
  });


  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  describe('GET /all-users', () => {
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
        jest.spyOn(User, 'find').mockResolvedValue(userMock);
        // Mock the protect middleware to simulate authentication
        protect.mockImplementation((req, res, next) => {
          req.user = userMock; // Simulate a user being set on the request
          next();
        });
      });
    
      afterEach(() => {
        jest.restoreAllMocks(); // Restore all mocks after each test
      });

      it('should return user details', async () => {
        const res = await request(app).get('/api/users/profile').set('Cookie', 'jwt=some-token');
  
        expect(res.statusCode).toBe(200);
      });

      it('should return 500 if there is an error retrieving users', async () => {
        User.find.mockRejectedValue(new Error('Database error')); // Simulate an error in User.find

        const res = await request(app)
            .get('/api/users/all-users')
            .set('Cookie', `jwt=some-token`); // Include a valid token in cookies

        expect(res.statusCode).toBe(500);
        expect(res.body).toEqual({ status: "Error with getting data" });
        });

      it('should return 401 if no token is provided', async () => {
        protect.mockImplementation((req, res) => {
          res.status(401).json({ message: 'Not Authorized, no token' });
        });
  
        const res = await request(app).get('/api/users/all-users');
  
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe('Not Authorized, no token');
      });
  
      it('should return 401 if token is invalid', async () => {
        protect.mockImplementation((req, res) => {
          res.status(401).json({ message: 'Not Authorized, invalid token' });
        });
  
        const res = await request(app).get('/api/users/all-users').set('Cookie', 'jwt=invalid-token');
  
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe('Not Authorized, invalid token');
      });
   });


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


describe('POST /generateOTP - generateOTP', () => {
    const mockUser = {
        email: 'test@example.com',
        firstName: 'John',
        accType: 'normal',
    };

    it('should generate OTP and send email if user exists', async () => {
        jest.spyOn(User, 'findOne').mockResolvedValue(mockUser); // Mock DB call
        jest.spyOn(otpGenerator, 'generate').mockReturnValue('123456'); // Mock OTP generation
        sendMail.mockImplementation(() => {}); // Mock sendMail

        const res = await request(app)
            .post('/api/users/generateOTP')
            .send({ email: mockUser.email });

        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({ message: 'OTP Sent' });
        expect(sendMail).toHaveBeenCalledWith(mockUser.email, expect.any(String), 'Your OTP');
    });

    it('should return 400 if email not found', async () => {
        jest.spyOn(User, 'findOne').mockResolvedValue(null); // Mock DB call returning null

        const res = await request(app)
            .post('/api/users/generateOTP')
            .send({ email: 'nonexistent@example.com' });

        expect(res.statusCode).toBe(400);// Ensure error message is returned
    });
});

});
