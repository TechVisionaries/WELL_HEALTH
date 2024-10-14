import { useEffect, useState } from "react";
import { Table, Button, Modal, Card, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import style from "../../styles/appointmentDashboard.module.css"; // Import custom styles
import ScheduleAppointment from "../../components/appointmnt/scheduleAppointment";
import Sidebar from "../../components/sideBar";
import axios from "axios";

const AppointmentDashboard = () => {

// base url
const baseUrl = import.meta.env.VITE_BASE_URL;


  // const upcomingAppointments = [
  //   {
  //     id: 1,
  //     date: "2024-10-15",
  //     time: "10:00 AM",
  //     doctor: "Dr. Smith",
  //     status: "Upcoming",
  //   },
  //   {
  //     id: 2,
  //     date: "2024-10-20",
  //     time: "02:00 PM",
  //     doctor: "Dr. Adams",
  //     status: "Upcoming",
  //   },
  // ];

  // const pastAppointments = [
  //   {
  //     id: 1,
  //     date: "2024-09-10",
  //     time: "11:00 AM",
  //     doctor: "Dr. Patel",
  //     status: "Completed",
  //   },
  //   {
  //     id: 2,
  //     date: "2024-09-15",
  //     time: "01:00 PM",
  //     doctor: "Dr. Lee",
  //     status: "Completed",
  //   },
  // ];


  const cardHeadingStyle = {
    background: "linear-gradient(135deg, #ea3367df, #ff8eaedf,#ea3367df)",
    borderRadius: "10px",
    color: "white",
    textAlign: "center",
    marginTop: "20px",
    marginBottom: "20px",
    padding: "15px", // Add padding as per your requirement
  };


  const [upcomingAppointments, setUpcomingAppointments] = useState([]);

const fetchUpcomingAppointments = async () => {
  try{
    const response = await axios.get(`${baseUrl}/appointments`,{ withCredentials: true });
    console.log("Response: ", response.data); 
    setUpcomingAppointments(response.data || []);
  }catch(error){
    console.error(`Error: ${error}`);
  }
};




  useEffect(() => {
    // Fetch upcoming appointments from the server
    fetchUpcomingAppointments();
    console.log("Upcoming Appointments: ", upcomingAppointments);
  }, []);

const handleCancelAppointment = async (e,id) => {
  e.preventDefault();
  console.log("Cancel appointment clicked");

  try{
    const response = await axios.delete(`${baseUrl}/appointments/${id}`,{ withCredentials: true });    
    console.log("Response: ", response.data); 
    fetchUpcomingAppointments();
  }catch(error){
    console.error(`Error: ${error}`);
  }
};


  return (
    <>
      <Sidebar />

      <div className={style.mainContainer}>
        <Card className={`mt-3 py-3 text-center`} style={cardHeadingStyle}>
          <h2>Appointment Dashboard</h2>
        </Card>
        <div className={style.appointmentDashboardContainer}>
          <ScheduleAppointment />
          <div className={style.divRow}>
            {/* Upcoming Appointments */}
            <Col md={12} className={`mb-5 ${style.box}`}>
              <Card>
                <Card.Header as="h3">Upcoming Appointments</Card.Header>
                <Card.Body>
                  <Table striped bordered hover className="appointment-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Hostpital</th>
                        <th>Time</th>
                        <th>Doctor</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {upcomingAppointments.map((appointment) => (
                        <tr key={appointment._id}>
                          <td>{appointment.appointmentDate}</td>
                          <td>{appointment.hospital}</td>
                          <td>{appointment.appointmentTime}</td>
                          <td>{appointment.consultant}</td>
                          <td>
                            {/* <button
                              style={{
                                padding: "0.25rem 0.5rem",
                                fontSize: "0.8rem",
                                backgroundColor: "#007bff",
                                color: "#fff",
                                border: "none",
                                borderRadius: "0.2rem",
                                cursor: "pointer",
                                width:"100%"
                              }}
                            >
                              Modify
                            </button> */}
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
                              onClick={(e) => handleCancelAppointment(e, appointment._id)}
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
            {/* <Col md={12} className="mb-0 box">
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
          </Col> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default AppointmentDashboard;
