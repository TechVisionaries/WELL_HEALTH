import request from 'supertest'; 
import User from '../../models/userModel.js';
import { sendMail } from '../../utils/mailer.js';
import userRoutes from './../../routes/userRoutes'
import jwt from 'jsonwebtoken';
import express from 'express';

jest.mock('../../models/userModel.js');
jest.mock('../../utils/mailer.js');
jest.mock('jsonwebtoken');
const app = express(); 
app.use(express.json());
app.use('/api/users', userRoutes);


describe('POST /api/users', () => {

  it('should send registration mail if user does not exist', async () => {
    User.findOne.mockResolvedValue(null);
    jwt.sign.mockReturnValue('fake.token');
    sendMail.mockResolvedValue(true);

    const res = await request(app)
      .post('/api/users')
      .send({
        email: 'newuser@example.com',
        firstName: 'John',
        lastName: 'Doe',
        userType: 'doctor',
        specialization: 'Cardiology',
        department: 'Cardio',
        workPlace: 'Hospital',
        password: 'password123',
      });

    expect(res.status).toBe(201);
    expect(sendMail).toHaveBeenCalled();
    expect(res.body.message).toBe('Email Verification Sent!');
  });

  
});
