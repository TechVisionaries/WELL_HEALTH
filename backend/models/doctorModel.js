import mongoose from "mongoose";

const { Schema } = mongoose;

const doctorSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    specialization: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    hospitals: [
      {
        type: Schema.Types.ObjectId,
        ref: "Hospital",
      },
    ],

    consultationFee: {
      type: Number,
      required: true,
    },
    availability: {
      type: String, // Example: "Monday to Friday, 9AM to 5PM"
    },
    status: {
      type: String,
      enum: ["Available", "Unavailable"],
      default: "Available",
    },
  },
  { timestamps: true }
);

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;
