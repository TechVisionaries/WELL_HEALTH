import mongoose from "mongoose";

const { Schema } = mongoose;

const hospitalSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  doctors: [
    {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
    },
  ],
  nurses: [
    {
      type: Schema.Types.ObjectId,
      ref: "Nurse",
    },
  ],

  sector: {
    type: String,
    enum: ["Government", "Private"],
    required: true,
  },
  serviceCharge: {
    type: Number,
    required: true,
  },
  operatingHours: {
    open: {
      type: String, // Example: '08:00 AM'
    },
    close: {
      type: String, // Example: '08:00 PM'
    },
  },
  phone: {
    type: String,
    required: true,
  },
});

const Hospital = mongoose.model("Hospital", hospitalSchema);

export default Hospital;
