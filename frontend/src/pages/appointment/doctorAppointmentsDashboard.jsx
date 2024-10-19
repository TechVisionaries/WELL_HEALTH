import { useEffect, useState } from "react";
import {
  Button,
  InputGroup,
  FormControl,
  Table,
  Modal,
  Badge,
  Card,
} from "react-bootstrap";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import style from "../../styles/doctorAppointmentsDashboard.module.css"; // Assuming you'll add custom CSS here
import Sidebar from "../../components/sideBar";
import axios from "axios";
import { toast } from "react-toastify";

const AppointmentStatus = {
  SCHEDULED: "Scheduled",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const cardHeadingStyle = {
  background: "linear-gradient(135deg, #ea3367df, #ff8eaedf,#ea3367df)",
  borderRadius: "10px",
  color: "white",
  textAlign: "center",
  marginTop: "20px",
  marginBottom: "20px",
  padding: "15px", // Add padding as per your requirement
};

const DoctorAppointmentsDashboard = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false); // New state for cancel confirmation
  const [appointmentToCancel, setAppointmentToCancel] = useState(null); // Store the appointment ID to cancel

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleModify = (appointment) => {
    setCurrentAppointment(appointment);
    setNewDate(appointment.date || "");
    setNewTime(appointment.time || "");
    setShowRescheduleModal(true);
  };

  const getDoctorAppointments = async () => {
    try {
      const response = await axios.get(`${baseUrl}/appointments/doctor`, {
        withCredentials: true,
      });
      setAppointments(response.data);
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };

  const deleteAppointment = async (appointmentId) => {
    try {
      await axios.delete(`${baseUrl}/appointments/${appointmentId}`, {
        withCredentials: true,
      });
      setAppointments((prev) => prev.filter((app) => app.id !== appointmentId));
      toast.success("Appointment cancelled successfully");
      getDoctorAppointments();
    } catch (error) {
      console.error(`Error: ${error}`);
      toast.error("Error cancelling appointment");
    }
  };

  const updateAppointment = async (appointmentId) => {
    try {
      await axios.put(`${baseUrl}/appointments/${appointmentId}`, {
        date: newDate,
        time: newTime,
      });
    } catch (error) {
      console.error(`Error: ${error}`);
      toast.error("Error rescheduling appointment");
    }
  };

  useEffect(() => {
    getDoctorAppointments();
  }, []);

  const handleCancel = (appointmentId) => {
    setAppointmentToCancel(appointmentId); // Set the appointment to be canceled
    setShowCancelModal(true); // Show the cancel confirmation modal
  };

  const confirmCancelAppointment = () => {
    deleteAppointment(appointmentToCancel); // Proceed with the cancellation
    setShowCancelModal(false); // Hide the modal after confirming
  };

  const handleReschedule = async() => {
    if (currentAppointment) {
      try {
        await updateAppointment(currentAppointment._id);
        const updatedAppointments = appointments.map((app) =>
          app._id === currentAppointment._id
            ? { ...app, appointmentDate: newDate, appointmentTime: newTime }
            : app
        );
        setAppointments(updatedAppointments);
        setShowRescheduleModal(false);
        toast.success("Appointment rescheduled successfully");
      } catch (error) {
        console.error(`Error: ${error}`);
        toast.error("Error rescheduling appointment");
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case AppointmentStatus.SCHEDULED:
        return <Badge bg="info">{status}</Badge>;
      case AppointmentStatus.IN_PROGRESS:
        return <Badge bg="warning">{status}</Badge>;
      case AppointmentStatus.COMPLETED:
        return <Badge bg="success">{status}</Badge>;
      case AppointmentStatus.CANCELLED:
        return <Badge bg="danger">{status}</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const isSameDate = (date1, date2) => {
    return new Date(date1).toDateString() === new Date(date2).toDateString();
  };

  const convertHospitalName = (name) => {
    return name.replace(/_/g, " ");
  };

  const parseAppointmentDate = (dateString) => {
    const [day, month, year] = dateString.split("/");
    return new Date(`${year}-${month}-${day}`);
  };

  return (
    <>
      <Sidebar />

      <div className={`container-fluid mt-4 ${style.widerContainer}`}>
        <div style={{ width: "100%" }}>
          <Card className={`mt-3 py-3 text-center`} style={cardHeadingStyle}>
            <h2>Doctor Appointments </h2>
          </Card>
        </div>
        <div className={`row mb-4 ${style.calendar}`}>
          <div className="col-12 col-md-6">
            <h5>Select Date</h5>
            <Calendar onChange={handleDateChange} value={selectedDate} />
          </div>
          <div className="col-12 col-md-6 mt-4 mt-md-0">
            <h5>Search Appointments</h5>
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Search patients or appointments"
                aria-label="Search"
                value={searchTerm}
                onChange={handleSearch}
              />
            </InputGroup>
          </div>
        </div>

        <div className={style.tables}>
          <h5>Appointments for {selectedDate.toDateString()}</h5>
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Time Slot</th>
                  <th>Patient Name</th>
                  <th>Hospital</th>
                  <th>Reason</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments
                  .filter(
                    (appointment) =>
                      isSameDate(
                        parseAppointmentDate(appointment.appointmentDate),
                        selectedDate
                      ) &&
                      appointment.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                  )
                  .map((appointment) => (
                    <tr key={appointment._id}>
                      <td>{appointment.appointmentTime}</td>
                      <td>{appointment.name}</td>
                      <td>{convertHospitalName(appointment.hospital)}</td>
                      <td>{appointment.serviceType}</td>
                      <td
                        style={{
                          display: "flex",
                          justifyContent: "space-evenly",
                        }}
                      >
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleModify(appointment)}
                        >
                          <FaEdit /> Reschedule
                        </Button>
                        {/* <Button
                          variant="outline-danger"
                          size="sm"
                          className="ml-2"
                          onClick={() => handleCancel(appointment._id)}
                        >
                          <FaTrashAlt /> Cancel
                        </Button> */}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </div>
        </div>

        {/* Reschedule Modal */}
        <Modal
          show={showRescheduleModal}
          onHide={() => setShowRescheduleModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Reschedule Appointment</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <InputGroup className="mb-3">
              <FormControl
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
              />
              <FormControl
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
              />
            </InputGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowRescheduleModal(false)}
            >
              Close
            </Button>
            <Button variant="primary" onClick={handleReschedule}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Cancel Confirmation Modal */}
        <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Cancel Appointment</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to cancel this appointment?</Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowCancelModal(false)}
            >
              No
            </Button>
            <Button variant="danger" onClick={confirmCancelAppointment}>
              Yes, Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default DoctorAppointmentsDashboard;
