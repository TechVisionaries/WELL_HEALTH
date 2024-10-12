import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import style from '../../styles/scheduleAppointment.module.css'; // Using module CSS
import { Modal, Button } from "react-bootstrap"; 

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

  const [showSummary, setShowSummary] = useState(false); 

  const sectors = ["Government", "Private"];
  const hospitalsBySector = {
    Government: ["National Hospital of Sri Lanka", "Teaching Hospital Karapitiya", "Lady Ridgeway Hospital"],
    Private: ["Asiri Central Hospital", "Nawaloka Hospital", "Durdans Hospital", "Lanka Hospitals"],
  };
  const specializations = ["Cardiology", "Dermatology", "Pediatrics", "Oncology"];
  
  const serviceTypes = [
    "General Checkup",
    "Surgery",
    "Consultation",
    "Emergency",
  ];

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
  
    if (name === "sector") {
      setFormData({ ...formData, hospital: "", [name]: value });
    }
  };
  
  const handleDateChange = (date) => {
    setFormData({ ...formData, appointmentDate: date });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSummary(true); 
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
      serviceType: formData.serviceType, 
    };

    setShowSummary(false);
    navigate("/appointment/payment", { state: { appointmentDetails } });
  };

  return (
    <div className={`container mt-5 ${style.container}`}>
      <h2 className={`text-center ${style.title}`}>Book Doctor Appointment</h2>
      <form onSubmit={handleSubmit} className={style.appointmentForm}>
        {/* Patient Name */}
        <div className={`mb-3 ${style.formGroup}`}>
          <label htmlFor="name" className={`form-label ${style.label}`}>
            Patient Name
          </label>
          <input
            type="text"
            className={`form-control ${style.input}`}
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email */}
        <div className={`mb-3 ${style.formGroup}`}>
          <label htmlFor="email" className={`form-label ${style.label}`}>
            Email address
          </label>
          <input
            type="email"
            className={`form-control ${style.input}`}
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Select Sector */}
        <div className={`mb-3 ${style.formGroup}`}>
          <label htmlFor="sector" className={`form-label ${style.label}`}>
            Select Sector
          </label>
          <select
            className={`form-select ${style.select}`}
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
          <div className={`mb-3 ${style.formGroup}`}>
            <label htmlFor="hospital" className={`form-label ${style.label}`}>
              Select Hospital
            </label>
            <select
              className={`form-select ${style.select}`}
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
        <div className={`mb-3 ${style.formGroup}`}>
          <label htmlFor="specialization" className={`form-label ${style.label}`}>
            Select Specialization
          </label>
          <select
            className={`form-select ${style.select}`}
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

        {/* Select Consultant */}
        {formData.specialization && (
          <div className={`mb-3 ${style.formGroup}`}>
            <label htmlFor="consultant" className={`form-label ${style.label}`}>
              Select Consultant
            </label>
            <select
              className={`form-select ${style.select}`}
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
        <div className={`mb-3 ${style.formGroup}`}>
          <label
            htmlFor="appointmentDate"
            className={`form-label ${style.label}`}
            style={{ marginRight: "10px" }}
          >
            Appointment Date
          </label>
          <DatePicker
            selected={formData.appointmentDate}
            onChange={handleDateChange}
            className={`form-control ${style.input}`}
            dateFormat="yyyy/MM/dd"
            required
            placeholderText="Select a date"
          />
        </div>

        {/* Appointment Time */}
        <div className={`mb-3 ${style.formGroup}`}>
          <label htmlFor="appointmentTime" className={`form-label ${style.label}`}>
            Select Appointment Time
          </label>
          <select
            className={`form-select ${style.select}`}
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
        <div className={`mb-3 ${style.formGroup}`}>
          <label htmlFor="serviceType" className={`form-label ${style.label}`}>
            Select Service Type
          </label>
          <select
            className={`form-select ${style.select}`}
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

        <button type="submit" className={`btn btn-primary ${style.submitButton}`}>
          Proceed
        </button>
      </form>

      {/* Appointment Summary Modal */}
      <Modal show={showSummary} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Appointment Summary</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Name:</strong> {formData.name}</p>
          <p><strong>Email:</strong> {formData.email}</p>
          <p><strong>Sector:</strong> {formData.sector}</p>
          <p><strong>Hospital:</strong> {formData.hospital}</p>
          <p><strong>Specialization:</strong> {formData.specialization}</p>
          <p><strong>Consultant:</strong> {formData.consultant}</p>
          <p><strong>Appointment Date:</strong> {formData.appointmentDate?.toLocaleDateString()}</p>
          <p><strong>Appointment Time:</strong> {formData.appointmentTime}</p>
          <p><strong>Service Type:</strong> {formData.serviceType}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleProceedToPayment}>
            Proceed to Payment
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ScheduleAppointment;
