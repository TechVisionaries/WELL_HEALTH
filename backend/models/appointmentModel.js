import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },

    hospital: {
        type: String,
        required: true,
    },

    consultant: {
        type: String,
        required: true,
    },
    appointmentDate: {
        type: String,
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
    payment:{
        type: Boolean,
        default: false,
    },
    deletedOn: {
        type: Date,
        default: null,
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
    },

}, {
    timestamps: { createdAt: 'createdOn', updatedAt: 'modifiedOn' }
});

const Appointment = mongoose.model('Appointment', AppointmentSchema);

export default Appointment;
