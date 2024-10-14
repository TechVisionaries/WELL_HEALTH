import * as React from "react";
import {
  Card,
  Box,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
import dayjs from "dayjs"; // For date handling

// Dummy staff data for available staff
const staffData = [
  {
    id: 1,
    name: "John Doe",
    shift: "6.00 am - 3.00 pm",
    location: "Ward A",
    status: "Available",
    date: dayjs("2024-10-15"), // Example date
  },
  {
    id: 2,
    name: "Jane Smith",
    shift: "3.00 pm - 10.00 pm",
    location: "Ward B",
    status: "Available",
    date: dayjs("2024-10-15"), // Example date
  },
  {
    id: 3,
    name: "Emily Johnson",
    shift: "10.00 pm - 6.00 am",
    location: "Ward C",
    status: "Available",
    date: dayjs("2024-10-16"), // Different date
  },
  {
    id: 4,
    name: "Michael Brown",
    shift: "6.00 am - 3.00 pm",
    location: "Ward D",
    status: "Available",
    date: dayjs("2024-10-15"), // Example date
  },
  {
    id: 5,
    name: "Anna White",
    shift: "3.00 pm - 10.00 pm",
    location: "Ward E",
    status: "Available",
    date: dayjs("2024-10-16"), // Different date
  },
];

// Dummy data for vacant staff
const vacantStaffData = [
  {
    id: 1,
    name: "Sara Connor",
    status: "Vacant",
  },
  {
    id: 2,
    name: "Kyle Reese",
    status: "Vacant",
  },
  {
    id: 3,
    name: "Tony Stark",
    status: "Vacant",
  },
];

const ShiftSchedulingPage = () => {
  const [selectedDate, setSelectedDate] = React.useState(dayjs());
  const [schedule, setSchedule] = React.useState(""); // Default to no selection
  const [status, setStatus] = React.useState(""); // New state for status filtering
  const [filteredStaffData, setFilteredStaffData] = React.useState(staffData);

  const handleScheduleChange = (event) => {
    setSchedule(event.target.value);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  // Function to filter staff based on date, schedule, and status
  const filterStaffData = () => {
    let filteredData = staffData;

    // Add filtering based on schedule if selected
    if (schedule) {
      filteredData = filteredData.filter((staff) => {
        // If "All Shifts" is selected, don't filter by shift
        if (schedule === "all") {
          return true; // Show all staff
        }

        switch (schedule) {
          case 10: // Morning Shift
            return staff.shift === "6.00 am - 3.00 pm";
          case 20: // Afternoon Shift
            return staff.shift === "3.00 pm - 10.00 pm";
          case 30: // Night Shift
            return staff.shift === "10.00 pm - 6.00 am";
          default:
            return true; // No filtering if no valid schedule is selected
        }
      });
    }

    // Add filtering based on status if selected
    if (status) {
      filteredData = filteredData.filter((staff) => staff.status === status);
    }

    // Add filtering based on date if selected
    if (selectedDate) {
      filteredData = filteredData.filter((staff) =>
        dayjs(staff.date).isSame(selectedDate, "day")
      );
    }

    setFilteredStaffData(filteredData);
  };

  // Effect to filter staff when any of the filters change
  React.useEffect(() => {
    filterStaffData();
  }, [schedule, status, selectedDate]);

  return (
    <>
      <Sidebar />
      <Box sx={{ p: 2 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Shift Scheduling
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            {/* Form for Assigning Shifts */}
            <Card sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Select Date and Schedule
              </Typography>
              <Row>
                <Col>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Select Date"
                      value={selectedDate}
                      onChange={handleDateChange}
                      renderInput={(params) => (
                        <Box sx={{ mb: 2 }}>{params}</Box>
                      )}
                    />
                  </LocalizationProvider>
                </Col>
                <Col>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel id="schedule-label">Schedules</InputLabel>
                    <Select
                      labelId="schedule-label"
                      id="schedule-select"
                      value={schedule}
                      label="Schedules"
                      onChange={handleScheduleChange}
                    >
                      <MenuItem value="all">All Shifts</MenuItem>
                      <MenuItem value={10}>Morning Shift</MenuItem>
                      <MenuItem value={20}>Afternoon Shift</MenuItem>
                      <MenuItem value={30}>Night Shift</MenuItem>
                    </Select>
                  </FormControl>
                </Col>
              </Row>

              <Row>
                <Col>
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
          </Grid>

          <Grid item xs={12} sm={4}>
            {/* Available Staff */}
            <Card sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6">Available Staff</Typography>
              <TableContainer component={Paper}>
                <Table aria-label="staff table">
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ fontWeight: "bold" }}>ID</TableCell>
                      <TableCell style={{ fontWeight: "bold" }}>Name</TableCell>
                      <TableCell style={{ fontWeight: "bold" }}>Shift</TableCell>
                      <TableCell style={{ fontWeight: "bold" }}>Location</TableCell>
                      <TableCell style={{ fontWeight: "bold" }}>Date</TableCell>
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
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            {/* Vacant Staff */}
            <Card sx={{ p: 3 }}>
              <Typography variant="h6">Vacant Staff</Typography>
              <Paper sx={{ p: 2, mt: 2 }}>
                <TableContainer component={Paper}>
                  <Table aria-label="vacant staff table">
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ fontWeight: "bold" }}>ID</TableCell>
                        <TableCell style={{ fontWeight: "bold" }}>Name</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {vacantStaffData.map((staff) => (
                        <TableRow key={staff.id}>
                          <TableCell>{staff.id}</TableCell>
                          <TableCell>{staff.name}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default ShiftSchedulingPage;
