import { useEffect, useState } from "react";
import { Table, Button, Modal, Card, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import style from "../../styles/appointmentDashboard.module.css"; // Import custom styles
import ScheduleAppointment from "../../components/appointmnt/scheduleAppointment";
import Sidebar from "../../components/sideBar";
import axios from "axios";
import { toast } from "react-toastify";

const cardHeadingStyle = {
  background: "linear-gradient(135deg, #ea3367df, #ff8eaedf,#ea3367df)",
  borderRadius: "10px",
  color: "white",
  textAlign: "center",
  marginTop: "20px",
  marginBottom: "20px",
  padding: "15px",
};

const AppointmentDashboard = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);

  const convertHospitalName = (name) => {
    return name.replace(/_/g, ' ');
  };

  const fetchUpcomingAppointments = async () => {
    try {
      const response = await axios.get(`${baseUrl}/appointments`, { withCredentials: true });
      setUpcomingAppointments(response.data || []);
    } catch (error) {
      console.error(`Error: ${error}`);
      toast.error("Error fetching appointments");
    }
  };

  useEffect(() => {
    fetchUpcomingAppointments();
  }, []);

  const handleCancelAppointment = async (id) => {
    try {
      await axios.delete(`${baseUrl}/appointments/my/${id}`, { withCredentials: true });
      toast.success("Appointment cancelled successfully");
      fetchUpcomingAppointments();  // Refresh the list
    } catch (error) {
      console.error(`Error: ${error}`);
      toast.error("Error cancelling appointment");
    }
    setShowCancelModal(false);
  };

  const openCancelModal = (appointment) => {
    setAppointmentToCancel(appointment);
    setShowCancelModal(true);
  };

  const closeCancelModal = () => {
    setAppointmentToCancel(null);
    setShowCancelModal(false);
  };

  return (
    <>
      <Sidebar />
      <div className={style.mainContainer}>
        <Card className={`mt-3 py-3 text-center`} style={cardHeadingStyle}>
          <h2>Book Your Appointment</h2>
        </Card>

        <div className={style.appointmentDashboardContainer}>
          <ScheduleAppointment />

          <div className={style.divRow}>
            {/* Upcoming Appointments */}
            <Col md={12} className={`mb-5 ${style.box}`}>
              <Card>
                <Card.Header as="h3">Upcoming Appointments</Card.Header>
                <Card.Body>
                  {upcomingAppointments.length === 0 ? (
                    <p>No upcoming appointments.</p>
                  ) : (
                    <Table striped bordered hover className="appointment-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Hospital</th>
                          <th>Time</th>
                          <th>Doctor</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {upcomingAppointments.map((appointment) => (
                          <tr key={appointment._id}>
                            <td>{appointment.appointmentDate}</td>
                            <td>{convertHospitalName(appointment.hospital)}</td>
                            <td>{appointment.appointmentTime}</td>
                            <td>{appointment.consultant}</td>
                            <td>
                              <Button
                                variant="danger"
                                onClick={() => openCancelModal(appointment)}
                              >
                                Cancel
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      <Modal show={showCancelModal} onHide={closeCancelModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Cancellation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to cancel the appointment with {appointmentToCancel?.consultant} on {appointmentToCancel?.appointmentDate}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeCancelModal}>
            Close
          </Button>
          <Button
            variant="danger"
            onClick={() => handleCancelAppointment(appointmentToCancel._id)}
          >
            Cancel Appointment
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AppointmentDashboard;
