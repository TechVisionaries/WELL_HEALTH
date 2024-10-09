import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../styles/scheduleAppointment.css";
import { Modal, Button } from "react-bootstrap"; // Importing Modal and Button from react-bootstrap

const ScheduleAppointment = () => {
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
    serviceType: "", 
  });

  const navigate = useNavigate();

  const [showSummary, setShowSummary] = useState(false); // For handling dialog display

  const sectors = ["Government", "Private"];
  const hospitalsBySector = {
    Government: ["National Hospital of Sri Lanka", "Teaching Hospital Karapitiya", "Lady Ridgeway Hospital"],
    Private: ["Asiri Central Hospital", "Nawaloka Hospital", "Durdans Hospital", "Lanka Hospitals"],
  };
  const specializations = ["Cardiology", "Dermatology", "Pediatrics", "Oncology"];
  
  // Service types relevant to Sri Lankan healthcare system
  const serviceTypes = [
    "General Checkup",
    "Surgery",
    "Consultation",
    "Emergency",
  ];

  // Consultants categorized by specialization, specific to Sri Lanka
  const consultantsBySpecialization = {
    Cardiology: ["Dr. Ranjith Perera", "Dr. Saman Abeysekera", "Dr. Anura Fernando"],
    Dermatology: ["Dr. Chathura Senanayake", "Dr. Kumudu Gamage", "Dr. Dilhan Samarasinghe"],
    Pediatrics: ["Dr. Nuwan Jayasooriya", "Dr. Shehan Senevirathne", "Dr. Nirmal Cooray"],
    Oncology: ["Dr. Hasitha Peiris", "Dr. Sudesh Rathnayake", "Dr. Udara Chandradasa"],
  };


  const appointmentTimes = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "02:00 PM",
    "03:00 PM",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  
    // Clear hospital when sector changes
    if (name === "sector") {
      setFormData({ ...formData, hospital: "", [name]: value });
    }
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
      serviceType: formData.serviceType, // Include serviceType in appointment details
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

        {formData.sector && (
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
              {hospitalsBySector[formData.sector]?.map((hospital, index) => (
                <option key={index} value={hospital}>
                  {hospital}
                </option>
              ))}
            </select>
          </div>
)}


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
              {consultantsBySpecialization[formData.specialization]?.map(
                (consultant, index) => (
                  <option key={index} value={consultant}>
                    {consultant}
                  </option>
                )
              )}
            </select>
          </div>
        )}

        {/* Appointment Date */}
        <div className="mb-3">
          <label
            htmlFor="appointmentDate"
            className="form-label"
            style={{ marginRight: "10px" }}
          >
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

        {/* Service Type Dropdown */}
        <div className="mb-3">
          <label htmlFor="serviceType" className="form-label">
            Select Service Type
          </label>
          <select
            className="form-select"
            id="serviceType"
            name="serviceType"
            value={formData.serviceType}
            onChange={handleChange}
            required
          >
            <option value="">Choose a service type...</option>
            {serviceTypes.map((service, index) => (
              <option key={index} value={service}>
                {service}
              </option>
            ))}
          </select>
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
          <div className="appointment-summary p-4">
            <ul className="list-group">
              <li className="list-group-item d-flex justify-content-between align-items-center">
                <strong>Name:</strong> {formData.name}
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                <strong>Email:</strong> {formData.email}
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                <strong>Hospital:</strong> {formData.hospital}
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                <strong>Specialization:</strong> {formData.specialization}
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                <strong>Consultant:</strong> {formData.consultant}
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                <strong>Appointment Date:</strong>{" "}
                {formData.appointmentDate?.toLocaleDateString()}
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                <strong>Appointment Time:</strong> {formData.appointmentTime}
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                <strong>Service Type:</strong> {formData.serviceType}
              </li>
            </ul>
            {formData.comments && (
              <div className="mt-3">
                <strong>Comments:</strong>
                <p>{formData.comments}</p>
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleProceedToPayment}>
            Proceed to Payment
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ScheduleAppointment;
