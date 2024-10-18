import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  CircularProgress,
  CardHeader,
} from "@mui/material";
import Sidebar from "../components/sideBar";
import dashboardStyles from "../styles/dashboardStyles.module.css";
import { useEffect, useState } from "react";
import { useMainContext } from "../context/hooks";
import { useSelector } from "react-redux";

const cardHeadingStyle = {
  background: "linear-gradient(135deg, #ea3367df, #ff8eaedf,#ea3367df)",
  borderRadius: "10px",
  color: "white",
  textAlign: "center",
  marginTop: "20px",
  marginBottom: "20px",
  padding: "15px", // Add padding as per your requirement
};

const renderCard = (prescription) => {
  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  const formattedDate = new Date(prescription.createdAt).toLocaleDateString(
    "en-GB",
    options
  );

  return (
    <CardContent>
      <Typography gutterBottom sx={{ color: "text.secondary", fontSize: 14 }}>
        {`Date: ${formattedDate}`}
      </Typography>

      <Grid
        container
        spacing={2}
        sx={{
          fontWeight: "bold",
          borderBottom: "2px solid #ccc",
          pb: 1,
          mb: 2,
        }}
      >
        <Grid item xs={3}>
          <Typography
            sx={{
              color: "text.primary",
              fontSize: { xs: 12, sm: 16 },
              fontWeight: "bold",
            }}
          >
            Medicine Name
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography
            sx={{
              color: "text.primary",
              fontSize: { xs: 12, sm: 16 },
              fontWeight: "bold",
            }}
          >
            Dosage
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography
            sx={{
              color: "text.primary",
              fontSize: { xs: 12, sm: 16 },
              fontWeight: "bold",
            }}
          >
            Frequency
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography
            sx={{
              color: "text.primary",
              fontSize: { xs: 12, sm: 16 },
              fontWeight: "bold",
            }}
          >
            Duration
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography
            sx={{
              color: "text.primary",
              fontSize: { xs: 12, sm: 16 },
              fontWeight: "bold",
            }}
          >
            Instructions
          </Typography>
        </Grid>
      </Grid>

      {prescription.medicines.map((medicine, index) => (
        <Grid container spacing={2} key={index} sx={{ mt: 2 }}>
          <Grid item xs={3}>
            <Typography
              sx={{
                color: "text.primary",
                fontSize: { xs: 12, sm: 16 },
                fontWeight: "normal",
              }}
            >
              {medicine.name}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography
              sx={{
                color: "text.primary",
                fontSize: { xs: 12, sm: 16 },
                fontWeight: "normal",
              }}
            >
              {medicine.dosage}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography
              sx={{
                color: "text.primary",
                fontSize: { xs: 12, sm: 16 },
                fontWeight: "normal",
              }}
            >
              {medicine.frequency}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography
              sx={{
                color: "text.primary",
                fontSize: { xs: 12, sm: 16 },
                fontWeight: "normal",
              }}
            >
              {medicine.duration}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography
              sx={{
                color: "text.primary",
                fontSize: { xs: 12, sm: 16 },
                fontWeight: "normal",
              }}
            >
              {medicine.instructions}
            </Typography>
          </Grid>
        </Grid>
      ))}
    </CardContent>
  );
};

function PrescriptionsPage() {
  const { userInfo } = useSelector((state) => state.auth);
  const { get_all_prescriptions, prescriptions } = useMainContext();

  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);

  const fetchPrescriptions = async () => {
    if (!userInfo?._id) return;
    setLoading(true);
    try {
      await get_all_prescriptions(userInfo._id);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, [userInfo]);

  useEffect(() => {
    if (prescriptions && prescriptions.success) {
      setFilteredPrescriptions(prescriptions.data);
    }
  }, [prescriptions]);

  useEffect(() => {
    if (selectedDate && prescriptions.success) {
      const filtered = prescriptions?.data?.filter((prescription) => {
        const date = new Date(prescription.createdAt);
        if (isNaN(date.getTime())) return false; // Skip if it's not a valid date
        const prescriptionDate = date.toISOString().split("T")[0]; // Format: YYYY-MM-DD
        return prescriptionDate === selectedDate; // Compare with selectedDate
      });
      setFilteredPrescriptions(filtered);
    } else {
      setFilteredPrescriptions(prescriptions?.data);
    }
  }, [selectedDate, prescriptions]);

  return (
    <>
      <Sidebar />
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{width:"80%"}}>

        <Card
          className={`mt-3 py-3 text-center`}
          style={cardHeadingStyle}
        >
          <h2>Patient Medical Records</h2>
        </Card>
        </div>

        <div className={dashboardStyles.mainDiv}>
          <Box sx={{ flexGrow: 1, p: 5 }}>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Filter by Date"
                  type="date"
                  value={selectedDate || ""}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{
                    minWidth: "50vw",
                    backgroundColor: "#fff",
                    borderRadius: "5px",
                  }}
                />
              </Grid>
            </Grid>

            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "50vh",
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <Grid container spacing={2}>
                {filteredPrescriptions?.length > 0 ? (
                  filteredPrescriptions.map((prescriptionData, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <Card
                        sx={{
                          minWidth: "40vw",
                          boxShadow: "0 3px 10px rgba(0, 0, 0, 0.1)",
                        }}
                        variant="outlined"
                      >
                        <CardHeader
                          title={`Prescription ${index + 1}`}
                          sx={{ backgroundColor: "#f5f5f5", padding: 2 }}
                        />
                        {renderCard(prescriptionData)}
                      </Card>
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <h3>No Data</h3>
                  </Grid>
                )}
              </Grid>
            )}
          </Box>
        </div>
      </div>
    </>
  );
}

export default PrescriptionsPage;
