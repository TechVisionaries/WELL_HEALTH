import express from 'express';
import {
    createAppointment,
    getAllAppointments,
    getAppointmentById,
    deleteAppointmentById,
} from '../controllers/appointmentController.js';

const router = express.Router();

router.post('/create', createAppointment);
router.get('/all', getAllAppointments);
router.get('/:id', getAppointmentById);
router.delete('/:id', deleteAppointmentById);

export default router;
