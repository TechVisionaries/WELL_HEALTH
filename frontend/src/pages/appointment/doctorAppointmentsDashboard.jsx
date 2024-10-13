import { useState } from 'react';
import { Button, InputGroup, FormControl, Table, Modal, Badge } from 'react-bootstrap';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import style from '../../styles/doctorAppointmentsDashboard.module.css'; // Assuming you'll add custom CSS here
import Sidebar from '../../components/sideBar';

const AppointmentStatus = {
  SCHEDULED: 'Scheduled',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

const DoctorAppointmentsDashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState([
    { id: 1, date: '2024-10-10', timeSlot: '10:00 AM - 10:30 AM', patientName: 'John Doe', reason: 'General Checkup', status: AppointmentStatus.SCHEDULED },
    { id: 2, date: '2024-10-10', timeSlot: '10:30 AM - 11:00 AM', patientName: 'Jane Smith', reason: 'Consultation', status: AppointmentStatus.IN_PROGRESS },
    { id: 3, date: '2024-10-09', timeSlot: '11:00 AM - 11:30 AM', patientName: 'Bob Johnson', reason: 'Flu Symptoms', status: AppointmentStatus.CANCELLED }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleModify = (appointment) => {
    setCurrentAppointment(appointment);
    setNewDate(appointment.date || '');
    setNewTime(appointment.time || '');
    setShowRescheduleModal(true);
  };

  const handleCancel = (appointmentId) => {
    setAppointments((prev) => prev.filter((app) => app.id !== appointmentId));
  };

  const handleReschedule = () => {
    const updatedAppointments = appointments.map((app) =>
      app.id === currentAppointment.id ? { ...app, date: newDate, time: newTime } : app
    );
    setAppointments(updatedAppointments);
    setShowRescheduleModal(false);
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

  // Function to compare if two dates are the same
  const isSameDate = (date1, date2) => {
    return (
      new Date(date1).toDateString() === new Date(date2).toDateString()
    );
  };

  return (
    <>
      <Sidebar />

    <div className={`container-fluid mt-4 ${style.widerContainer}`}>
      <h1 className="text-center mb-4">Appointment Dashboard</h1>

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
        <div className="table-responsive"> {/* Makes the table scrollable on smaller screens */}
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Time Slot</th>
                <th>Patient Name</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments
                .filter(
                  (appointment) =>
                    isSameDate(appointment.date, selectedDate) &&
                    appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((appointment) => (
                  <tr key={appointment.id}>
                    <td>{appointment.timeSlot}</td>
                    <td>{appointment.patientName}</td>
                    <td>{appointment.reason}</td>
                    <td>{getStatusBadge(appointment.status)}</td>
                    <td style={{display:'flex', justifyContent:"space-evenly"}}>
                      <Button variant="outline-primary" size="sm" onClick={() => handleModify(appointment)} >
                        <FaEdit /> Modify
                      </Button>
                      <Button variant="outline-danger" size="sm" className="ml-2" onClick={() => handleCancel(appointment.id)}>
                        <FaTrashAlt /> Cancel
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </div>
      </div>

      {/* Reschedule Modal */}
      <Modal show={showRescheduleModal} onHide={() => setShowRescheduleModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reschedule Appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3">
            <FormControl type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
            <FormControl type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} />
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRescheduleModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleReschedule}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
    </>
  );
};

export default DoctorAppointmentsDashboard;
