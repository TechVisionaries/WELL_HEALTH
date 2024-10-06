
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Avatar, Divider, FormControlLabel, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import { useMainContext } from '../context/hooks';
import QRCode from "react-qr-code";
import AssignmentIcon from '@mui/icons-material/Assignment';

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

function HealthCardPage() {

  const {user} = useMainContext()


  function render_profile_card(){

    return(
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2} sx={{p:4}}>
          <Grid item xs={12}>
            {/* <Item> */}
              <Typography variant='h6'>
                {`Hello ${user? user.fullName: 'User'} here is your health card..`}
              </Typography>
            {/* </Item> */}
          </Grid>
          <Grid item xs={12}>
            <Item sx={{p:6}}>
            <QRCode
              size={256}
              style={{ height: "20vh", maxWidth: "100%", width: "100%" }}
              value={user?user:'Undefined'}
              viewBox={`0 0 256 256`}
            />
            </Item>
          </Grid>
          <Grid item xs={12} >
            <TextField
              id="standard-size-normal"
              defaultValue="Name : "
              variant="standard"
              sx={{width:'100%', p:2}}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="standard-size-normal"
              defaultValue="NIC : "
              variant="standard"
              sx={{width:'100%', p:2}}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="standard-size-normal"
              defaultValue="Age : "
              variant="standard"
              sx={{width:'100%', p:2}}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="standard-size-normal"
              defaultValue="Contact : "
              variant="standard"
              sx={{width:'100%', p:2}}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="standard-size-normal"
              defaultValue="Emergency : "
              variant="standard"
              sx={{width:'100%', p:2}}
            />
          </Grid>
        </Grid>
      </Box>
    )
  }

  function render_medical_card(){

    return(
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2} sx={{p:4}}>
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

          <Grid item xs={12} sx={{display:'flex',flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
            <Typography variant='h7'xs={6} sx={{fontWeight:'bold'}}>
                Heart Trouble : 
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
          </Grid>

          <Grid item xs={12} sx={{display:'flex',flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
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
          </Grid>

          <Grid container spacing={2} sx={{p:4}}>
            <Grid item xs={12} sx={{display:'flex',flexDirection:'row', justifyContent:'center'}}>
                  <Typography variant='h6'xs={6} sx={{fontWeight:'bold'}}>
                    Allergy Drugs
                  </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='h7' sx={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                Rapidisol
              </Typography>
              <Divider/>
              <Typography variant='h7' sx={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
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
              <Divider/>
            </Grid>
          </Grid>
          
        </Grid>
      </Box>
    )
  }
  
  function most_recent_medical_records(){

    return(
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2} >
          <Grid item xs={12} sx={{p:2}}>
            {/* <Item> */}
              <Typography variant='h6'>
                Most Recent Medical Records
              </Typography>
            {/* </Item> */}
          </Grid>

          <Grid item xs={12} sx={{display:'flex',alignItems:'center', justifyContent:'flex-start'}}>
              <Typography variant='h7'xs={6} sx={{fontWeight:'bold'}}>
                Date :  
              </Typography>
              <Typography variant='h7' xs={6}>
                {` 24-09-2025`}
              </Typography>
          </Grid>

          <Grid item xs={12} sx={{display:'flex',alignItems:'center', justifyContent:'flex-start'}}>
            <Typography variant='h7'xs={6} sx={{fontWeight:'bold'}}>
                Consultant :  
            </Typography>
            <Typography variant='h7' xs={6}>
              {` Sergon Kamal Kodikara`}
            </Typography>
          </Grid>

          <Grid item xs={12} sx={{display:'flex',alignItems:'center', justifyContent:'flex-start'}}>
            <Typography variant='h7'xs={6} sx={{fontWeight:'bold'}}>
                Sickness :  
            </Typography>
            <Typography variant='h7' xs={6}>
              {` Influenza Beta Rapid`}
            </Typography>
          </Grid>

          <Grid item xs={12} sx={{ display:'flex', justifyContent:'center', width:'100%'}} >
            <Item sx={{width:'100%',p:3}} >
              <Typography variant='h7' sx={{p:1, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                Rapidisol 5mg
              </Typography>
              <Divider/>
              <Typography variant='h7' sx={{p:1,display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                Ammoxiline 150mg
              </Typography>
              <Divider/>
              <Typography variant='h7' sx={{p:1,display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                Rapidisol 500mg
              </Typography>
              <Divider/>
              <Typography variant='h7' sx={{p:1,display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                Ammoxiline 500mg
              </Typography>
              <Divider/>
            </Item>
          </Grid>

        </Grid>
      </Box>
    )
  }

  function most_recent_test_reports(){

    return(
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2} >
          <Grid item xs={12} sx={{p:2}}>
            {/* <Item> */}
              <Typography variant='h6'>
                Most Recent Test Reports
              </Typography>
            {/* </Item> */}
          </Grid>

          <Grid item xs={12} sx={{display:'flex',alignItems:'center', justifyContent:'flex-start'}}>
              <Typography variant='h7'xs={6} sx={{fontWeight:'bold'}}>
                Date :  
              </Typography>
              <Typography variant='h7' xs={6}>
                {` 24-09-2025`}
              </Typography>
          </Grid>

          <Grid item xs={12} sx={{display:'flex',alignItems:'center', justifyContent:'space-around'}}>
            <div>
              <Avatar >
                <AssignmentIcon />
              </Avatar>
              <span>FBC</span>
            </div>

            <div>
              <Avatar >
                <AssignmentIcon />
              </Avatar>
              <span>RBS</span>
            </div>

            <div>
              <Avatar >
                <AssignmentIcon />
              </Avatar>
              <span>CRP</span>
            </div>
              
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
          <Grid item xs={4}>
            <Item>
              {render_medical_card()}
            </Item>
          </Grid>
          <Grid item xs={4}>
            <Grid container spacing={2} >
              <Grid item xs={12}>
                <Item>
                  {most_recent_medical_records()}
                </Item>
              </Grid>
              <Grid item xs={12}>
                <Item>
                  {most_recent_test_reports()}
                </Item>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </div>
  )
}

export default HealthCardPage
