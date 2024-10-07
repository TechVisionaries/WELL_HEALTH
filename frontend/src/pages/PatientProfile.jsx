import { Avatar, Box, Button, FormControlLabel, Grid, Radio, RadioGroup, TextField, Typography } from "@mui/material"
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

function PatientProfile() {

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

    function render_medical(){

        return(
          <Box sx={{ flexGrow: 1 }}>

            <Grid container spacing={2} sx={{p:4}}>

                <Grid item xs={12} sx={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                        <Typography variant="h6">
                            Medical
                        </Typography>
                </Grid>

              <Grid item xs={12} sx={{display:'flex',flexDirection:'row', justifyContent:'space-between'}}>
                  <Typography variant='h7'xs={6} sx={{fontWeight:'bold'}}>
                    Hospital : 
                  </Typography>
                  <Typography variant='h7' xs={6}>
                    {`Hospital name`}
                  </Typography>
              </Grid>
              <Grid item xs={12} sx={{display:'flex',flexDirection:'row', justifyContent:'space-between'}}>
                <Typography variant='h7'xs={6} sx={{fontWeight:'bold'}}>
                    Blood Group : 
                  </Typography>
                  <Typography variant='h7' xs={6}>
                    {`A-`}
                  </Typography>
              </Grid>
    
              <Grid item xs={12} sx={{display:'flex',flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                <Typography variant='h7'xs={6} sx={{fontWeight:'bold'}}>
                    Diabetes : 
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
                    B. Pressure : 
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
                    Eye Pressure : 
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
              
            </Grid>
          </Box>
        )
    }

    function render_reports(){

        return(
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2} sx={{p:4}}>

                <Grid item xs={12} sx={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                    <Typography variant="h6">
                        Reports
                    </Typography>
                </Grid>
              
    
                <Grid item xs={12} sx={{display:'flex',flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                    <Typography variant='h7'xs={6} sx={{fontWeight:'bold'}}>
                        Blood Report : 
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
                        Urine Report : 
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
                        X-Ray : 
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

                <Grid item xs={12} sx={{display:'flex', justifyContent:'flex-end'}}>
                    <Button variant="contained" startIcon={<EditIcon />}>
                        Edit
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

                    <Grid item xs={12} sx={{display:'flex', justifyContent:'flex-end'}}>
                        <Button variant="contained" color="success">
                            Add Prescription
                        </Button>
                    </Grid>

                    <Grid item xs={12}>

                        <Grid container spacing={2}>

                            <Grid item xs={6}>
                                <Item>
                                {render_medical()}
                                </Item>
                            </Grid>

                            <Grid item xs={6}>
                                <Item>
                                {render_reports()}
                                </Item>
                            </Grid>

                        </Grid>

                    </Grid>

                </Grid>

            </Grid>

        </Grid>
      </Box>
    </div>
  )
}

export default PatientProfile
