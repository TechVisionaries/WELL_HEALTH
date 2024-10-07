import { Avatar, Box, Button, Grid, TextField, Typography } from "@mui/material"
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { useMainContext } from "../context/hooks";
import EditIcon from '@mui/icons-material/Edit';

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

    const {user} = useMainContext()

    function render_profile_card(){

        return(
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2} sx={{p:4}}>

                    <Grid item xs={12}>
                        <div style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                            <Avatar alt="USER" variant="square" sx={{width:'50%', height:'15vh'}}>
                                {user?user.fullName:"U"}
                            </Avatar>
                            <Typography variant="h6">
                                {user? user.fullName : "User Name"}
                            </Typography>
                        </div>
                    </Grid>

                    <Grid item xs={12} >
                        <TextField
                            id="standard-size-normal"
                            defaultValue="Height : "
                            variant="standard"
                            sx={{width:'100%', p:2}}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            id="standard-size-normal"
                            defaultValue="Weight : "
                            variant="standard"
                            sx={{width:'100%', p:2}}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            id="standard-size-normal"
                            defaultValue="Marital Status : "
                            variant="standard"
                            sx={{width:'100%', p:2}}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            id="standard-size-normal"
                            defaultValue="Home Town : "
                            variant="standard"
                            sx={{width:'100%', p:2}}
                        />
                    </Grid>

                    <Grid item xs={12} sx={{display:'flex', justifyContent:'flex-end'}}>
                        <Button variant="contained" startIcon={<EditIcon />}>
                            Edit
                        </Button>
                    </Grid>

                </Grid>
            </Box>
        )
    }

    function render_profile_details_card(){

        return(
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2} >

                    <Grid item xs={12} >
                        <TextField
                            id="standard-size-normal"
                            defaultValue="Height : "
                            variant="standard"
                            sx={{width:'100%', p:1}}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            id="standard-size-normal"
                            defaultValue="Weight : "
                            variant="standard"
                            sx={{width:'100%', p:1}}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            id="standard-size-normal"
                            defaultValue="Marital Status : "
                            variant="standard"
                            sx={{width:'100%', p:1}}
                        />
                    </Grid>
                    <Grid item xs={12} >
                        <TextField
                            id="standard-size-normal"
                            defaultValue="Home Town : "
                            variant="standard"
                            sx={{width:'100%', p:1}}
                        />
                    </Grid>

                    <Grid item xs={12} sx={{display:'flex', justifyContent:'flex-end'}}>
                        <Button variant="contained" startIcon={<EditIcon />}>
                            Edit
                        </Button>
                    </Grid>

                </Grid>
            </Box>
        )
    }

    function render_add_row(){

        return(
            
            <Box sx={{ flexGrow: 1 }}>

                <Grid spacing={2} sx={{display:'flex', flexDirection:'row', justifyContent:'space-evenly'}}>

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
                            />
                        </Grid>
                    </Grid>

                </Grid>

                <Grid spacing={2} sx={{display:'flex', justifyContent:'space-between', p:3 }}>

                    <Grid item >
                        <Button variant="contained">
                            Add
                        </Button>
                    </Grid>

                    <Grid item >
                        <Button variant="contained" color="error">
                            Clear
                        </Button>
                    </Grid>

                </Grid>

            </Box>
        )
    }

  return (
    <div>

        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2} >

                <Grid item xs={4}>
                    <Item>
                        {render_profile_card()}
                    </Item>
                </Grid>

                <Grid item xs={8}>

                    <Grid container spacing={2} sx={{p:4}}>

                        <Grid item xs={12}>
                            <Item>
                                {render_profile_details_card()}
                            </Item>
                        </Grid>

                        <Grid item xs={12}>

                            <Item>
                                {render_add_row()}
                            </Item>

                        </Grid>

                        <Grid item xs={12} sx={{display:'flex', flexDirection:'row', justifyContent:'end', p:3 }}>

                            <Grid >
                                <Button variant="contained" color="success">
                                    Save Prescription
                                </Button>
                            </Grid>

                        </Grid>

                    </Grid>

                </Grid>

            </Grid>
        </Box>
      
    </div>
  )
}

export default AddPrescription
