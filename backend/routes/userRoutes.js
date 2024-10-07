import express from 'express';
import { authUser, googleAuthUser, sendRegisterMail, registerUser, logoutUser, getUserProfile, updateUserProfile, resetPassword, getAllUsers, deleteUser, generateOTP, verifyOTP, generateSMSOTP, verifySMSOTP } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js'
// - **POST /api/users** - Register a user
// - **POST /api/users/auth** - Authenticate a user and get token
// - **POST /api/users/logout** - Logout user and clear cookie
// - **GET /api/users/profile** - Get user profile
// - **PUT /api/users/profile** - Update profile

const router = express.Router();

router.post('/', sendRegisterMail);
router.get('/', registerUser);
router.post('/auth', authUser);
router.post('/googleAuth', googleAuthUser);
router.post('/logout', logoutUser);
router.post('/resetPassword', resetPassword);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/all-users', protect, getAllUsers)
router.delete('/:id', protect, deleteUser);
router.post('/generateOTP', generateOTP);
router.post('/verifyOTP', verifyOTP);
router.post('/sms/generateOTP', generateSMSOTP);
router.post('/sms/verifyOTP', verifySMSOTP);


export default router;
