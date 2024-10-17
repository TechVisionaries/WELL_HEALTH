import Appointment from "../models/appointmentModel.js";

// Create a new appointment
export const createAppointment = async (req, res) => {
  const userId = req.user ? req.user._id : null;

  if (!userId) {
    return res.status(400).json({ message: "User not found" });
  }

  const {
    name,
    email,
    hospital,
    consultant,
    appointmentDate,
    appointmentTime,
    serviceType,
  } = req.body;
  // console.log(req.body);

  if (
    !name ||
    !email ||
    !hospital ||
    !consultant ||
    !appointmentDate ||
    !appointmentTime ||
    !serviceType
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  //   convert 2024-10-14T18:30:00.000Z format to DD-MM-YYYY format
  const newAppointmentDate = new Date(appointmentDate).toLocaleDateString(
    "en-GB"
  );

  try {
    const appointment = new Appointment({
      user: userId,
      name,
      email,
      hospital,
      consultant,
      appointmentDate: newAppointmentDate,
      appointmentTime,
      serviceType,
    });

    await appointment.save();
    return res
      .status(201)
      .json({ message: "Appointment created successfully", appointment });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error creating appointment", error: error.message });
  }
};

// Get all appointments base on userId,status and deletedOn
export const getMyUpcommingAppointments = async (req, res) => {
  const userId = req.user ? req.user._id : null;

  try {
    const appointments = await Appointment.find({
      user: userId,
      status: "pending",
      deletedOn: null,
    });

    return res.status(200).json(appointments);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching appointments", error: error.message });
  }
};

// delete appointment
export const deleteMyAppointment = async (req, res) => {
  const appointmentId = req.params.id;
  const userId = req.user ? req.user._id : null;

  try {
    const appointment = await Appointment.findOne({
      _id: appointmentId,
      user: userId,
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointment.deletedOn = new Date();
    appointment.status = "cancelled";
    await appointment.save();

    return res
      .status(200)
      .json({ message: "Appointment deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error deleting appointment", error: error.message });
  }
};

// get all appointments
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({});

    return res.status(200).json(appointments);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching appointments", error: error.message });
  }
};
