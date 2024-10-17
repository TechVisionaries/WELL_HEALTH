import express from 'express';
import {
    createAppointment,
    getMyUpcommingAppointments,
    deleteMyAppointment,
    getAllAppointments
    
} from '../controllers/appointmentController.js'; // Adjust the path as necessary

import { protect } from '../middleware/authMiddleware.js'; 


const router = express.Router();

// Define the routes
router.post('/',protect, createAppointment);          // Create a new appointment
router.get('/',protect, getMyUpcommingAppointments);              // Get all appointments
router.delete('/:id',protect, deleteMyAppointment); // Delete an appointment
router.get('/all', getAllAppointments); // Get all appointments


export default router;
