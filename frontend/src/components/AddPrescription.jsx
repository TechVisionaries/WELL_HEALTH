import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { useMainContext } from "../context/hooks";
// import EditIcon from '@mui/icons-material/Edit';
import { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import RemoveIcon from "@mui/icons-material/Remove";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";
import dashboardStyles from "../styles/dashboardStyles.module.css";
import DeleteIcon from "@mui/icons-material/Delete";
import Sidebar from "./sideBar";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

function AddPrescription() {
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const doctorId = queryParams.get("userId");

  const {
    get_all_patients,
    all_patients,
    add_new_prescription,
    add_prescription,
  } = useMainContext();

  const [prescription, setPrescription] = useState([]);

  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [duration, setDuration] = useState("");
  const [instructions, setInstructions] = useState("");

  // function createData(name, dosage, frequency, duration, instructions) {
  //     return { name, dosage, frequency, duration, instructions };
  // }

  const get_all_patient_list = async () => {
    try {
      await get_all_patients?.();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    get_all_patient_list();
  }, []);

  useEffect(() => {
    if (all_patients && all_patients.success) {
      setPatients(all_patients.data);
    }
  }, [all_patients]);

  const add_row = () => {
    const newPrescription = {
      name,
      dosage,
      frequency,
      duration,
      instructions,
    };

    setPrescription((prev) => [...prev, newPrescription]);

    setName("");
    setDosage("");
    setFrequency("");
    setDuration("");
    setInstructions("");
  };

  const clear_row = () => {
    setName("");
    setDosage("");
    setFrequency("");
    setDuration("");
    setInstructions("");
  };

  const remove_row = (index) => {
    setPrescription((prev) => prev.filter((_, i) => i !== index));
  };

  const save_prescription = async () => {
    const newPrescription = {
      userId: selectedPatient?._id, // Replace this with the actual user ID from your state/context
      doctorId: doctorId, // Replace this with the actual doctor ID
      medicines: prescription, // Assuming 'prescription' holds the list of medicines
    };

    try {
      await add_new_prescription?.(newPrescription);
    } catch (error) {
      Swal.fire({
        title: "Failed",
        text: "Failed to add prescription",
        icon: "error",
      });
    }
  };

  useEffect(() => {
    if (add_prescription && add_prescription.success) {
      Swal.fire({
        title: "Success",
        text: "Prescription Added",
        icon: "success",
      });
      setSelectedPatient(null);
      setPrescription([]);
      setName("");
      setDosage("");
      setFrequency("");
      setDuration("");
      setInstructions("");
    }
  }, [add_prescription]);

  function render_profile_card() {
    return (
      <>
        <Box
          sx={{
            flexGrow: 1,
            backgroundColor: "#f9f9f9",
            borderRadius: 2,
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            p: 4,
            maxWidth: "600px",
            margin: "auto",
          }}
        >
          <Grid container spacing={3}>
            {/* Profile Avatar and Name */}
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Avatar
                  alt="USER"
                  variant="square"
                  sx={{
                    width: "50%",
                    height: "15vh",
                    bgcolor: "#1976d2",
                    color: "#fff",
                    fontSize: "2rem",
                  }}
                >
                  {selectedPatient && selectedPatient.firstName
                    ? selectedPatient.firstName.charAt(0).toUpperCase()
                    : "P"}
                </Avatar>
                <Typography variant="h6" sx={{ color: "#000", mt: 1 }}>
                  {selectedPatient && selectedPatient.firstName
                    ? selectedPatient.firstName
                    : "Patient Name"}
                </Typography>
              </Box>
            </Grid>

            {/* Email */}
            <Grid item xs={12}>
              <TextField
                id="email-field"
                variant="standard"
                label="Email"
                disabled
                sx={{ width: "100%", p: 2 }}
                InputProps={{ style: { color: "bla" } }} // Set text color to black
                value={
                  selectedPatient && selectedPatient.email
                    ? selectedPatient.email
                    : ""
                }
              />
            </Grid>

            {/* Phone Number */}
            <Grid item xs={12}>
              <TextField
                id="phone-field"
                variant="standard"
                label="Phone Number"
                disabled
                sx={{ width: "100%", p: 2 }}
                InputProps={{ style: { color: "#000" } }} // Set text color to black
                value={
                  selectedPatient && selectedPatient.phoneNo
                    ? selectedPatient.phoneNo
                    : ""
                }
              />
            </Grid>

            {/* Age */}
            <Grid item xs={12}>
              <TextField
                id="age-field"
                variant="standard"
                label="Age"
                disabled
                sx={{ width: "100%", p: 2 }}
                InputProps={{ style: { color: "#000" } }} // Set text color to black
                value={
                  selectedPatient && selectedPatient.age
                    ? selectedPatient.age
                    : ""
                }
              />
            </Grid>

            {/* Gender */}
            <Grid item xs={12}>
              <TextField
                id="gender-field"
                variant="standard"
                label="Gender"
                disabled
                sx={{ width: "100%", p: 2 }}
                InputProps={{ style: { color: "#000" } }} // Set text color to black
                value={
                  selectedPatient && selectedPatient.gender
                    ? selectedPatient.gender
                    : ""
                }
              />
            </Grid>

            {/* Uncomment to enable Edit button */}
            {/* <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="contained" startIcon={<EditIcon />}>
              Edit
            </Button>
          </Grid> */}
          </Grid>
        </Box>
      </>
    );
  }

  function render_prescription_details_card() {
    return (
      <Box
        sx={{
          flexGrow: 1,
          backgroundColor: "#f9f9f9",
          borderRadius: 2,
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          p: 4,
          maxWidth: "900px",
          margin: "auto",
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", color: "#333", textAlign: "center", mb: 3 }}
        >
          Prescription Details
        </Typography>

        <TableContainer component={Paper} elevation={3}>
          <Table sx={{ minWidth: 650 }} aria-label="prescription table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", color: "#555" }}>
                  Medication Name
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: "bold", color: "#555" }}
                >
                  Dosage
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: "bold", color: "#555" }}
                >
                  Frequency
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: "bold", color: "#555" }}
                >
                  Duration
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: "bold", color: "#555" }}
                >
                  Instructions
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: "bold", color: "#555" }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {prescription?.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    "&:hover": { backgroundColor: "#f1f1f1" }, // Highlight on hover
                  }}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.dosage}</TableCell>
                  <TableCell align="right">{row.frequency}</TableCell>
                  <TableCell align="right">{row.duration}</TableCell>
                  <TableCell align="right">{row.instructions}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => remove_row(index)}
                      sx={{ color: "#f44336" }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  }

  function render_add_row() {
    return (
      <Box
        sx={{
          flexGrow: 1,
          backgroundColor: "#f9f9f9",
          borderRadius: 2,
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          p: 4,
          maxWidth: "900px",
          margin: "auto",
        }}
      >
        <Grid
          container
          spacing={3}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-evenly",
          }}
        >
          {[
            { label: " Name", value: name, setter: setName },
            { label: "Dosage", value: dosage, setter: setDosage },
            { label: "Frequency", value: frequency, setter: setFrequency },
            { label: "Duration", value: duration, setter: setDuration },
            {
              label: "Instructions",
              value: instructions,
              setter: setInstructions,
            },
          ].map(({ label, value, setter }) => (
            <Grid item key={label} xs={12} md={2} sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ color: "#333", mb: 1 }}>
                {label}
              </Typography>
              <TextField
                id={`text-field-${label.replace(/\s+/g, "-").toLowerCase()}`}
                variant="standard"
                fullWidth
                value={value}
                onChange={(e) => setter(e.target.value)}
                sx={{
                  "& .MuiInputBase-input": {
                    fontSize: "1rem",
                    color: "#444",
                  },
                  "& .MuiInput-underline:before": {
                    borderBottom: "1px solid #ccc",
                  },
                  "& .MuiInput-underline:after": {
                    borderBottom: "2px solid #007bff",
                  },
                }}
              />
            </Grid>
          ))}
        </Grid>

        <Grid
          container
          spacing={2}
          sx={{ justifyContent: "space-between", p: 3 }}
        >
          <Grid item>
            <Button variant="contained" color="primary" onClick={add_row}>
              Add
            </Button>
          </Grid>

          <Grid item>
            <Button variant="contained" color="error" onClick={clear_row}>
              Clear
            </Button>
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <>
      <Sidebar />
      <div className={dashboardStyles.mainDiv}>
        <Box className={dashboardStyles.container} sx={{ overflow: "hidden", flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={4}>
              <Item>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Item>
                      <Autocomplete
                        options={patients}
                        getOptionLabel={(option) =>
                          `${option.firstName} ${option.lastName}`
                        }
                        onChange={(event, newValue) => {
                          setSelectedPatient(newValue);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Patient"
                            variant="outlined"
                            fullWidth
                          />
                        )}
                        renderOption={(props, option) => (
                          <li {...props} key={option._id}>
                            {`${option.firstName} ${option.lastName}`}
                          </li>
                        )}
                        filterOptions={(options, { inputValue }) =>
                          options.filter((option) =>
                            `${option.firstName} ${option.lastName}`
                              .toLowerCase()
                              .includes(inputValue.toLowerCase())
                          )
                        }
                      />
                    </Item>
                  </Grid>
                  <Grid item xs={12}>
                    <Item>{render_profile_card()}</Item>
                  </Grid>
                </Grid>
              </Item>
            </Grid>

            <Grid item xs={12} sm={12} md={8}>
              <Item>
                <Grid container spacing={2} sx={{ p: 2 }}>
                  <Grid item xs={12}>
                    <Item>{render_prescription_details_card()}</Item>
                  </Grid>

                  <Grid item xs={12}>
                    <Item>{render_add_row()}</Item>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}
                  >
                    <Button
                      variant="contained"
                      color="success"
                      onClick={save_prescription}
                    >
                      Save Prescription
                    </Button>
                  </Grid>
                </Grid>
              </Item>
            </Grid>
          </Grid>
        </Box>
      </div>
    </>
  );
}

export default AddPrescription;
