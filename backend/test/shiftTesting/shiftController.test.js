import { createLeave, createShift } from "../../controllers/shiftController";
import Shift from "../../models/shiftModel";

jest.mock("../../models/shiftModel");

describe("Assigning Shift", () => {
  let req, res;

  beforeEach(() => {
      req = {
          body: {
              staff: ["staffId1", "staffId2"],
              date: "2024-10-30",
              location: "WARD A",
              shift: "6.00 am - 3.00 pm",
          },
      };
      res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
      };
  });

  afterEach(() => {
      jest.clearAllMocks();
  });

  it("should create a new shift and return the created shift list", async () => {
      const mockShift = {
        _id: "shiftId1",
        staffMember: "staffId1",
        location: "WARD A",
        date: "2024-10-29",
        shiftSlot: "3.00 pm - 10.00 pm",
        status: "Assigned",
    };

      // Mocking Shift.create
      Shift.create.mockResolvedValue(mockShift);
      Shift.findOne.mockResolvedValue(null); // No existing shift

      await createShift(req, res);

      expect(Shift.findOne).toHaveBeenCalledTimes(2); // For each staff member
      expect(Shift.create).toHaveBeenCalledTimes(2); // For each staff member
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ shiftList: [mockShift, mockShift] });
  });

  it("should return 400 if the shift date is in the past", async () => {
      req.body.date = "2023-09-14"; // Invalid past date

      await createShift(req, res);
    
      expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 400 if a shift already exists for a staff member on the same date and slot", async () => {
      const existingShift = {
          _id: "existingShiftId",
          staffMember: "staffId1",
          date: "2024-10-14",
          shiftSlot: "6.00 am - 3.00 pm",
      };

      Shift.findOne.mockResolvedValue(existingShift); // Mocking existing shift for the first staff

      await createShift(req, res);

      expect(Shift.findOne).toHaveBeenCalledWith({ staffMember: "staffId1", date: req.body.date, shiftSlot: req.body.shift });
      expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 400 if there was an error creating shifts", async () => {
    // Mock Shift.findOne to return no existing shift (to avoid conflict error)
    Shift.findOne.mockResolvedValue(null);

    // Remove staff  to simulate an error
    req.body.staff = "";
    await createShift(req, res);

    // Verify that a 400 status and the appropriate JSON error response is returned
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Error creating shift" });
  });
})

describe("Applying Leave", () => {
  let req, res;

  beforeEach(() => {
      req = {
          body: {
              staff: ["staffId1", "staffId2"],
              date: "2024-10-30",
              location: "WARD A",
              shift: "6.00 am - 3.00 pm",
          },
      };
      res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
      };
  });

  afterEach(() => {
      jest.clearAllMocks();
  });

  it("should create a new leave successfully", async () => {
    // Mock Shift.findOne to return no existing shift
    Shift.findOne.mockResolvedValue(null);

    // Mock Shift.create to return a new shift
    Shift.create.mockResolvedValue({
        _id: "shiftId",
        staffMember: "staff1",
        date: "2024-10-20",
        shiftSlot: "6.00 am - 3.00 pm",
        status: "Leave Pending"
    });

    await createLeave(req, res);

    // Expect status 201 for successful leave creation
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
        shift: expect.objectContaining({
            staffMember: "staff1",
            date: "2024-10-20",
            shiftSlot: "6.00 am - 3.00 pm",
            status: "Leave Pending"
        })
    });
  });

  it("should return 400 if the leave date is in the past", async () => {
      // Simulate a past date
      req.body.date = "2020-10-20T18:30:00.000Z";

      await createLeave(req, res);

      // Expect status 400 for invalid date
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid Date!" });
  });

  it("should return 400 if a shift already exists", async () => {
      // Mock Shift.findOne to return an existing shift
      Shift.findOne.mockResolvedValue({
          _id: "existingShiftId",
          staffMember: "staff1",
          date: "2024-10-20",
          shiftSlot: "6.00 am - 3.00 pm"
      });

      await createLeave(req, res);

      // Expect status 400 for existing shift
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
          message: "You already have a shift assigned. Please contact your supervisor!"
      });
  });

  it("should return 400 if there was an error applying for leave", async () => {
      // Mock Shift.findOne to return no existing shift
      Shift.findOne.mockResolvedValue(null);

      // Remove staff to simulate an error
      Shift.create.mockResolvedValue(null);

      await createLeave(req, res);

      // Expect status 400 for error during leave creation
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Error applying leave" });
  });
});
