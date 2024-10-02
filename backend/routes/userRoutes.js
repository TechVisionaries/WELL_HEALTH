import express from 'express';
import { authUser, googleAuthUser, sendRegisterMail, registerUser, logoutUser, getUserProfile, createHealthCard, resetPassword } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js'
// - **POST /api/users** - Register a user
// - **POST /api/users/auth** - Authenticate a user and get token
// - **POST /api/users/logout** - Logout user and clear cookie
// - **GET /api/users/profile** - Get user profile
// - **PUT /api/users/profile** - Update profile

const router = express.Router();

router.get('/', registerUser);
router.post('/auth', authUser);
router.post('/googleAuth', googleAuthUser);
router.post('/logout', logoutUser);
router.post('/resetPassword', resetPassword);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, createHealthCard);

export default router;
