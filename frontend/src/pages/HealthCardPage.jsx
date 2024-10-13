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
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2} sx={{ p: 4 }}>
          <Grid item xs={12}>
            {/* <Item> */}
            <Typography variant="h6">
              {`Hello ${
                userInfo ? userInfo.firstName : "User"
              } here is your health card..`}
            </Typography>
            {/* </Item> */}
          </Grid>
          <Grid item xs={12}>
            <Item sx={{ p: 6 }}>
              <QRCode
                size={256}
                style={{ height: "20vh", maxWidth: "100%", width: "100%" }}
                value={"https://www.google.com"}
                viewBox={`0 0 256 256`}
              />
            </Item>
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="standard-size-normal"
              defaultValue="Name : "
              label="Name"
              variant="standard"
              value={fullName}
              sx={{ width: "100%", p: 2 }}
              onChange={(e) => setFullName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            {/* <TextField
              id="standard-size-normal"
              defaultValue="NIC : "
              variant="standard"
              sx={{width:'100%', p:2}}
            /> */}
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="standard-size-normal"
              defaultValue="Hospital : "
              variant="standard"
              label="Hospital"
              value={hospital}
              onChange={(e) => setHospital(e.target.value)}
              sx={{ width: "100%", p: 2 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="standard-size-normal"
              defaultValue="Contact : "
              variant="standard"
              label="Contact"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              sx={{ width: "100%", p: 2 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="standard-size-normal"
              defaultValue="Emergency : "
              label="Emergency"
              variant="standard"
              value={emergency}
              onChange={(e) => setEmergency(e.target.value)}
              sx={{ width: "100%", p: 2 }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              color="success"
              variant="contained"
              onClick={update_health_card_data}
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
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2} sx={{ p: 4 }}>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h7" xs={6} sx={{ fontWeight: "bold" }}>
              Hospital :
            </Typography>
            <Typography variant="h7" xs={6}>
              {health_card?.hospital}
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h7" xs={6} sx={{ fontWeight: "bold" }}>
              Blood Group :
            </Typography>
            <Typography variant="h7" xs={6}>
              {health_card?.bloodGroup}
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
            }}
          >
            <Typography variant="h7" xs={6} sx={{ fontWeight: "bold" }}>
              Diabetes :
            </Typography>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              onChange={(e) => setDiabetes(e.target.value === "true")}
              value={diabetes === true ? "true" : "false"}
            >
              <FormControlLabel value={true} control={<Radio />} label="Yes" />
              <FormControlLabel value={false} control={<Radio />} label="No" />
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
            }}
          >
            <Typography variant="h7" xs={6} sx={{ fontWeight: "bold" }}>
              B. Pressure :
            </Typography>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              onChange={(e) => setBloodPressure(e.target.value === "true")}
              value={bloodPressure ? "true" : "false"}
            >
              <FormControlLabel value={true} control={<Radio />} label="Yes" />
              <FormControlLabel value={false} control={<Radio />} label="No" />
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
            }}
          >
            <Typography variant="h7" xs={6} sx={{ fontWeight: "bold" }}>
              Eye Pressure :
            </Typography>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              onChange={(e) => setEyePressure(e.target.value === "true")}
              value={eyePressure === true ? "true" : "false"}
            >
              <FormControlLabel value={true} control={<Radio />} label="Yes" />
              <FormControlLabel value={false} control={<Radio />} label="No" />
            </RadioGroup>
          </Grid>

          {/* <Grid item xs={12} sx={{display:'flex',flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
            <Typography variant='h7'xs={6} sx={{fontWeight:'bold'}}>
                Disorders : 
              </Typography>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  // onChange={(e)=>setDiabetes(e.target.value)}
                  value={true}
              >
                  <FormControlLabel disabled value={true} control={<Radio />} label="Yes" />
                  <FormControlLabel disabled value={false} control={<Radio />} label="No" />
                </RadioGroup>
          </Grid> */}

          {/* <Grid item xs={12} sx={{display:'flex',flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
            <Typography variant='h7'xs={6} sx={{fontWeight:'bold'}}>
                Stroke : 
              </Typography>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  // onChange={(e)=>setDiabetes(e.target.value)}
                  value={true}
              >
                  <FormControlLabel disabled value={true} control={<Radio />} label="Yes" />
                  <FormControlLabel disabled value={false} control={<Radio />} label="No" />
                </RadioGroup>
          </Grid>

          <Grid item xs={12} sx={{display:'flex',flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
            <Typography variant='h7'xs={6} sx={{fontWeight:'bold'}}>
                Allergies : 
              </Typography>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  // onChange={(e)=>setDiabetes(e.target.value)}
                  value={true}
              >
                  <FormControlLabel disabled value={true} control={<Radio />} label="Yes" />
                  <FormControlLabel disabled value={false} control={<Radio />} label="No" />
                </RadioGroup>
          </Grid> */}

          <Grid container spacing={2} sx={{ p: 4 }}>
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <Typography variant="h6" xs={6} sx={{ fontWeight: "bold" }}>
                Allergy Drugs
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="standard-size-normal"
                variant="standard"
                multiline
                maxRows={4}
                value={allergyDrugs}
                sx={{ width: "100%", p: 2 }}
                onChange={(e) => setAllergyDrugs(e.target.value)}
              />
              <Divider />
              {/* <Typography variant='h7' sx={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                Ammoxiline
              </Typography>
              <Divider/>
              <Typography variant='h7' sx={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                Rapidisol
              </Typography>
              <Divider/>
              <Typography variant='h7' sx={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                Ammoxiline
              </Typography>
              <Divider/> */}
              <Grid item xs={12}>
                <Button
                  color="success"
                  variant="contained"
                  onClick={update_health_card_data}
                >
                  Save Changes
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    );
  }

  function most_recent_medical_records() {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ p: 2 }}>
            {/* <Item> */}
            <Typography variant="h6">Most Recent Medical Records</Typography>
            {/* </Item> */}
          </Grid>

          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <Typography variant="h7" xs={6} sx={{ fontWeight: "bold" }}>
              Date :
            </Typography>
            <Typography variant="h7" xs={6}>
              {`${
                lastMedical
                  ? new Date(lastMedical.createdAt).toISOString().split("T")[0]
                  : "--/--/----"
              }`}
            </Typography>
          </Grid>

          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <Typography variant="h7" xs={6} sx={{ fontWeight: "bold" }}>
              Consultant :
            </Typography>
            <Typography variant="h7" xs={6}>
              {`${
                lastMedical
                  ? lastMedical.doctorId?.firstName +
                    lastMedical.doctorId?.lastName
                  : ""
              }`}
            </Typography>
          </Grid>

          {/* <Grid item xs={12} sx={{display:'flex',alignItems:'center', justifyContent:'flex-start'}}>
            <Typography variant='h7'xs={6} sx={{fontWeight:'bold'}}>
                Sickness :  
            </Typography>
            <Typography variant='h7' xs={6}>
              {` Influenza Beta Rapid`}
            </Typography>
          </Grid> */}

          <Grid
            item
            xs={12}
            sx={{ display: "flex", justifyContent: "center", width: "100%" }}
          >
            <Box sx={{ width: "100%", p: 3 }}>
              {/* Header for the medicines table */}
              <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
                Medicines List
              </Typography>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={3}>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: "bold", textAlign: "center" }}
                  >
                    Name
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: "bold", textAlign: "center" }}
                  >
                    Dosage
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: "bold", textAlign: "center" }}
                  >
                    Frequency
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: "bold", textAlign: "center" }}
                  >
                    Duration
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
              </Grid>

              {/* Mapping over the medicines data */}
              {lastMedical?.medicines?.map((medicine) => (
                <Grid
                  container
                  spacing={2}
                  key={medicine._id}
                  sx={{ alignItems: "center" }}
                >
                  <Grid item xs={3}>
                    <Typography variant="body1">{medicine.name}</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="body1">{medicine.dosage}</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="body1">
                      {medicine.frequency}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="body1">{medicine.duration}</Typography>
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

  // function most_recent_test_reports(){

  //   return(
  //     <Box sx={{ flexGrow: 1 }}>
  //       <Grid container spacing={2} >
  //         <Grid item xs={12} sx={{p:2}}>
  //           {/* <Item> */}
  //             <Typography variant='h6'>
  //               Most Recent Test Reports
  //             </Typography>
  //           {/* </Item> */}
  //         </Grid>

  //         <Grid item xs={12} sx={{display:'flex',alignItems:'center', justifyContent:'flex-start'}}>
  //             <Typography variant='h7'xs={6} sx={{fontWeight:'bold'}}>
  //               Date :
  //             </Typography>
  //             <Typography variant='h7' xs={6}>
  //               {` 24-09-2025`}
  //             </Typography>
  //         </Grid>

  //         <Grid item xs={12} sx={{display:'flex',alignItems:'center', justifyContent:'space-around'}}>
  //           <div>
  //             <Avatar >
  //               <AssignmentIcon />
  //             </Avatar>
  //             <span>FBC</span>
  //           </div>

  //           <div>
  //             <Avatar >
  //               <AssignmentIcon />
  //             </Avatar>
  //             <span>RBS</span>
  //           </div>

  //           <div>
  //             <Avatar >
  //               <AssignmentIcon />
  //             </Avatar>
  //             <span>CRP</span>
  //           </div>

  //         </Grid>

  //       </Grid>
  //     </Box>
  //   )
  // }

  return (
    <div>
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={updateSubmit}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Sidebar />
      <div className={dashboardStyles.mainDiv}>
        {/* <Container className={dashboardStyles.container}> */}
        <Box sx={{ flexGrow: 1, p: 10 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Item>{render_profile_card()}</Item>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Item>{render_medical_card()}</Item>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Item>{most_recent_medical_records()}</Item>
            </Grid>
          </Grid>
        </Box>
        {/* </Container> */}
      </div>
    </div>
  );
}

export default HealthCardPage;
