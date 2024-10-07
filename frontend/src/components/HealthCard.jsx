import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { FormControl, FormControlLabel, Grid, IconButton, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useMainContext } from '../context/hooks';
import Swal from 'sweetalert2' 

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '75vw',
  bgcolor:'#e6f5ff',
  boxShadow: 24,
  p: 4,
};


function HealthCard() {

    const {user, create_health_card} = useMainContext()

    const [open, setOpen] = useState(!user?.is_health_card);
    const handleClose = () => setOpen(false);

    const [fullName, setFullName] = useState('');
    const [hospital, setHospital] = useState('');
    const [contact, setContact] = useState('');
    const [nic, setNic] = useState('');
    const [emergency, setEmergency] = useState('');
    const [inssurance, setInssurance] = useState(null)

    const [bloodGroup, setBloodGroup] = useState(null);
    const [inssuranceId, setInssuranceId] = useState('');
    const [diabetes, setDiabetes] = useState(false)

    const [bloodPressure, setBloodPressure] = useState(false);
    const [allergyDrugs, setAllergyDrugs] = useState('');
    const [diseases, setDiseases] = useState(null)

    const [eyePressure, setEyePressure] = useState(false)
    const [doctorName, setdoctorName] = useState(null)

    const handle_submit_health_card = (async () => {
        try {

            const userId = user?._id

            const newHealthCard = {
                userId,
                fullName,
                hospital,
                contact,
                nic,
                emergency,
                inssurance,
                bloodGroup,
                inssuranceId,
                diabetes,
                bloodPressure,
                allergyDrugs,
                diseases,
                eyePressure,
                doctorName
            }

          console.info('DATA', newHealthCard);
          await create_health_card?.(newHealthCard)
          Swal.fire({
            title: "Success",
            text: "Health card created",
            icon: "success"
          });
          
        } catch (error) {
          console.error(error);
          Swal.fire({
            title: "Failed",
            text: "Failed to create health card",
            icon: "error"
          });
        }
      });
    
  
    return (
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <div style={{display:'flex',justifyContent:'space-between'}}>
                <Typography id="modal-modal-title" variant="h5" component="h2" sx={{fontWeight:'bold'}}>
                {`Let's build your Helath Card`}
                </Typography>
                <IconButton onClick={handleClose}>
                    <CloseIcon/>
                </IconButton>
            </div>
            <Grid container spacing={2} sx={{p:4}}>
                <Grid item xs={6} sx={{display:'flex'}}>

                        <Typography sx={{width:'50%',mt:2, fontWeight:'bold'}} id="modal-modal-description">
                            Full Name :
                        </Typography>
                        <TextField value={fullName} onChange={(e)=>setFullName(e.target.value)} sx={{width:'100%'}} id="outlined-basic" variant="outlined" />
                    
                </Grid>

                <Grid item xs={6} sx={{display:'flex'}}>

                        <Typography sx={{width:'50%',mt:2,fontWeight:'bold'}} id="modal-modal-description">
                            Hospital (nearest) :
                        </Typography>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Hospital</InputLabel>
                                <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={hospital}
                                label="Hospital"
                                name='hospital'
                                onChange={(e)=>setHospital(e.target.value)}
                                >
                                <MenuItem value={10}>Hospital 1</MenuItem>
                                <MenuItem value={20}>Hospital 2</MenuItem>
                                <MenuItem value={30}>Hospital 3</MenuItem>
                                </Select>
                        </FormControl>
                    
                </Grid>

                <Grid item xs={6} sx={{display:'flex'}}>

                        <Typography sx={{width:'50%',mt:2,fontWeight:'bold'}} id="modal-modal-description">
                            Contact :
                        </Typography>
                        <TextField value={contact} onChange={(e)=>setContact(e.target.value)} sx={{width:'100%'}} id="outlined-basic"  variant="outlined" />
                    
                </Grid>

                <Grid item xs={6} sx={{display:'flex'}}>

                        <Typography sx={{width:'50%',mt:2,fontWeight:'bold'}} id="modal-modal-description">
                            NIC :
                        </Typography>
                        <TextField value={nic} onChange={(e)=>setNic(e.target.value)} sx={{width:'100%'}} id="outlined-basic"  variant="outlined" />
                    
                </Grid>

                <Grid item xs={6} sx={{display:'flex'}}>

                        <Typography sx={{width:'50%',mt:2,fontWeight:'bold'}} id="modal-modal-description">
                            Emergency :
                        </Typography>
                        <TextField value={emergency} onChange={(e)=>setEmergency(e.target.value)} sx={{width:'100%'}} id="outlined-basic"  variant="outlined" />
                    
                </Grid>

                <Grid item xs={6} sx={{display:'flex'}}>

                        <Typography sx={{width:'50%',mt:2,fontWeight:'bold'}} id="modal-modal-description">
                            Inssurance Name :
                        </Typography>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Inssurance</InputLabel>
                                <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={inssurance}
                                label="Inssurance"
                                name='inssurance'
                                onChange={(e)=>setInssurance(e.target.value)}
                                >
                                <MenuItem value={10}>Inssurance 1</MenuItem>
                                <MenuItem value={20}>Inssurance 2</MenuItem>
                                <MenuItem value={30}>Inssurance 3</MenuItem>
                                </Select>
                        </FormControl>
                    
                </Grid>

                <Grid item xs={6} sx={{display:'flex'}}>

                        <Typography sx={{width:'50%',mt:2,fontWeight:'bold'}} id="modal-modal-description">
                            Blood Group :
                        </Typography>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Blood Group</InputLabel>
                                <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={bloodGroup}
                                label="Blood Group"
                                name='bloodGroup'
                                onChange={(e)=>setBloodGroup(e.target.value)}
                                >
                                <MenuItem value={10}>Inssurance 1</MenuItem>
                                <MenuItem value={20}>Inssurance 2</MenuItem>
                                <MenuItem value={30}>Inssurance 3</MenuItem>
                                </Select>
                        </FormControl>
                    
                </Grid>

                <Grid item xs={6} sx={{display:'flex'}}>

                        <Typography sx={{width:'50%',mt:2,fontWeight:'bold'}} id="modal-modal-description">
                            Inssurance Id :
                        </Typography>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Inssurance Id</InputLabel>
                                <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={inssuranceId}
                                label="Inssurance Id"
                                name='inssuranceId'
                                onChange={(e)=>setInssuranceId(e.target.value)}
                                >
                                <MenuItem value={10}>Inssurance Id 1</MenuItem>
                                <MenuItem value={20}>Inssurance Id 2</MenuItem>
                                <MenuItem value={30}>Inssurance Id 3</MenuItem>
                                </Select>
                        </FormControl>
                    
                </Grid>

                <Grid item xs={6} sx={{display:'flex'}}>

                        <Typography sx={{width:'50%',mt:2,fontWeight:'bold'}} id="modal-modal-description">
                            Diabetes :
                        </Typography>

                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            onChange={(e)=>setDiabetes(e.target.value)}
                            value={diabetes}
                        >
                            <FormControlLabel value={true} control={<Radio />} label="Yes" />
                            <FormControlLabel value={false} control={<Radio />} label="No" />
                        </RadioGroup>
                        
                </Grid>

                <Grid item xs={6} sx={{display:'flex'}}>

                        <Typography sx={{width:'50%',mt:2,fontWeight:'bold'}} id="modal-modal-description">
                            Diseases (if have) :
                        </Typography>
                        <TextField value={diseases} onChange={(e)=>setDiseases(e.target.value)} sx={{width:'100%'}} id="outlined-basic" variant="outlined" />
                    
                </Grid>

                <Grid item xs={6} sx={{display:'flex'}}>

                        <Typography sx={{width:'50%',mt:2,fontWeight:'bold'}} id="modal-modal-description">
                            B. Pressure :
                        </Typography>

                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            onChange={(e)=>setBloodPressure(e.target.value)}
                            value={bloodPressure}
                        >
                            <FormControlLabel value={true} control={<Radio />} label="Yes" />
                            <FormControlLabel value={false} control={<Radio />} label="No" />
                        </RadioGroup>
                    
                </Grid>

                <Grid item xs={6} sx={{display:'flex'}}>

                        <Typography sx={{width:'50%',mt:2,fontWeight:'bold'}} id="modal-modal-description">
                            Allergy Drugs :
                        </Typography>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Allergy Drugs</InputLabel>
                                <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={allergyDrugs}
                                label="Allergy Drugs"
                                name='allergyDrugs'
                                onChange={(e)=>setAllergyDrugs(e.target.value)}
                                >
                                <MenuItem value={10}>Allergy Drugs 1</MenuItem>
                                <MenuItem value={20}>Allergy Drugs 2</MenuItem>
                                <MenuItem value={30}>Allergy Drugs 3</MenuItem>
                                </Select>
                        </FormControl>
                    
                </Grid>

                <Grid item xs={6} sx={{display:'flex'}}>

                        <Typography sx={{width:'50%',mt:2,fontWeight:'bold'}} id="modal-modal-description">
                            Eye Pressure :
                        </Typography>

                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            onChange={(e)=>setEyePressure(e.target.value)}
                            value={eyePressure}
                        >
                            <FormControlLabel value={true} control={<Radio />} label="Yes" />
                            <FormControlLabel value={false} control={<Radio />} label="No" />
                        </RadioGroup>
                    
                </Grid>

                <Grid item xs={6} sx={{display:'flex'}}>

                        <Typography sx={{width:'50%',mt:2,fontWeight:'bold'}} id="modal-modal-description">
                            Doctor Name :
                        </Typography>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Doctor Name</InputLabel>
                                <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={doctorName}
                                label="Doctor Name"
                                name='doctorName'
                                onChange={(e)=>setdoctorName(e.target.value)}
                                >
                                <MenuItem value={10}>Doctor 1</MenuItem>
                                <MenuItem value={20}>Doctor 2</MenuItem>
                                <MenuItem value={30}>Doctor 3</MenuItem>
                                </Select>
                        </FormControl>
                    
                </Grid>

                <Grid item xs={12} sx={{display:'flex',justifyContent:'center',mt:2}}>
                    <Button variant='contained' color='success' onClick={handle_submit_health_card}>
                        {`Build My Health Card`}
                    </Button>
                </Grid>
                
            </Grid>
          </Box>
        </Modal>
      </div>
    );
  }
export default HealthCard
