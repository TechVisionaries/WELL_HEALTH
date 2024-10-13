import { Autocomplete, Avatar, Box, Button, Grid, IconButton, TextField, Typography } from "@mui/material"
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { useMainContext } from "../context/hooks";
// import EditIcon from '@mui/icons-material/Edit';
import { useEffect, useState } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import RemoveIcon from '@mui/icons-material/Remove';
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";
import dashboardStyles from '../styles/dashboardStyles.module.css';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    ...theme.applyStyles('dark', {
      backgroundColor: '#1A2027',
    }),
  }));



function AddPrescription() {

    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const doctorId = queryParams.get('userId');
    
    

    const {get_all_patients, all_patients, add_new_prescription, add_prescription} = useMainContext()

    const [prescription, setPrescription] = useState([])

    const [patients, setPatients] = useState([])
    const [selectedPatient, setSelectedPatient] = useState(null)

    const [name, setName] = useState('')
    const [dosage, setDosage] = useState('')
    const [frequency, setFrequency] = useState('')
    const [duration, setDuration] = useState('')
    const [instructions, setInstructions] = useState('')

    // function createData(name, dosage, frequency, duration, instructions) {
    //     return { name, dosage, frequency, duration, instructions };
    // }

    const get_all_patient_list = async () => {

        try {

            await get_all_patients?.()
            
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        get_all_patient_list()
    }, [])

    useEffect(() => {
    
        if(all_patients && all_patients.success){
          
            setPatients(all_patients.data)
          
        }
      }, [all_patients])

    const add_row = ()=>{

        const newPrescription = {
            name,
            dosage,
            frequency,
            duration,
            instructions,
            };
        
            setPrescription(prev => [...prev, newPrescription]);
        
            setName('');
            setDosage('');
            setFrequency('');
            setDuration('');
            setInstructions('');

    }

    const clear_row = ()=>{
        setName('');
        setDosage('');
        setFrequency('');
        setDuration('');
        setInstructions('');
    }

    const remove_row = (index)=>{
        setPrescription(prev => prev.filter((_, i) => i !== index));
    }

    const save_prescription = async()=>{

        const newPrescription = {
            userId: selectedPatient?._id,        // Replace this with the actual user ID from your state/context
            doctorId: doctorId,    // Replace this with the actual doctor ID
            medicines: prescription,  // Assuming 'prescription' holds the list of medicines
          };

          try {
            await add_new_prescription?.(newPrescription)
          } catch (error) {
            Swal.fire({title:"Failed", text:"Failed to add prescription",icon:'error'})
          }
    }

    useEffect(() => {
      if(add_prescription && add_prescription.success){
        Swal.fire({title:"Success", text:"Prescription Added",icon:'success'})
        setSelectedPatient(null)
        setPrescription([])
        setName('');
        setDosage('');
        setFrequency('');
        setDuration('');
        setInstructions('');
      }
    }, [add_prescription])
    

    function render_profile_card(){

        return(
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2} sx={{p:4}}>

                    <Grid item xs={12}>
                        <div style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                            <Avatar alt="USER" variant="square" sx={{width:'50%', height:'15vh'}}>
                                {selectedPatient && selectedPatient.firstName?selectedPatient.firstName:"P"}
                            </Avatar>
                            <Typography variant="h6">
                                {selectedPatient && selectedPatient.firstName?selectedPatient.firstName:"Patient Name"}
                            </Typography>
                        </div>
                    </Grid>

                    <Grid item xs={12} >
                        <TextField
                            id="standard-size-normal"
                            defaultValue="Email : "
                            variant="standard"
                            label="Email"
                            disabled
                            sx={{width:'100%', p:2}}
                            value={selectedPatient && selectedPatient.email?selectedPatient.email:""}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            id="standard-size-normal"
                            defaultValue="Phone No : "
                            variant="standard"
                            label="Phone Number"
                            sx={{width:'100%', p:2}}
                            disabled
                            value={selectedPatient && selectedPatient.phoneNo?selectedPatient.phoneNo:""}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            id="standard-size-normal"
                            defaultValue="Age : "
                            variant="standard"
                            label="Age"
                            sx={{width:'100%', p:2}}
                            disabled
                            value={selectedPatient && selectedPatient.age?selectedPatient.age:""}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            id="standard-size-normal"
                            defaultValue="Gender : "
                            variant="standard"
                            label="Gender"
                            sx={{width:'100%', p:2}}
                            disabled
                            value={selectedPatient && selectedPatient.gender?selectedPatient.gender:""}
                        />
                    </Grid>

                    {/* <Grid item xs={12} sx={{display:'flex', justifyContent:'flex-end'}}>
                        <Button variant="contained" startIcon={<EditIcon />}>
                            Edit
                        </Button>
                    </Grid> */}

                </Grid>
            </Box>
        )
    }

    function render_prescription_details_card(){

        return(
            <Box sx={{ flexGrow: 1 }}>
                {/* <Grid container spacing={2} >

                    <Grid item xs={12} >
                        <TextField
                            id="standard-size-normal"
                            defaultValue="Medication Name : "
                            variant="standard"
                            sx={{width:'100%', p:1}}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            id="standard-size-normal"
                            defaultValue="Dosage : "
                            variant="standard"
                            sx={{width:'100%', p:1}}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            id="standard-size-normal"
                            defaultValue="Frequency : "
                            variant="standard"
                            sx={{width:'100%', p:1}}
                        />
                    </Grid>
                    <Grid item xs={12} >
                        <TextField
                            id="standard-size-normal"
                            defaultValue="Duration : "
                            variant="standard"
                            sx={{width:'100%', p:1}}
                        />
                    </Grid>

                    <Grid item xs={12} >
                        <TextField
                            id="standard-size-normal"
                            defaultValue="Instructions : "
                            variant="standard"
                            sx={{width:'100%', p:1}}
                        />
                    </Grid>

                    <Grid item xs={12} sx={{display:'flex', justifyContent:'flex-end'}}>
                        <Button variant="contained" startIcon={<EditIcon />}>
                            Edit
                        </Button>
                    </Grid>

                </Grid> */}

                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell>Medication Name</TableCell>
                            <TableCell align="right">Dosage</TableCell>
                            <TableCell align="right">Frequency</TableCell>
                            <TableCell align="right">Duration</TableCell>
                            <TableCell align="right">Instructions</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {prescription?.map((row,index) => (
                            <TableRow
                            key={index}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                            <TableCell component="th" scope="row">
                                {row.name}
                            </TableCell>
                            <TableCell align="right">{row.dosage}</TableCell>
                            <TableCell align="right">{row.frequency}</TableCell>
                            <TableCell align="right">{row.duration}</TableCell>
                            <TableCell align="right">{row.instructions}</TableCell>
                            <TableCell align="right" >
                                <IconButton onClick={()=>remove_row(index)}>
                                    <RemoveIcon/>
                                </IconButton>
                            </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                    </TableContainer>

            </Box>
        )
    }

    function render_add_row(){

        return(
            
            <Box sx={{ flexGrow: 1 }}>

                <Grid spacing={2} sx={{display:'flex', flexDirection:{xs:'column',md:'row'}, justifyContent:'space-evenly'}}>

                    <Grid item >
                        <Grid item >
                            <Typography variant="h6">
                                Medication Name
                            </Typography>
                        </Grid>
                        <Grid item >
                            <TextField
                                id="standard-size-normal"
                                variant="standard"
                                value={name}
                                onChange={(e)=>setName(e.target.value)}
                            />
                        </Grid>
                    </Grid>

                    <Grid item >
                        <Grid item >
                            <Typography variant="h6">
                                Dosage
                            </Typography>
                        </Grid>
                        <Grid item >
                            <TextField
                                id="standard-size-normal"
                                variant="standard"
                                value={dosage}
                                onChange={(e)=>setDosage(e.target.value)}
                            />
                        </Grid>
                    </Grid>

                    <Grid item>
                        <Grid item >
                            <Typography variant="h6">
                                Frequency
                            </Typography>
                        </Grid>
                        <Grid item >
                            <TextField
                                id="standard-size-normal"
                                variant="standard"
                                value={frequency}
                                onChange={(e)=>setFrequency(e.target.value)}
                            />
                        </Grid>
                    </Grid>

                    <Grid item >
                        <Grid item >
                            <Typography variant="h6">
                                Duration
                            </Typography>
                        </Grid>
                        <Grid item >
                            <TextField
                                id="standard-size-normal"
                                variant="standard"
                                value={duration}
                                onChange={(e)=>setDuration(e.target.value)}
                            />
                        </Grid>
                    </Grid>

                    <Grid item >
                        <Grid item >
                            <Typography variant="h6">
                                Instructions
                            </Typography>
                        </Grid>
                        <Grid item >
                            <TextField
                                id="standard-size-normal"
                                variant="standard"
                                value={instructions}
                                onChange={(e)=>setInstructions(e.target.value)}
                            />
                        </Grid>
                    </Grid>

                </Grid>

                <Grid spacing={2} sx={{display:'flex', justifyContent:'space-between', p:3 }}>

                    <Grid item >
                        <Button variant="contained" onClick={add_row}>
                            Add
                        </Button>
                    </Grid>

                    <Grid item >
                        <Button variant="contained" color="error" onClick={clear_row}>
                            Clear
                        </Button>
                    </Grid>

                </Grid>

            </Box>
        )
    }

    return (
        <>
            <div className={dashboardStyles.mainDiv}>
            <Box sx={{ overflow:'hidden', flexGrow: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={4}>
                        <Item>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Item >
                                        <Autocomplete
                                            options={patients}
                                            getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                                            onChange={(event, newValue) => {
                                                setSelectedPatient(newValue);
                                            }}
                                            renderInput={(params) => (
                                                <TextField {...params} label="Patient" variant="outlined" fullWidth />
                                            )}
                                            renderOption={(props, option) => (
                                                <li {...props} key={option._id}>
                                                    {`${option.firstName} ${option.lastName}`}
                                                </li>
                                            )}
                                            filterOptions={(options, { inputValue }) => 
                                                options.filter((option) =>
                                                    `${option.firstName} ${option.lastName}`.toLowerCase().includes(inputValue.toLowerCase())
                                                )
                                            }
                                            
                                        />
                                    </Item>
                                </Grid>
                                <Grid item xs={12}>
                                    <Item >
                                        {render_profile_card()}
                                    </Item>
                                </Grid>
                            </Grid>
                        </Item>
                    </Grid>

                    <Grid item xs={12} sm={12} md={8}>
                        <Item>
                            <Grid container spacing={2} sx={{ p: 2 }}>
                                <Grid item xs={12}>
                                    <Item >
                                        {render_prescription_details_card()}
                                    </Item>
                                </Grid>

                                <Grid item xs={12}>
                                    <Item >
                                        {render_add_row()}
                                    </Item>
                                </Grid>

                                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
                                    <Button variant="contained" color="success" onClick={save_prescription}>
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

export default AddPrescription
