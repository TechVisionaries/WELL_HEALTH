import mongoose from 'mongoose';

const hospitalSchema = mongoose.Schema({
    hospitalID: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    Location: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

const Hospital = mongoose.model('Hospital', hospitalSchema);

export default Hospital;
