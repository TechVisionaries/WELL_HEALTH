import express from 'express';
import { createShift, getAvailableStaff, getAllShifts } from '../controllers/shiftController.js';

const router = express.Router();

router.post('/', createShift)
router.get('/available-staff', getAvailableStaff)
router.get('/all', getAllShifts)


export default router;
