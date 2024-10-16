import mongoose from "mongoose";

const healthCardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    fullName: {
      type: String,
      required: true,
    },
    hospital: {
      type: String,
      required: false,
    },
    contact: {
      type: String,
      required: false,
    },
    nic: {
      type: String,
      required: false,
    },
    emergency: {
      type: String,
      required: false,
    },
    inssurance: {
      type: String,
      required: false,
    },
    bloodGroup: {
      type: String,
      required: false,
    },
    inssuranceId: {
      type: String,
      required: false,
    },
    diabetes: {
      type: Boolean,
      required: false,
    },
    bloodPressure: {
      type: Boolean,
      required: false,
    },
    allergyDrugs: {
      type: String,
      required: false,
    },
    diseases: {
      type: String,
      required: false,
    },
    eyePressure: {
      type: Boolean,
      required: false,
    },
    doctorName: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const HealthCard = mongoose.model("HealthCard", healthCardSchema);

export default HealthCard;
