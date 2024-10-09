import express from 'express';
import { protect } from '../middleware/authMiddleware.js'
import { createShift, getAllShifts, getAVailableStaff } from '../controllers/shiftController.js';

const router = express.Router();

router.post('/', createShift)
router.get('/:date', getAllShifts)
router.get('/available/staff/:date', getAVailableStaff)


export default router;
