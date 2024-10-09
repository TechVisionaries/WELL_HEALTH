import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    sector: {
        type: String,
        required: true,
    },
    hospital: {
        type: String,
        required: true,
    },
    specialization: {
        type: String,
        required: true,
    },
    consultant: {
        type: String,
        required: true,
    },
    appointmentDate: {
        type: Date,
        required: true,
    },
    appointmentTime: {
        type: String,
        required: true,
    },
    serviceType: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: 'pending',
    },
    deletedOn: {
        type: Date,
        default: null,
    }
}, {
    timestamps: { createdAt: 'createdOn', updatedAt: 'modifiedOn' }
});

const Appointment = mongoose.model('Appointment', AppointmentSchema);

export default Appointment;
