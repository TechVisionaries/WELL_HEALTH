import mongoose from "mongoose";

const { Schema } = mongoose;

const nurseSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    alocatedWard: {
      type: String,
      required: true,
    },
    hospital: {
      type: Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
    },

    shift: {
      type: String, // Example: "Day", "Night", or "Rotating"
      required: true,
    },
    availability: {
      type: String, // Example: "Monday to Friday, 9AM to 5PM"
    },
  },
  { timestamps: true }
);

const Nurse = mongoose.model("Nurse", nurseSchema);

export default Nurse;
