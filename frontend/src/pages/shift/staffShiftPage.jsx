import { useEffect, useRef, useState } from "react";
import {
  Card,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  Backdrop,
  CircularProgress
} from "@mui/material";
import Sidebar from "../../components/sideBar";
import MyCalendar from "./calendar";
import dayjs from "dayjs";
import { shiftsApiSlice, useApplyLeaveMutation, useGetStaffShiftsMutation } from "../../slices/shiftsApiSlice";
import { useSelector } from "react-redux";
import { Shifts } from "./data";
import { ExitToApp } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Col, Row } from "react-bootstrap";
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

const StaffShiftPage = () => {
  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [leave, setLeave] = useState({date: null, shift: "", reason: ""});
  const { userInfo } = useSelector((state) => state.auth);

  const reasonRef = useRef(null);
  const dateRef = useRef(null);
  const shiftRef = useRef(null);

  const[getShifts] = useGetStaffShiftsMutation();
  const[aplyLeave] = useApplyLeaveMutation();

  const fetchStaffShifts = async() => {
    setIsLoading(true)
    try {
      const res = await getShifts(userInfo._id).unwrap();

      let evnts = [];
      let i = 0
      let title = ""
      let start, end;
      res.forEach(shift => {
        i++;
        title = shift.status == "Assigned" ? shift.location : shift.status; //Shifts.find((shiftItm) => shift.shiftSlot == shiftItm.value).displayName;
        start = getTimeForShift(shift.date, shift.shiftSlot?.split(" - ")[0])
        end = getTimeForShift(shift.date, shift.shiftSlot?.split(" - ")[1])

        if(shift.shiftSlot == "10.00 pm - 6.00 am"){
          end = getTimeForShift(shift.date, "11.59 pm")
          evnts.push({
            id: i,
            title: title,
            start: start,
            end: end,
          })
          let newDate = new Date(shift.date).setDate(new Date(shift.date).getDate()+1)
          start = getTimeForShift(newDate, "12.00 am")
          end = getTimeForShift(newDate, shift.shiftSlot?.split(" - ")[1])
          i++;
        }


        evnts.push({
          id: i,
          title: title,
          start: start,
          end: end,
        })
      });
      
      setEvents(evnts)
    } catch (error) {
      toast.error(error.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  }
  
  const applyLeave = async () => {
    handleClose();
    setIsLoading(true);
    try {
      if(!leave.date){
        if(dateRef.current){
          dateRef.current.click();
        }
        throw new Error("Please select a date to apply leave");
      }
      if(!leave.shift){
        if(shiftRef.current){
          shiftRef.current.click();
        }
        throw new Error("Please select a shift to apply leave");
      }
      if(!leave.reason){
        if(reasonRef.current){
          reasonRef.current.focus();
        }
        throw new Error("Please enter a reasaon to apply leave");
      }

      const res = await aplyLeave({ staff: userInfo._id, date: leave.date?.format("YYYY-MM-DD"), shift: leave.shift, reason: leave.reason}).unwrap();
      toast.success('Leave Applied Successfully');

      await fetchStaffShifts();
    } catch (error) {
      toast.error(error.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  }; 

  function getTimeForShift(baseDate, timeStr) {
    const [time, period] = timeStr.split(" ");
    let [hours, minutes] = time.split(".");
    
    // Convert to 24-hour format
    if (period.toLowerCase() === "pm" && hours !== "12") {
      hours = parseInt(hours) + 12;
    } else if (period.toLowerCase() === "am" && hours === "12") {
      hours = 0;
    }
  
    const shiftDate = new Date(baseDate);
    shiftDate.setHours(hours, minutes, 0, 0);
    
    return shiftDate;
  }

  const handleDateChange = (newDate) => {
    setLeave((prev) => ({...prev, date:newDate}));
  };

  const handleShiftChange = (event) => {
    setLeave((prev) => ({...prev, shift:event.target.value}));
  };

  const handleReasonChange = (event) => {
    setLeave((prev) => ({...prev, reason:event.target.value}));
  };

  const handleClose = () => {
    setOpen(false)
    setLeave({date: null, shift: "", reason: ""})
  }

  useEffect(() => {
    fetchStaffShifts()
  }, [])

  return (
    <>
      <Sidebar />
      <div style={{ display: "block", width: "80%", margin: "0px auto", transition: "all 1s ease-in" }}>

        <div>
          <Card className={`mt-5 py-3 text-center`} style={cardHeadingStyle}>
            <h2 style={{margin: 0}}>My Shifts</h2>
          </Card>
        </div>

        <Box sx={{ mr: { xs: 0, md: 2 }, textAlign: 'right' }}>
          <Button variant="contained" sx={{borderRadius: '50px', marginBottom: '5px'}} onClick={() => setOpen(true)}>Apply Leave &nbsp; <ExitToApp /></Button>
          <MyCalendar myEventsList={events} />
        </Box>
        
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
      >
        <DialogTitle>
          Apply Leave
        </DialogTitle>
        <DialogContent>
          <Row>
            <Col xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker 
                  sx={{width:"100%", mt: 1}}
                  label="Select Date"
                  value={leave.date}
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
              <FormControl fullWidth sx={{ mb: 2, mt: 1 }}>
                <InputLabel id="shift-label">Shifts</InputLabel>
                <Select
                  labelId="shift-label"
                  id="shift-select"
                  value={leave.shift}
                  label="Shifts"
                  onChange={handleShiftChange}
                >
                  {/* <MenuItem value={'all'}>Full Day</MenuItem> */}
                  {Shifts.map((shiftItem) => (
                   shiftItem.value && <MenuItem value={shiftItem.value}>{shiftItem.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Col>
          </Row>
          <Row>
            <Col>
            <TextField
              label="Reason"
              multiline
              rows={4}
              fullWidth
              ref={reasonRef}
              value={leave.reason}
              onChange={handleReasonChange}
            />
            </Col>
          </Row>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={applyLeave} autoFocus color="success">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Backdrop
        sx={{ color: '#fff', zIndex: 10000 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default StaffShiftPage;
