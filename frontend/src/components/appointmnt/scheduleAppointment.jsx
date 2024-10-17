import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import style from '../../styles/scheduleAppointment.module.css'; // Using module CSS
import { Modal, Button } from "react-bootstrap"; 
import axios from "axios";

const ScheduleAppointment = () => {

  const baseUrl = import.meta.env.VITE_BASE_URL;

  const [hospitals, setHospitals] = useState([]);
  const [choosenHospital, setChoosenHospital] = useState("");

  const [doctors, setDoctors] = useState([]);
  const [choosenDoctor, setChoosenDoctor] = useState("");
  const [doctorId, setDoctorId] = useState("");


  const [serviceCharge, setServiceCharge] = useState(0);
  const [consultationFee, setConsultationFee] = useState(0);
  const totalCharges = serviceCharge + consultationFee;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    sector: "",
    hospital: "",
    consultant: "",
    appointmentDate: null,
    appointmentTime: "",
    serviceType: "", 
  });

  const getHospitalsBySector = async(sector) => {
    sector = sector.toLowerCase();
    try {
      const response = await axios.get(`${baseUrl}/hospitals/${sector}`);
      setHospitals(response.data);
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };

  const getDoctorsByHospital = async(hospitalName) => {
    try {
      const response = await axios.get(`${baseUrl}/hospitals/doctors/name?hospitalName=${hospitalName}`);
      setDoctors(response.data);
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };

  const convertHospitalName = (name) => {
    return name.replace(/_/g, ' ');
  };

  const navigate = useNavigate();
  const [showSummary, setShowSummary] = useState(false); 

  const sectors = ["Government", "Private"];
  const serviceTypes = [
    "General Checkup",
    "Surgery",
    "Consultation",
    "Emergency",
  ];

  const appointmentTimes = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "02:00 PM",
    "03:00 PM",
  ];

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "sector") {
      setFormData({ ...formData, hospital: "", consultant: "", [name]: value });
      getHospitalsBySector(value);
    }

    if (name === "hospital") {
      setFormData({ ...formData, consultant: "", [name]: value });
      setChoosenHospital(value);
      const selectedHospital = hospitals.find(hospital => hospital.name === value);
      if (selectedHospital) {
        setServiceCharge(selectedHospital.serviceCharge);
        getDoctorsByHospital(selectedHospital.name);
      }
    }

    if (name === "consultant") {
      setFormData({ ...formData, [name]: value });
      const selectedDoctor = doctors.find(doctor => doctor.name === value);
      if (selectedDoctor) {
        setConsultationFee(selectedDoctor.consultationFee);
        setDoctorId(selectedDoctor._id);
      }
    }
  };

  useEffect(() => {
    console.log("Chosen Hospital:", choosenHospital);
  }, [choosenHospital]);

  useEffect(() => {
    console.log("Chosen Doctor:", choosenDoctor);
  }, [choosenDoctor]);

  const handleDateChange = (date) => {
    setFormData({ ...formData, appointmentDate: date });
  };

  const [isLoading, setIsLoading] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(null);

  const handlePayment = async () => {
    setIsLoading(true);
    setPaymentError(null);
    setPaymentSuccess(null);

    try {
      const { data } = await axios.post(`${baseUrl}/payment/create-checkout-session`, {
        serviceCharge,
        consultationFee,
        totalCharges,
      });

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No URL returned for Checkout session');
      }
    } catch (error) {
      console.error('Error creating Checkout session:', error);
      setPaymentError('Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const dataSubmit = async () => {
    try {

      const formWithDoctorId = {
        ...formData,
        doctorId, 
      };

      const response = await axios.post(`${baseUrl}/appointments`,formWithDoctorId, { withCredentials: true });
      console.log(response.data);

      setFormData({
        name: "",
        email: "",
        sector: "",
        hospital: "",
        consultant: "",
        appointmentDate: null,
        appointmentTime: "",
        serviceType: "",
      });
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSummary(true);
  };

  const handleClose = () => setShowSummary(false);
  const handleProceedToPayment = () => {
    dataSubmit();
    handlePayment();
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
              {hospitals.map((hospital, index) => (
                <option key={index} value={hospital.name}>
                  {convertHospitalName(hospital.name)}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Select Consultant */}
        {formData.hospital && (
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
              {doctors.map((doctor, index) => (
                <option key={index} value={doctor.name}>
                  {doctor.name}
                </option>
              ))}
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
            minDate={new Date()}
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
          Schedule
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
          <p><strong>Consultant:</strong> {formData.consultant}</p>
          <p><strong>Appointment Date:</strong> {formData.appointmentDate?.toLocaleDateString()}</p>
          <p><strong>Appointment Time:</strong> {formData.appointmentTime}</p>
          <p><strong>Service Type:</strong> {formData.serviceType}</p>
          <p><strong>Total Charges:</strong> ${totalCharges}</p>
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