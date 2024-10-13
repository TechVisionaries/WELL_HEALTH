import asyncHandler from "express-async-handler";
import sendResponse from "../utils/sendResponse.js";
import HealthCard from "../models/healthCardModel.js";
import User from "../models/userModel.js";
import Prescription from "../models/prescriptionModel.js";

// @desc    Create Health Card
// route    POST /api/health_card/add
// @access  Public
const create_health_card = asyncHandler(async (req, res) => {
  const {
    userId,
    fullName,
    hospital,
    contact,
    nic,
    emergency,
    inssurance,
    bloodGroup,
    inssuranceId,
    diabetes,
    bloodPressure,
    allergyDrugs,
    diseases,
    eyePressure,
    doctorName,
  } = req.body;

  const newHealthCard = {
    userId,
    fullName,
    hospital,
    contact,
    nic,
    emergency,
    inssurance,
    bloodGroup,
    inssuranceId,
    diabetes,
    bloodPressure,
    allergyDrugs,
    diseases,
    eyePressure,
    doctorName,
  };

  if (!newHealthCard) {
    return sendResponse(
      res,
      400,
      false,
      null,
      "New health card data undefined"
    );
  }

  const healthCard = await HealthCard.create(newHealthCard);

  if (!healthCard) {
    return sendResponse(res, 400, false, null, "Failed to create health card");
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { healthCard: true },
    { new: true } // Return the updated user object
  );

  if (!updatedUser) {
    return sendResponse(
      res,
      400,
      false,
      null,
      "Failed to update user with health card status"
    );
  }

  return sendResponse(
    res,
    200,
    true,
    updatedUser,
    "Health card created and user updated"
  );
});

const getAllUDoctors = asyncHandler(async (req, res) => {
  await User.find({ userType: "doctor" })
    .then((users) => {
      sendResponse(res, 200, true, users, "Doctors list");
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send({ status: "Error with getting data" });
    });
});

const get_health_card_by_patient_id = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return sendResponse(res, 400, false, null, "No User ID!!!");
  }

  const health_card = await HealthCard.find({ userId: userId });

  if (health_card) {
    const lastPrescription = await Prescription.findOne({ userId: userId })
      .sort({ createdAt: -1 })
      .populate("doctorId")
      .exec();

    const responseData = {
      healthCard: health_card,
      lastPrescription: lastPrescription || null, // Include the last prescription if it exists
    };

    return sendResponse(
      res,
      200,
      true,
      responseData,
      "Health card retrived successfully !!!"
    );
  } else {
    return sendResponse(res, 401, false, null, "Failed to get health card !!!");
  }
});

const getAllPatients = asyncHandler(async (req, res) => {
  await User.find({ userType: "patient" })
    .then((users) => {
      sendResponse(res, 200, true, users, "Patient list");
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send({ status: "Error with getting data" });
    });
});

const addPrescription = asyncHandler(async (req, res) => {
  const { userId, doctorId, medicines } = req.body; // Expecting the necessary data from the request body

  if (!userId || !medicines || medicines.length === 0) {
    sendResponse(res, 400, false, null, "Invalid prescription data");
  }

  const newPrescription = new Prescription({
    userId,
    medicines,
    doctorId,
  });

  try {
    const savedPrescription = await newPrescription.save();

    if (!savedPrescription) {
      sendResponse(res, 400, false, null, "Failed to save prescription");
    }
    sendResponse(
      res,
      200,
      true,
      savedPrescription,
      "Prescription saved successfully"
    );
  } catch (error) {
    sendResponse(res, 500, false, null, "Internal Server Error");
  }
});

const get_prescription_by_patient_id = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return sendResponse(res, 400, false, null, "No User ID!!!");
  }

  const prescription = await Prescription.find({ userId: userId });

  if (prescription) {
    return sendResponse(
      res,
      200,
      true,
      prescription,
      "Prescription retrived successfully !!!"
    );
  } else {
    return sendResponse(
      res,
      401,
      false,
      null,
      "Failed to get Prescription !!!"
    );
  }
});

const update_health_card = asyncHandler(async (req, res) => {
  const { userId, health_card_id } = req.params;

  const {
    fullName,
    hospital,
    contact,
    emergency,
    diabetes,
    bloodPressure,
    allergyDrugs,
    eyePressure,
  } = req.body;

  const healthCard = await HealthCard.findById(health_card_id);

  if (!healthCard) {
    return sendResponse(
      res,
      404,
      false,
      null,
      "Health card not found for the user"
    );
  }

  const updatedHealthCard = await HealthCard.findByIdAndUpdate(
    health_card_id,
    {
      fullName,
      hospital,
      contact,
      emergency,
      diabetes,
      bloodPressure,
      allergyDrugs,
      eyePressure,
    },
    { new: true }
  );

  if (!updatedHealthCard) {
    return sendResponse(res, 400, false, null, "Failed to update health card");
  }

  return sendResponse(
    res,
    200,
    true,
    updatedHealthCard,
    "Health card updated successfully"
  );
});

export {
  create_health_card,
  getAllUDoctors,
  get_health_card_by_patient_id,
  getAllPatients,
  addPrescription,
  get_prescription_by_patient_id,
  update_health_card,
};
