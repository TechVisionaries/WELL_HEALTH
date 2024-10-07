import express from 'express';
import {
    authUser,
    googleAuthUser,
    sendRegisterMail,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    resetPassword,
    getAllUsers,
    deleteUser,
    generateOTP,
    verifyOTP,
    generateSMSOTP,
    verifySMSOTP
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Register a user and send a registration email
router.post('/', sendRegisterMail);
router.post('/register', registerUser); // Changed to POST for registration

// Authentication routes
router.post('/auth', authUser);
router.post('/googleAuth', googleAuthUser);

// Logout
router.post('/logout', logoutUser);

// Password reset
router.post('/resetPassword', resetPassword);

// User profile
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

// OTP routes
router.post('/generateOTP', generateOTP);
router.post('/verifyOTP', verifyOTP);
router.post('/sms/generateOTP', generateSMSOTP);
router.post('/sms/verifyOTP', verifySMSOTP);

// Admin routes
router.get('/all-users', protect, getAllUsers);
router.delete('/:id', protect, deleteUser);

export default router;
