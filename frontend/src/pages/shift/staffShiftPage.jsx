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
  Checkbox,
  Button,
} from "@mui/material";
import Sidebar from "../../components/sideBar";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Badge, Col, Row } from "react-bootstrap";
import dayjs from "dayjs";
import { Locations, Shifts, Statuses } from "./data";
import { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { AssignmentInd, GroupRemove } from "@mui/icons-material";
import { useRef } from "react";
import { useAssignStaffMutation, useGetAvailableStaffMutation, useGetShiftsMutation, useRemoveStaffMutation } from "../../slices/shiftsApiSlice";

const cardHeadingStyle = {
  background: "linear-gradient(135deg, #ea3367df, #ff8eaedf,#ea3367df)",
  borderRadius: "10px",
  color: "white",
  textAlign: "center",
  marginTop: "20px",
  marginBottom: "20px",
  padding: "15px",
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

const StaffShiftPage = () => {
  const [shift, setShift] = useState({date: null, shift: "", status: "", location: ""});
  const [availableStaffData, setAvailableStaffData] = useState([]);
  const [filteredAvailableStaffData, setFilteredAvailableStaffData] = useState([]);
  const [assignedStaffData, setAssignedStaffData] = useState([]);
  const [filteredAssignedStaffData, setFilteredAssignedStaffData] = useState([]);
  const [availableChecked, setAvilableChecked] = useState([]);
  const [assignChecked, setAssignChecked] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const locationRef = useRef(null);
  const dateRef = useRef(null);
  const shiftRef = useRef(null);

  const [getAvailableStaff] = useGetAvailableStaffMutation();
  const [getShifts] = useGetShiftsMutation();
  const [assign] = useAssignStaffMutation();
  const [remove] = useRemoveStaffMutation();

  const fetchAvailableStaff = async () => {
    setIsLoading(true);    
    try {
      const res = await getAvailableStaff({date: shift.date?.format("YYYY-MM-DD") || '', shift: shift.shift}).unwrap();
      
      setAvailableStaffData(res)
      setFilteredAvailableStaffData(res)
    } catch (error) {
      toast.error(error.data?.message || error.message);
      setAvailableStaffData([])
      setFilteredAvailableStaffData([])
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAssignedStaff = async () => {
    setIsLoading(true);
    try {
      const res = await getShifts({date: shift.date?.format("YYYY-MM-DD") || '', shift: shift.shift, location: shift.location || ''}).unwrap();

      setAssignedStaffData(res)
      setFilteredAssignedStaffData(res)
    } catch (error) {
      toast.error(error.data?.message || error.message);
      setAssignedStaffData([])
      setFilteredAssignedStaffData([])
    } finally {
      setIsLoading(false);
    }
  };

  const assignStaff = async () => {
    setIsLoading(true);
    try {
      if(!shift.location){
        if(locationRef.current){
          locationRef.current.click();
        }
        throw new Error("Please select a location to assign staff");
      }
      if(!shift.date){
        if(dateRef.current){
          dateRef.current.click();
        }
        throw new Error("Please select a date to assign staff");
      }
      if(!shift.shift){
        if(shiftRef.current){
          shiftRef.current.click();
        }
        throw new Error("Please select a shift to assign staff");
      }

      const res = await assign({ staff: availableChecked, date: shift.date?.format("YYYY-MM-DD"), shift: shift.shift, location: shift.location}).unwrap();
      toast.success('Staff Assigned Successfully');

      await fetchAssignedStaff();
      await fetchAvailableStaff();
    } catch (error) {
      toast.error(error.data?.message || error.message);
    } finally {
      setIsLoading(false);
      setAvilableChecked([])
    }
  }; 

  const removeStaff = async () => {
    setIsLoading(true);
    try {
      const res = await remove({ shift: assignChecked}).unwrap();
      toast.success('Staff Unassigned Successfully');


      await fetchAssignedStaff();
      await fetchAvailableStaff();
    } catch (error) {
      toast.error(error.data?.message || error.message);
    } finally {
      setIsLoading(false);
      setAssignChecked([])
    }
  }; 

  const handleAvailableToggle = (value, status) => {
    if(status == "Unavailable" || status == "On Leave"){
      return;
    }
    const currentIndex = availableChecked.indexOf(value);
    const newChecked = [...availableChecked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setAvilableChecked(newChecked);
  };

  const handleAssignToggle = (value, status) => {
    if(status == "Unavailable" || status == "On Leave"){
      return;
    }
    const currentIndex = assignChecked.indexOf(value);
    const newChecked = [...assignChecked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setAssignChecked(newChecked);
  };

  const handleShiftChange = (event) => {
    setShift((prev) => ({...prev, shift:event.target.value}));
  };

  const handleStatusChange = (event) => {
    setShift((prev) => ({...prev, status:event.target.value}));
  };

  const handleDateChange = (newDate) => {
    setShift((prev) => ({...prev, date:newDate}));
  };

  const handleLocationChange = (event) => {
    setShift((prev) => ({...prev, location:event.target.value}));
  };

  const filterStaffAvailability = () => {
    let filteredAvailableData = availableStaffData;

    if (shift.status) {
      filteredAvailableData = filteredAvailableData.filter((staff) => staff.status === shift.status);
    }

    setFilteredAvailableStaffData(filteredAvailableData);
  };

  const filterStaffLocation = () => {
    let filteredAssignedData = assignedStaffData;

    if (shift.location) {
      filteredAssignedData = filteredAssignedData.filter((staff) => staff.location === shift.location);
    }

    setFilteredAssignedStaffData(filteredAssignedData);
  };

  useEffect(() => {
    filterStaffAvailability();
  }, [shift.status]);

  useEffect(() => {
    filterStaffLocation();
  }, [shift.location]);

  useEffect(() => {
    fetchAvailableStaff()
  }, []);

  useEffect(() => {    
    if(shift.date && shift.shift){
      fetchAssignedStaff()
      fetchAvailableStaff()
    }
  }, [shift.date, shift.shift]);

  return (
    <>
      <Sidebar />
      <div style={{ display: "block", width: "80%", margin: "0px auto", transition: "all 1s ease-in" }}>

        <div>
          <Card className={`mt-5 py-3 text-center`} style={cardHeadingStyle}>
            <h2 style={{margin: 0}}>My Shifts</h2>
          </Card>
        </div>

        <Box sx={{ mr: { xs: 0, md: 2 } }}>
          
        </Box>
        
      </div>

    </>
  );
};

export default StaffShiftPage;
