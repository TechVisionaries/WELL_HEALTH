import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
} from "@mui/material";
import Sidebar from "../components/sideBar";
import dashboardStyles from "../styles/dashboardStyles.module.css";
import { useEffect, useState } from "react";
import { useMainContext } from "../context/hooks";
import { useSelector } from "react-redux";

const renderCard = (prescription) => {
  console.log(new Date(prescription.createdAt));

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
      <Grid container spacing={2} sx={{ fontWeight: "bold" }}>
        <Grid item xs={3}>
          <Typography
            sx={{ color: "text.primary", fontSize: { xs: 10, sm: 16 } }}
          >
            Medicine Name
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography
            sx={{ color: "text.primary", fontSize: { xs: 10, sm: 16 } }}
          >
            Dosage
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography
            sx={{ color: "text.primary", fontSize: { xs: 10, sm: 16 } }}
          >
            Frequency
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography
            sx={{ color: "text.primary", fontSize: { xs: 10, sm: 16 } }}
          >
            Duration
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography
            sx={{ color: "text.primary", fontSize: { xs: 10, sm: 16 } }}
          >
            Instructions
          </Typography>
        </Grid>
      </Grid>

      {prescription.medicines.map((medicine, index) => (
        <Grid container spacing={2} key={index} sx={{ mt: 2 }}>
          <Grid item xs={3}>
            <Typography>{medicine.name}</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography>{medicine.dosage}</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography>{medicine.frequency}</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography>{medicine.duration}</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography>{medicine.instructions}</Typography>
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

  // const [prescriptionsData, setPrescriptions] = useState([])
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
      // setPrescriptions(prescriptions.data)
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
      setFilteredPrescriptions(filtered); // Update filtered prescriptions state
    } else {
      setFilteredPrescriptions(prescriptions?.data);
    }
  }, [selectedDate, prescriptions]);

  return (
    <div>
      <Sidebar />
      <div className={dashboardStyles.mainDiv}>
        <Box sx={{ flexGrow: 1, p: 10 }}>
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
                sx={{ minWidth: "50vw" }}
              />
            </Grid>
          </Grid>

          {loading ? (
            <Typography>Loading...</Typography>
          ) : (
            <Grid container spacing={2}>
              {filteredPrescriptions?.length > 0 ? (
                filteredPrescriptions.map((prescriptionData, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Card sx={{ minWidth: "40vw" }} variant="outlined">
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
  );
}

export default PrescriptionsPage;
