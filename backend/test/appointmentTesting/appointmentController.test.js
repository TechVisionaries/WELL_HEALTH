import {
    createAppointment,
    updateAppointmentById,
  } from "../../controllers/appointmentController";
  import Appointment from "../../models/appointmentModel";
  import Doctor from "../../models/doctorModel";
  import { sendMail } from "../../utils/mailer";
  
  jest.mock("../../models/appointmentModel");
  jest.mock("../../models/doctorModel");
  jest.mock("../../utils/mailer");
  
  describe("Appointment Controller", () => {
    let req, res;
  
    beforeEach(() => {
      req = {
        user: { _id: "userId" },
        body: {
          name: "John Doe",
          email: "john.doe@example.com",
          hospital: "General Hospital",
          consultant: "Dr. Smith",
          appointmentDate: "2024-10-14T18:30:00.000Z",
          appointmentTime: "10:00 AM",
          serviceType: "Consultation",
          doctorId: "doctorId",
          date: "2024-10-14",
          time: "10:00 AM",
        },
        params: { id: "appointmentId" },
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it("should send reschedule email in updateAppointmentById", async () => {
      const updatedAppointment = {
        _id: "appointmentId",
        name: "John Doe",
        email: "john.doe@example.com",
        appointmentDate: "2024-10-14",
        appointmentTime: "10:00 AM",
      };
  
      Appointment.findByIdAndUpdate.mockResolvedValue(updatedAppointment);
  
      await updateAppointmentById(req, res);
  
      expect(sendMail).toHaveBeenCalledWith(
        "john.doe@example.com",
        expect.stringContaining("Your appointment has been rescheduled to:"),
        "Appointment Rescheduled"
      );
    });
  
    it("should return 400 if required fields are missing", async () => {
      req.body = {
        name: "John Doe",
        email: "john.doe@example.com",
        hospital: "General Hospital",
        consultant: "Dr. Smith",
        appointmentDate: "2024-10-14T18:30:00.000Z",
        appointmentTime: "10:00 AM",
        serviceType: "Consultation",
        // doctorId is missing
      };
  
      await createAppointment(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Doctor not found" });
    });
  
    it("should return 400 if user not found", async () => {
      req.user = null;
  
      await createAppointment(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
    });
  
    





  });
  