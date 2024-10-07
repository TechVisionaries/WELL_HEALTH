import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../styles/scheduleAppointmentPage.css";
import { Modal, Button } from "react-bootstrap"; // Importing Modal and Button from react-bootstrap

const ScheduleAppointmentPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    sector: "",
    hospital: "",
    specialization: "",
    consultant: "",
    appointmentDate: null,
    appointmentTime: "",
    comments: "",
  });

  const navigate = useNavigate();

  const [showSummary, setShowSummary] = useState(false); // For handling dialog display

  const sectors = ["Public", "Private"];
  const hospitals = ["City Hospital", "Greenwood Clinic", "Downtown Medical Center"];
  const specializations = ["Cardiology", "Dermatology", "Pediatrics"];
  
  // Consultants categorized by specialization
  const consultantsBySpecialization = {
    Cardiology: ["Dr. Smith", "Dr. Adams", "Dr. Patel"],
    Dermatology: ["Dr. Lee", "Dr. Walker", "Dr. Taylor"],
    Pediatrics: ["Dr. Brown", "Dr. Johnson", "Dr. Martinez"],
  };

  const appointmentTimes = ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, appointmentDate: date });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSummary(true); // Open summary dialog when form is submitted
  };

  const handleClose = () => setShowSummary(false);
  const handleProceedToPayment = () => {
    const appointmentDetails = {
      name: formData.name,
      email: formData.email,
      hospital: formData.hospital,
      specialization: formData.specialization,
      consultant: formData.consultant,
      appointmentDate: formData.appointmentDate,
      appointmentTime: formData.appointmentTime,
    };
  
    setShowSummary(false);
    navigate("/appointment/payment", { state: { appointmentDetails } });
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Book Doctor Appointment</h2>
      <form onSubmit={handleSubmit} className="appointment-form">
        {/* Patient Name */}
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Patient Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email */}
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Select Sector */}
        <div className="mb-3">
          <label htmlFor="sector" className="form-label">
            Select Sector
          </label>
          <select
            className="form-select"
            id="sector"
            name="sector"
            value={formData.sector}
            onChange={handleChange}
            required
          >
            <option value="">Choose a sector...</option>
            {sectors.map((sector, index) => (
              <option key={index} value={sector}>
                {sector}
              </option>
            ))}
          </select>
        </div>

        {/* Select Hospital */}
        <div className="mb-3">
          <label htmlFor="hospital" className="form-label">
            Select Hospital
          </label>
          <select
            className="form-select"
            id="hospital"
            name="hospital"
            value={formData.hospital}
            onChange={handleChange}
            required
          >
            <option value="">Choose a hospital...</option>
            {hospitals.map((hospital, index) => (
              <option key={index} value={hospital}>
                {hospital}
              </option>
            ))}
          </select>
        </div>

        {/* Select Specialization */}
        <div className="mb-3">
          <label htmlFor="specialization" className="form-label">
            Select Specialization
          </label>
          <select
            className="form-select"
            id="specialization"
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            required
          >
            <option value="">Choose a specialization...</option>
            {specializations.map((spec, index) => (
              <option key={index} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>

        {/* Select Consultant (conditionally displayed based on specialization) */}
        {formData.specialization && (
          <div className="mb-3">
            <label htmlFor="consultant" className="form-label">
              Select Consultant
            </label>
            <select
              className="form-select"
              id="consultant"
              name="consultant"
              value={formData.consultant}
              onChange={handleChange}
              required
            >
              <option value="">Choose a consultant...</option>
              {consultantsBySpecialization[formData.specialization]?.map((consultant, index) => (
                <option key={index} value={consultant}>
                  {consultant}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Appointment Date */}
        <div className="mb-3">
          <label htmlFor="appointmentDate" className="form-label" style={{ marginRight: "10px" }}>
            Appointment Date
          </label>
          <DatePicker
            selected={formData.appointmentDate}
            onChange={handleDateChange}
            className="form-control"
            dateFormat="yyyy/MM/dd"
            required
            placeholderText="Select a date"
          />
        </div>

        {/* Appointment Time */}
        <div className="mb-3">
          <label htmlFor="appointmentTime" className="form-label">
            Select Appointment Time
          </label>
          <select
            className="form-select"
            id="appointmentTime"
            name="appointmentTime"
            value={formData.appointmentTime}
            onChange={handleChange}
            required
          >
            <option value="">Choose a time...</option>
            {appointmentTimes.map((time, index) => (
              <option key={index} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>

        {/* Comments */}
        <div className="mb-3">
          <label htmlFor="comments" className="form-label">
            Comments
          </label>
          <textarea
            className="form-control"
            id="comments"
            name="comments"
            value={formData.comments}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Proceed
        </button>
      </form>

      {/* Appointment Summary Modal */}
      <Modal show={showSummary} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Appointment Summary</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="appointment-summary">
            <p><strong>Patient Name:</strong> {formData.name}</p>
            <p><strong>Email:</strong> {formData.email}</p>
            <p><strong>Sector:</strong> {formData.sector}</p>
            <p><strong>Hospital:</strong> {formData.hospital}</p>
            <p><strong>Specialization:</strong> {formData.specialization}</p>
            <p><strong>Consultant:</strong> {formData.consultant}</p>
            <p><strong>Date:</strong> {formData.appointmentDate ? formData.appointmentDate.toLocaleDateString() : ''}</p>
            <p><strong>Time:</strong> {formData.appointmentTime}</p>
            {formData.comments && (
              <p><strong>Comments:</strong> {formData.comments}</p>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleProceedToPayment}>Proceed to Payment</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ScheduleAppointmentPage;
