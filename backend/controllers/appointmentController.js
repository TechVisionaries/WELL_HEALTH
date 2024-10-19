import Appointment from "../models/appointmentModel.js";
import Doctor from "../models/doctorModel.js";
import {sendMail} from "../utils/mailer.js";
import Hospital from "../models/hospitalModel.js";

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
    doctorId,
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

  if(!doctorId){
    return res.status(400).json({ message: "Doctor not found" });
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
      doctorId,
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
      payment: true,
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


// find doctors by user id
export const findAppointmentsByDoctor = async (req, res) => {
  const userId = req.user ? req.user._id : null;

  if(!userId){
    return res.status(400).json({ message: "UserId not found" });
  }

  try {
    const doctor = await Doctor.findOne({
      user: userId,
    });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const appointments = await Appointment.find({
      doctorId: doctor._id,
      deletedOn: null,
      payment: true,

    });

    return res.status(200).json(appointments);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching appointments", error: error.message });
      
  }
};

//delete appointment by id
export const deleteAppointmentById = async (req, res) => {

  const appointmentId = req.params.id;

  try {
    const appointment = await Appointment.findOne({
      _id: appointmentId,
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // find hospital 

    const hospital = await Hospital.findOne({
      name: appointment.hospital
    });

    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    appointment.deletedOn = new Date();
    appointment.status = "cancelled";
    await appointment.save();

    // send email notification
    const emailText = `
    <p>Dear ${appointment.name},</p>
    <p>Your appointment has been cancelled.</p>
    <p>Contact us for more information.</p>
    <p>Phone: ${hospital.phone}</p>
    <p>Thank you,</p>
    <p>Your Healthcare Team</p>
  `;
  sendMail(appointment.email, emailText, "Appointment Cancelled");



    return res 
      .status(200)
      .json({ message: "Appointment deleted successfully" });
  }
  catch (error) {
    return res
      .status(500)
      .json({ message: "Error deleting appointment", error: error.message });
  }
}

// update appointment by id

export const updateAppointmentById = async (req, res) => {

const { id } = req.params;
  const { date, time } = req.body;

  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { appointmentDate: date, appointmentTime: time },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).send('Appointment not found');
    }

     // Send email notification
     const emailText = `
     <p>Dear ${updatedAppointment.name},</p>
     <p>Your appointment has been rescheduled to:</p>
     <p>Date: ${date}</p>
     <p>Time: ${time}</p>
     <p>Thank you,</p>
     <p>Your Healthcare Team</p>
   `;
   sendMail(updatedAppointment.email, emailText, "Appointment Rescheduled");

    res.status(200).json(updatedAppointment);
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }

}


