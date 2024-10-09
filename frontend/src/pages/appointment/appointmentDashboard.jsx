import { useState } from "react";
import { Table, Button, Modal, Card, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/appointmentDashboard.css"; // Import custom styles
import ScheduleAppointment from "../../components/appointmnt/scheduleAppointment";

const AppointmentDashboard = () => {
  const upcomingAppointments = [
    {
      id: 1,
      date: "2024-10-15",
      time: "10:00 AM",
      doctor: "Dr. Smith",
      status: "Upcoming",
    },
    {
      id: 2,
      date: "2024-10-20",
      time: "02:00 PM",
      doctor: "Dr. Adams",
      status: "Upcoming",
    },
  ];

  const pastAppointments = [
    {
      id: 1,
      date: "2024-09-10",
      time: "11:00 AM",
      doctor: "Dr. Patel",
      status: "Completed",
    },
    {
      id: 2,
      date: "2024-09-15",
      time: "01:00 PM",
      doctor: "Dr. Lee",
      status: "Completed",
    },
  ];

  return (
    <div className="main-container">
      <h1 className="mt-2">Appointment Dashboard</h1>
      <div className="appointment-dashboard-container">
        <ScheduleAppointment />
        <div className="div-row">
          {/* Upcoming Appointments */}
          <Col md={12} className="mb-5 box">
            <Card>
              <Card.Header as="h3">Upcoming Appointments</Card.Header>
              <Card.Body>
                <Table striped bordered hover className="appointment-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Doctor</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingAppointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td>{appointment.date}</td>
                        <td>{appointment.time}</td>
                        <td>{appointment.doctor}</td>
                        <td>
                          <button
                            style={{
                              padding: "0.25rem 0.5rem",
                              fontSize: "0.8rem",
                              backgroundColor: "#007bff",
                              color: "#fff",
                              border: "none",
                              borderRadius: "0.2rem",
                              cursor: "pointer",
                            }}
                          >
                            Modify
                          </button>
                          <button
                            className="ml-2"
                            style={{
                              padding: "0.25rem 0.5rem",
                              fontSize: "0.8rem",
                              backgroundColor: "#dc3545", // Danger color (Bootstrap)
                              color: "#fff",
                              border: "none",
                              marginLeft: "1em",
                              borderRadius: "0.2rem",
                              cursor: "pointer",
                            }}
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>

          {/* Past Appointments */}
          <Col md={12} className="mb-0 box">
            <Card>
              <Card.Header as="h3">Past Appointments</Card.Header>
              <Card.Body>
                <Table striped bordered hover className="appointment-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Doctor</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pastAppointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td>{appointment.date}</td>
                        <td>{appointment.time}</td>
                        <td>{appointment.doctor}</td>
                        <td>{appointment.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDashboard;
