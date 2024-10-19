import {
  create_health_card,
  getAllUDoctors,
  get_health_card_by_patient_id,
  getAllPatients,
  addPrescription,
  get_prescription_by_patient_id,
  update_health_card,
} from "../../controllers/healthCardController";
import ModelFactory from "../../models/modelFactory";

import HealthCard from "../../models/healthCardModel.js";
import User from "../../models/userModel.js";
import Prescription from "../../models/prescriptionModel.js";
import sendResponse from "../../utils/sendResponse";

jest.mock("../../models/modelFactory");
jest.mock("../../models/healthCardModel");
jest.mock("../../models/userModel");
jest.mock("../../models/prescriptionModel");
jest.mock("../../utils/sendResponse");

describe("HealthCard Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        userId: "userId",
        fullName: "John Doe",
        hospital: "General Hospital",
        contact: "123456789",
        nic: "123456789V",
        emergency: "Jane Doe",
        inssurance: "ABC Insurance",
        bloodGroup: "O+",
        inssuranceId: "INS123",
        diabetes: true,
        bloodPressure: true,
        allergyDrugs: "None",
        diseases: "None",
        eyePressure: false,
        doctorName: "Dr. Smith",
      },
      params: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Create Health Card test
  it("should create a health card and update user status", async () => {
    const createdHealthCard = {
      _id: "healthCardId",
      userId: "userId",
      fullName: "John Doe",
      hospital: "General Hospital",
      contact: "123456789",
      nic: "123456789V",
      emergency: "Jane Doe",
      inssurance: "ABC Insurance",
      bloodGroup: "O+",
      inssuranceId: "INS123",
      diabetes: true,
      bloodPressure: true,
      allergyDrugs: "None",
      diseases: "None",
      eyePressure: false,
      doctorName: "Dr. Smith",
    };
    const updatedUser = { _id: "userId", healthCard: true };

    ModelFactory.create.mockReturnValue({
      save: jest.fn().mockResolvedValue(createdHealthCard),
    });
    User.findByIdAndUpdate.mockResolvedValue(updatedUser);

    await create_health_card(req, res);

    expect(ModelFactory.create).toHaveBeenCalledWith("HealthCard", {
      userId: "userId",
      fullName: "John Doe",
      hospital: "General Hospital",
      contact: "123456789",
      nic: "123456789V",
      emergency: "Jane Doe",
      inssurance: "ABC Insurance",
      bloodGroup: "O+",
      inssuranceId: "INS123",
      diabetes: true,
      bloodPressure: true,
      allergyDrugs: "None",
      diseases: "None",
      eyePressure: false,
      doctorName: "Dr. Smith",
    });
    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
      req.body.userId,
      { healthCard: true },
      { new: true }
    );
    expect(sendResponse).toHaveBeenCalledWith(
      res,
      200,
      true,
      updatedUser,
      "Health card created and user updated"
    );
  });

  it("should return 400 if health card creation fails", async () => {
    ModelFactory.create.mockReturnValue({
      save: jest.fn().mockResolvedValue(null),
    });

    await create_health_card(req, res);

    expect(sendResponse).toHaveBeenCalledWith(
      res,
      400,
      false,
      null,
      "Failed to create health card"
    );
  });

  // Get all doctors test
  it("should return list of doctors", async () => {
    const doctors = [{ _id: "doctorId", name: "Dr. Smith" }];
    User.find.mockResolvedValue(doctors);

    await getAllUDoctors(req, res);

    expect(User.find).toHaveBeenCalledWith({ userType: "doctor" });
    expect(sendResponse).toHaveBeenCalledWith(
      res,
      200,
      true,
      doctors,
      "Doctors list"
    );
  });

  // Get health card by patient ID test
  it("should return health card and last prescription by patient ID", async () => {
    req.params.userId = "userId"; 

    const healthCard = [{ _id: "healthCardId", userId: "userId" }];
    const prescription = { _id: "prescriptionId", doctorId: "doctorId" };

    HealthCard.find.mockResolvedValue(healthCard);

    const findOneMock = {
      sort: jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(prescription),
    };
    Prescription.findOne.mockReturnValue(findOneMock);

    await get_health_card_by_patient_id(req, res);

    expect(HealthCard.find).toHaveBeenCalledWith({ userId: req.params.userId });
    expect(Prescription.findOne).toHaveBeenCalledWith({
      userId: req.params.userId,
    });
    expect(findOneMock.sort).toHaveBeenCalledWith({ createdAt: -1 });
    expect(findOneMock.populate).toHaveBeenCalledWith("doctorId");
    expect(sendResponse).toHaveBeenCalledWith(
      res,
      200,
      true,
      { healthCard, lastPrescription: prescription },
      "Health card retrived successfully !!!"
    );
  });

  it("should return 400 if userId is missing in get_health_card_by_patient_id", async () => {
    req.params.userId = null;

    await get_health_card_by_patient_id(req, res);

    expect(sendResponse).toHaveBeenCalledWith(
      res,
      400,
      false,
      null,
      "No User ID!!!"
    );
  });

  // Add Prescription test
  it("should add a prescription", async () => {
    const newPrescription = {
      userId: "userId",
      doctorId: "doctorId",
      medicines: [{ name: "Medicine1", dosage: "1 tablet" }],
    };

    ModelFactory.create.mockReturnValue({
      save: jest.fn().mockResolvedValue(newPrescription),
    });

    req.body = {
      userId: "userId",
      doctorId: "doctorId",
      medicines: [{ name: "Medicine1", dosage: "1 tablet" }],
    };

    await addPrescription(req, res);

    expect(ModelFactory.create).toHaveBeenCalledWith("Prescription", {
      userId: "userId",
      doctorId: "doctorId",
      medicines: [{ name: "Medicine1", dosage: "1 tablet" }],
    });

    expect(sendResponse).toHaveBeenCalledWith(
      res,
      200,
      true,
      newPrescription,
      "Prescription saved successfully"
    );
  });

  it("should return 400 if prescription data is invalid", async () => {
    req.body = {
      userId: null,
      doctorId: "doctorId",
      medicines: [],
    };

    await addPrescription(req, res);

    expect(sendResponse).toHaveBeenCalledWith(
      res,
      400,
      false,
      null,
      "Invalid prescription data"
    );
  });

  // Update health card test
  it("should update the health card successfully", async () => {
    req.params.userId = "userId"; // Set userId for the request params
    req.params.health_card_id = "healthCardId"; // Set health_card_id for the request params

    const updatedHealthCard = { _id: "healthCardId", fullName: "John Updated" };

    HealthCard.findById.mockResolvedValue(updatedHealthCard);
    HealthCard.findByIdAndUpdate.mockResolvedValue(updatedHealthCard);

    req.body = {
      fullName: "John Updated",
      hospital: "General Hospital",
      contact: "987654321",
      emergency: "Jane Doe",
      diabetes: false,
      bloodPressure: false,
      allergyDrugs: "None",
      eyePressure: true,
    };

    await update_health_card(req, res);

    expect(HealthCard.findById).toHaveBeenCalledWith(req.params.health_card_id);
    expect(HealthCard.findByIdAndUpdate).toHaveBeenCalledWith(
      req.params.health_card_id,
      {
        fullName: req.body.fullName,
        hospital: req.body.hospital,
        contact: req.body.contact,
        emergency: req.body.emergency,
        diabetes: req.body.diabetes,
        bloodPressure: req.body.bloodPressure,
        allergyDrugs: req.body.allergyDrugs,
        eyePressure: req.body.eyePressure,
      },
      { new: true }
    );
    expect(sendResponse).toHaveBeenCalledWith(
      res,
      200,
      true,
      updatedHealthCard,
      "Health card updated successfully"
    );
  });

  it("should return 404 if health card not found", async () => {
    req.params.health_card_id = "healthCardId"; // Set health_card_id for the request params

    HealthCard.findById.mockResolvedValue(null);

    await update_health_card(req, res);

    expect(sendResponse).toHaveBeenCalledWith(
      res,
      404,
      false,
      null,
      "Health card not found for the user"
    );
  });
});
