import {
  create_health_card,
  getAllUDoctors,
  get_health_card_by_patient_id,
  getAllPatients,
  addPrescription,
  get_prescription_by_patient_id,
  update_health_card,
} from "../../controllers/healthCardController";
import HealthCard from "../../models/healthCardModel";
import User from "../../models/userModel";
import Prescription from "../../models/prescriptionModel";
import sendResponse from "../../utils/sendResponse";

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
      params: { userId: "userId", health_card_id: "healthCardId" },
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
    const createdHealthCard = { _id: "healthCardId" };
    const updatedUser = { _id: "userId", healthCard: true };

    HealthCard.create.mockResolvedValue(createdHealthCard);
    User.findByIdAndUpdate.mockResolvedValue(updatedUser);

    await create_health_card(req, res);

    expect(HealthCard.create).toHaveBeenCalledWith(req.body);
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
    HealthCard.create.mockResolvedValue(null);

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
  // it("should return health card and last prescription by patient ID", async () => {
  //   const healthCard = { _id: "healthCardId", userId: "userId" };
  //   const prescription = { _id: "prescriptionId", doctorId: "doctorId" };

  //   // Mock the health card and prescription models
  //   HealthCard.find.mockResolvedValue(healthCard);

  //   // Mock Prescription.findOne to resolve without involving .sort()
  //   Prescription.findOne.mockImplementation(() => ({
  //     populate: jest.fn().mockResolvedValue(prescription),
  //     exec: jest.fn().mockResolvedValue(prescription),
  //   }));

  //   await get_health_card_by_patient_id(req, res);

  //   // Check if HealthCard.find was called
  //   expect(HealthCard.find).toHaveBeenCalledWith({ userId: req.params.userId });

  //   // Check if Prescription.findOne was called correctly
  //   expect(Prescription.findOne).toHaveBeenCalledWith({
  //     userId: req.params.userId,
  //   });

  //   // Validate the response
  //   expect(sendResponse).toHaveBeenCalledWith(
  //     res,
  //     200,
  //     true,
  //     { healthCard, lastPrescription: prescription },
  //     "Health card retrieved successfully !!!"
  //   );
  // });

  // it("should return 400 if userId is missing in get_health_card_by_patient_id", async () => {
  //   req.params.userId = null;

  //   await get_health_card_by_patient_id(req, res);

  //   expect(sendResponse).toHaveBeenCalledWith(
  //     res,
  //     400,
  //     false,
  //     null,
  //     "No User ID!!!"
  //   );
  // });

  // Add Prescription test
  it("should add a prescription", async () => {
    const saveMock = jest.fn().mockResolvedValue({
      _id: "prescriptionId",
      userId: "userId",
    });

    const PrescriptionMock = jest
      .spyOn(Prescription.prototype, "save")
      .mockImplementation(saveMock);

    req.body = {
      userId: "userId",
      doctorId: "doctorId",
      medicines: [{ name: "Medicine1", dosage: "1 tablet" }],
    };

    await addPrescription(req, res);

    expect(Prescription).toHaveBeenCalledWith({
      userId: "userId",
      doctorId: "doctorId",
      medicines: [{ name: "Medicine1", dosage: "1 tablet" }],
    });

    expect(saveMock).toHaveBeenCalled();
    expect(sendResponse).toHaveBeenCalledWith(
      res,
      200,
      true,
      expect.any(Object),
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
    const updatedHealthCard = { _id: "healthCardId", fullName: "John Updated" };

    HealthCard.findById.mockResolvedValue(updatedHealthCard);
    HealthCard.findByIdAndUpdate.mockResolvedValue(updatedHealthCard);

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
