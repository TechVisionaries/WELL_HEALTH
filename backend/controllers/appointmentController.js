import Appointment from '../models/appointmentModel.js';

export const createAppointment = async (req, res) => {
    try {
        const newAppointment = new Appointment(req.body);
        const savedAppointment = await newAppointment.save();
        res.status(201).json(savedAppointment);
    } catch (err) {
        res.status(500).json({ message: 'Failed to create appointment', error: err });
    }
};

export const getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find();
        res.status(200).json(appointments);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch appointments', error: err });
    }
};

export const getAppointmentById = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        res.status(200).json(appointment);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch appointment', error: err });
    }
};

export const deleteAppointmentById = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        appointment.deletedOn = new Date();
        await appointment.save();
        res.status(200).json({ message: 'Appointment soft-deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete appointment', error: err });
    }
};
