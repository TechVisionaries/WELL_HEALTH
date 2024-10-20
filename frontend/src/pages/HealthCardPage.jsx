import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import {
  Backdrop,
  Button,
  CircularProgress,
  Divider,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import QRCode from "react-qr-code";
// import AssignmentIcon from '@mui/icons-material/Assignment';

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

import Sidebar from "../components/sideBar";

import dashboardStyles from "../styles/dashboardStyles.module.css";
import { useSelector } from "react-redux";
import { useMainContext } from "../context/hooks";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Card } from "react-bootstrap";

const cardHeadingStyle = {
  background: "linear-gradient(135deg, #ea3367df, #ff8eaedf,#ea3367df)",
  borderRadius: "10px",
  color: "white",
  textAlign: "center",
  marginTop: "20px",
  marginBottom: "20px",
  padding: "15px", // Add padding as per your requirement
};

function HealthCardPage() {
  const { userInfo } = useSelector((state) => state.auth);

  const [health_card, setHealthCard] = useState();
  const [lastMedical, setLastMedical] = useState();

  const [fullName, setFullName] = useState(
    health_card ? health_card.fullName : ""
  );
  const [hospital, setHospital] = useState(
    health_card ? health_card.hospital : ""
  );
  const [contact, setContact] = useState(
    health_card ? health_card.contact : ""
  );
  const [emergency, setEmergency] = useState(
    health_card ? health_card.emergency : ""
  );

  const [diabetes, setDiabetes] = useState(
    health_card ? health_card.diabetes : ""
  );
  const [bloodPressure, setBloodPressure] = useState(
    health_card ? health_card.bloodPressure : ""
  );
  const [allergyDrugs, setAllergyDrugs] = useState(
    health_card ? health_card.allergyDrugs : ""
  );
  const [eyePressure, setEyePressure] = useState(
    health_card ? health_card.eyePressure : ""
  );

  const [updateSubmit, setUpdateSubmit] = useState(false);

  const {
    get_health_card_by_patient_id,
    patient_health_card,
    update_health_card,
    health_card_update_state,
  } = useMainContext();

  const get_health_card_for_patient = async () => {
    try {
      await get_health_card_by_patient_id?.(userInfo?._id);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (health_card) {
      setFullName(health_card.fullName);
      setHospital(health_card.hospital);
      setContact(health_card.contact);
      setEmergency(health_card.emergency);
      setDiabetes(health_card.diabetes);
      setBloodPressure(health_card.bloodPressure);
      setAllergyDrugs(health_card.allergyDrugs);
      setEyePressure(health_card.eyePressure);
    }
  }, [health_card]);

  useEffect(() => {
    get_health_card_for_patient();
  }, []);

  useEffect(() => {
    if (patient_health_card && patient_health_card.success) {
      setHealthCard(patient_health_card.data.healthCard[0]);

      if (patient_health_card.data.lastPrescription) {
        setLastMedical(patient_health_card.data.lastPrescription);
      }
    }
  }, [patient_health_card]);

  useEffect(() => {
    if (health_card_update_state && health_card_update_state.success) {
      setUpdateSubmit(false);
      Swal.fire({
        title: "Success",
        text: "Health card updated",
        icon: "success",
      });
    }
  }, [health_card_update_state]);

  const update_health_card_data = async () => {
    setUpdateSubmit(true);
    const healthCardData = {
      fullName,
      hospital,
      contact,
      emergency,
      diabetes,
      bloodPressure,
      allergyDrugs,
      eyePressure,
    };
    const userId = userInfo ? userInfo._id : null;
    const health_card_id = health_card ? health_card._id : null;
    try {
      await update_health_card?.(healthCardData, userId, health_card_id);
    } catch (error) {
      setUpdateSubmit(false);
      Swal.fire({
        title: "Failed",
        text: "Failed to update health card",
        icon: "error",
      });
    }
  };

  function render_profile_card() {
    return (
      <Box
        sx={{
          flexGrow: 1,
          backgroundColor: "#f9f9f9",
          borderRadius: 2,
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          p: { xs: 2, sm: 4, md: 6 },
          maxWidth: { xs: "100%", sm: "100%", md: "100%" },
          margin: "auto",
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                color: "#333",
                textAlign: "center",
                mb: 3,
                fontSize: { xs: "1.2rem", sm: "1.5rem" },
              }}
            >
              {`Hello ${
                userInfo ? userInfo.firstName : "User"
              }, here is your health card`}
            </Typography>
          </Grid>

          <Grid
            item
            xs={12}
            sx={{ display: "flex", justifyContent: "center", mb: 3 }}
          >
            <Box
              sx={{
                p: 2,
                backgroundColor: "#fff",
                borderRadius: 2,
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: { xs: "100%", sm: "75%", md: "50%" },
              }}
            >
              <QRCode
                size={256}
                style={{ height: "20vh", maxWidth: "100%", width: "100%" }}
                // value={"https://www.google.com"}
                value={`http://172.28.28.111:3000/add-prescription?userId=${
                  JSON.parse(localStorage.getItem("userInfo"))._id
                }`}
                viewBox={`0 0 256 256`}
              />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <TextField
              id="name-field"
              label="Full Name"
              variant="outlined"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              sx={{
                width: "100%",
                backgroundColor: "#fff",
                borderRadius: 1,
                mb: 2,
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              id="hospital-field"
              label="Hospital"
              variant="outlined"
              value={hospital}
              onChange={(e) => setHospital(e.target.value)}
              sx={{
                width: "100%",
                backgroundColor: "#fff",
                borderRadius: 1,
                mb: 2,
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              id="contact-field"
              label="Contact"
              variant="outlined"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              sx={{
                width: "100%",
                backgroundColor: "#fff",
                borderRadius: 1,
                mb: 2,
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              id="emergency-field"
              label="Emergency Contact"
              variant="outlined"
              value={emergency}
              onChange={(e) => setEmergency(e.target.value)}
              sx={{
                width: "100%",
                backgroundColor: "#fff",
                borderRadius: 1,
                mb: 3,
              }}
            />
          </Grid>

          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              color="success"
              variant="contained"
              onClick={update_health_card_data}
              sx={{
                backgroundColor: "#4caf50",
                "&:hover": { backgroundColor: "#45a049" },
                width: "100%",
              }}
            >
              Save Changes
            </Button>
          </Grid>
        </Grid>
      </Box>
    );
  }


  function render_medical_card() {
    return (
      <Box
        sx={{
          flexGrow: 1,
          backgroundColor: "#f9f9f9",
          borderRadius: 2,
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          p: 4,
          maxWidth: { xs: "100%", sm: "100%", md: "100%" },
          margin: "auto",
        }}
      >
        <Grid container spacing={2}>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              borderBottom: "1px solid #ddd",
              pb: 1,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}>
              Medical Card Details
            </Typography>
          </Grid>

          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "bold", color: "#555" }}
            >
              Hospital:
            </Typography>
            <Typography variant="subtitle1" sx={{ color: "#666" }}>
              {health_card?.hospital || "N/A"}
            </Typography>
          </Grid>

          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "bold", color: "#555" }}
            >
              Blood Group:
            </Typography>
            <Typography variant="subtitle1" sx={{ color: "#666" }}>
              {health_card?.bloodGroup || "N/A"}
            </Typography>
          </Grid>

          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "bold", color: "#555" }}
            >
              Diabetes:
            </Typography>
            <RadioGroup
              row
              onChange={(e) => setDiabetes(e.target.value === "true")}
              value={diabetes ? "true" : "false"}
            >
              <FormControlLabel value="true" control={<Radio />} label="Yes" />
              <FormControlLabel value="false" control={<Radio />} label="No" />
            </RadioGroup>
          </Grid>

          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "bold", color: "#555" }}
            >
              Blood Pressure:
            </Typography>
            <RadioGroup
              row
              onChange={(e) => setBloodPressure(e.target.value === "true")}
              value={bloodPressure ? "true" : "false"}
            >
              <FormControlLabel value="true" control={<Radio />} label="Yes" />
              <FormControlLabel value="false" control={<Radio />} label="No" />
            </RadioGroup>
          </Grid>

          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "bold", color: "#555" }}
            >
              Eye Pressure:
            </Typography>
            <RadioGroup
              row
              onChange={(e) => setEyePressure(e.target.value === "true")}
              value={eyePressure ? "true" : "false"}
            >
              <FormControlLabel value="true" control={<Radio />} label="Yes" />
              <FormControlLabel value="false" control={<Radio />} label="No" />
            </RadioGroup>
          </Grid>

          <Grid item xs={12}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: "#333",
                textAlign: "center",
                mb: 2,
              }}
            >
              Allergy Drugs
            </Typography>
            <TextField
              id="standard-size-normal"
              variant="outlined"
              multiline
              maxRows={4}
              value={allergyDrugs}
              sx={{
                width: "100%",
                backgroundColor: "#fff",
                borderRadius: 1,
                mb: 2,
              }}
              onChange={(e) => setAllergyDrugs(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              color="success"
              variant="contained"
              onClick={update_health_card_data}
              sx={{
                mt: 2,
                backgroundColor: "#4caf50",
                "&:hover": { backgroundColor: "#45a049" },
                borderRadius: 2,
                textTransform: "none",
              }}
            >
              Save Changes
            </Button>
          </Grid>
        </Grid>
      </Box>
    );
  }


  function most_recent_medical_records() {
    return (
      <Box
        sx={{
          flexGrow: 1,
          backgroundColor: "#f9f9f9",
          borderRadius: 2,
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          p: { xs: 2, md: 4 }, // Responsive padding: smaller for mobile
          maxWidth: "900px",
          margin: "auto",
        }}
      >
        <Grid container spacing={3}>
          {/* Header */}
          <Grid item xs={12} sx={{ textAlign: "center", mb: { xs: 2, md: 3 } }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                color: "#333",
                fontSize: { xs: "1.5rem", md: "1.75rem" }, // Smaller font on mobile
              }}
            >
              Most Recent Medical Records
            </Typography>
          </Grid>

          {/* Date */}
          <Grid
            item
            xs={12}
            sx={{ display: "flex", alignItems: "center", mb: { xs: 1, md: 2 } }}
          >
            <Typography
              variant="body1"
              sx={{
                fontWeight: "bold",
                fontSize: { xs: "0.9rem", md: "1rem" }, // Smaller font for mobile
                color: "#333",
                mr: 1,
              }}
            >
              Date:
            </Typography>
            <Typography
              variant="body1"
              sx={{ fontSize: { xs: "0.9rem", md: "1rem" }, color: "#666" }}
            >
              {lastMedical
                ? new Date(lastMedical.createdAt).toISOString().split("T")[0]
                : "--/--/----"}
            </Typography>
          </Grid>

          {/* Consultant */}
          <Grid
            item
            xs={12}
            sx={{ display: "flex", alignItems: "center", mb: { xs: 1, md: 2 } }}
          >
            <Typography
              variant="body1"
              sx={{
                fontWeight: "bold",
                fontSize: { xs: "0.9rem", md: "1rem" },
                color: "#333",
                mr: 1,
              }}
            >
              Consultant:
            </Typography>
            <Typography
              variant="body1"
              sx={{ fontSize: { xs: "0.9rem", md: "1rem" }, color: "#666" }}
            >
              {lastMedical
                ? `${lastMedical.doctorId?.firstName} ${lastMedical.doctorId?.lastName}`
                : "N/A"}
            </Typography>
          </Grid>

          {/* Medicines List */}
          <Grid item xs={12}>
            <Box
              sx={{
                backgroundColor: "#fff",
                borderRadius: 2,
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                p: { xs: 2, md: 3 }, // Adjust padding for mobile
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  fontSize: { xs: "1.25rem", md: "1.5rem" }, // Responsive font
                  color: "#333",
                  textAlign: "center",
                  mb: { xs: 1, md: 2 },
                }}
              >
                Medicines List
              </Typography>

              {/* Medicines Table Header */}
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={3}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      fontSize: { xs: "0.85rem", md: "1rem" },
                      color: "#555",
                    }}
                  >
                    Name
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      fontSize: { xs: "0.85rem", md: "1rem" },
                      color: "#555",
                    }}
                  >
                    Dosage
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      fontSize: { xs: "0.85rem", md: "1rem" },
                      color: "#555",
                    }}
                  >
                    Frequency
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      fontSize: { xs: "0.85rem", md: "1rem" },
                      color: "#555",
                    }}
                  >
                    Duration
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
              </Grid>

              {/* Medicines Data */}
              {lastMedical?.medicines?.map((medicine) => (
                <Grid
                  container
                  spacing={2}
                  key={medicine._id}
                  sx={{ alignItems: "center", mb: 1 }}
                >
                  <Grid item xs={3}>
                    <Typography
                      variant="body1"
                      sx={{
                        textAlign: "center",
                        fontSize: { xs: "0.85rem", md: "1rem" }, // Responsive font
                        color: "#444",
                      }}
                    >
                      {medicine.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography
                      variant="body1"
                      sx={{
                        textAlign: "center",
                        fontSize: { xs: "0.85rem", md: "1rem" },
                        color: "#444",
                      }}
                    >
                      {medicine.dosage}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography
                      variant="body1"
                      sx={{
                        textAlign: "center",
                        fontSize: { xs: "0.85rem", md: "1rem" },
                        color: "#444",
                      }}
                    >
                      {medicine.frequency}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography
                      variant="body1"
                      sx={{
                        textAlign: "center",
                        fontSize: { xs: "0.85rem", md: "1rem" },
                        color: "#444",
                      }}
                    >
                      {medicine.duration}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                </Grid>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
  }



  return (
    <>
      <Sidebar />
      <div>
        <div style={{ width: "90%", display: "block", margin: "auto" }}>
          <Card className={`mt-3 py-3 text-center`} style={cardHeadingStyle}>
            <h2>Patient Health Card</h2>
          </Card>
        </div>

        <Backdrop
          sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
          open={updateSubmit}
        >
          <CircularProgress color="inherit" />
        </Backdrop>

        <div className={dashboardStyles.mainDiv}>
          <Box
            sx={{
              flexGrow: 1,
              p: { xs: 2, sm: 4, md: 6 }, // Adjust padding based on screen size
              width: "100%",
            }}
          >
            <Grid container spacing={2}>
              {/* Profile card */}
              <Grid item xs={12} sm={6} md={4}>
                <Item>{render_profile_card()}</Item>
              </Grid>

              {/* Medical card */}
              <Grid item xs={12} sm={6} md={4}>
                <Item>{render_medical_card()}</Item>
              </Grid>

              {/* Most recent medical record */}
              <Grid item xs={12} md={4}>
                <Item>{most_recent_medical_records()}</Item>
              </Grid>
            </Grid>
          </Box>
        </div>
      </div>
    </>
  );

}

export default HealthCardPage;
