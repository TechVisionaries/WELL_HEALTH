import mongoose from 'mongoose';

const shiftSchema = mongoose.Schema({
    staffMember: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    role: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    shiftSlot: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Shift = mongoose.model('Shift', shiftSchema);

export default Shift