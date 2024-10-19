import express from 'express';
import { createShift, getAvailableStaff, getAllShifts, deleteShift, getStaffShifts, createLeave, updateLeave } from '../controllers/shiftController.js';

const router = express.Router();

router.post('/', createShift)
router.post('/leave', createLeave)
router.put('/leave', updateLeave)
router.delete('/', deleteShift)
router.get('/available-staff', getAvailableStaff)
router.get('/my', getStaffShifts)
router.get('/all', getAllShifts)


export default router;
