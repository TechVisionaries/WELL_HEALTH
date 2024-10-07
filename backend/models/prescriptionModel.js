const mongoose = require("mongoose");

const medicinesSchema = new mongoose.Schema({
    name: {
      type: String,
      required: false,
    },
    dosage: {
      type: String,
      required: false,
    },
    frequency:{
      type: String,
      required: false,
    },
    duration:{
      type: String,
      required: false,
    },
    instructions:{
        type: String,
        required: false,
      },
  });

const prescriptionSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
    },
    medicines: [medicinesSchema],

    doctorId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref:'User'
    },

    
    
}, {
    timestamps: true
});

const Prescription = mongoose.model('Prescription', prescriptionSchema);

module.exports = Prescription;