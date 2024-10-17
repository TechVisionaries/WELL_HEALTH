import * as React from "react";
import {
  Card,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import Sidebar from "../../components/sideBar";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Col, Row } from "react-bootstrap";
import { Badge } from "react-bootstrap";
import dayjs from "dayjs";

const cardHeadingStyle = {
  background: "linear-gradient(135deg, #ea3367df, #ff8eaedf,#ea3367df)",
  borderRadius: "10px",
  color: "white",
  textAlign: "center",
  marginTop: "20px",
  marginBottom: "20px",
  padding: "15px", // Add padding as per your requirement
};


// Function to return badge based on status
const getStatusBadge = (status) => {
  switch (status) {
    case "Available":
      return <Badge bg="success">{status}</Badge>;
    case "Unavailable":
      return <Badge bg="danger">{status}</Badge>;
    case "On Leave":
      return <Badge bg="warning">{status}</Badge>;
    default:
      return <Badge bg="secondary">{status}</Badge>;
  }
};

// Dummy staff data with date field
const staffData = [
  {
    id: 1,
    name: "John Doe",
    shift: "6.00 am - 3 pm",
    location: "Ward A",
    status: "Available",
    date: dayjs("2024-10-15"),
  },
  {
    id: 2,
    name: "Jane Smith",
    shift: "3.00 pm - 10.00 pm",
    location: "Ward B",
    status: "Unavailable",
    date: dayjs("2024-10-15"),
  },
  {
    id: 3,
    name: "Emily Johnson",
    shift: "10.00 pm - 6.00 am",
    location: "Ward C",
    status: "Available",
    date: dayjs("2024-10-16"),
  },
  {
    id: 4,
    name: "Michael Brown",
    shift: "6.00 am - 3 pm",
    location: "Ward D",
    status: "On Leave",
    date: dayjs("2024-10-15"),
  },
  {
    id: 5,
    name: "Anna White",
    shift: "3.00 pm - 10.00 pm",
    location: "Ward E",
    status: "Available",
    date: dayjs("2024-10-16"),
  },
];

const StaffPage = () => {
  const [date, setDate] = React.useState(null);
  const [schedule, setSchedule] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [filteredStaffData, setFilteredStaffData] = React.useState(staffData);

  const handleScheduleChange = (event) => {
    setSchedule(event.target.value);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  const filterStaffData = () => {
    let filteredData = staffData;

    if (schedule) {
      filteredData = filteredData.filter((staff) => {
        switch (schedule) {
          case 10:
            return staff.shift === "6.00 am - 3 pm";
          case 20:
            return staff.shift === "3.00 pm - 10.00 pm";
          case 30:
            return staff.shift === "10.00 pm - 6.00 am";
          default:
            return true;
        }
      });
    }

    if (status) {
      filteredData = filteredData.filter((staff) => staff.status === status);
    }

    if (date) {
      filteredData = filteredData.filter((staff) => dayjs(staff.date).isSame(date, 'day'));
    }

    setFilteredStaffData(filteredData);
  };

  React.useEffect(() => {
    filterStaffData();
  }, [schedule, status, date]);

  return (
    <>
      <Sidebar />
      <div style={{display:"block", width:"80%",margin:"0px auto"}}>
      <div>
      <Card className={`mt-5 py-3 text-center`} style={cardHeadingStyle}>
          <h2>Staff Manage Dashboard</h2>
        </Card>
      </div>

        <Box sx={{ mr: { xs: 0, md: 2 } }}>
          <Card sx={{ p: 3, mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Select Date and Schedule
            </Typography>
            <Row>
              <Col xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    sx={{width:"100%"}}
                    label="Select Date"
                    value={date}
                    onChange={handleDateChange}
                    renderInput={(params) => (
                      <Box sx={{ mb: 2 }}>
                        <params.TextField fullWidth />
                      </Box>
                    )}
                    />
                </LocalizationProvider>
              </Col>
              <Col xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel id="schedule-label">Schedules</InputLabel>
                  <Select
                    labelId="schedule-label"
                    id="schedule-select"
                    value={schedule}
                    label="Schedules"
                    onChange={handleScheduleChange}
                  >
                    <MenuItem value={10}>Morning Shift</MenuItem>
                    <MenuItem value={20}>Afternoon Shift</MenuItem>
                    <MenuItem value={30}>Night Shift</MenuItem>
                  </Select>
                </FormControl>
              </Col>
            </Row>

            <Row>
              <Col xs={12}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    labelId="status-label"
                    id="status-select"
                    value={status}
                    label="Status"
                    onChange={handleStatusChange}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="Available">Available</MenuItem>
                    <MenuItem value="Unavailable">Unavailable</MenuItem>
                    <MenuItem value="On Leave">On Leave</MenuItem>
                  </Select>
                </FormControl>
              </Col>
            </Row>
          </Card>

          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Available Staff
            </Typography>
            <TableContainer component={Paper}>
              <Table aria-label="staff table">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontWeight: "bold" }}>ID</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>Name</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>Shift</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>Location</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>Date</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredStaffData.map((staff) => (
                    <TableRow key={staff.id}>
                      <TableCell>{staff.id}</TableCell>
                      <TableCell>{staff.name}</TableCell>
                      <TableCell>{staff.shift}</TableCell>
                      <TableCell>{staff.location}</TableCell>
                      <TableCell>{staff.date.format("YYYY-MM-DD")}</TableCell>
                      <TableCell>{getStatusBadge(staff.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Box>

       
        </div>

    </>
  );
};

export default StaffPage;
