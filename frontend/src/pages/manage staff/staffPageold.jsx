import {
  Breadcrumbs,
  Card,
  Container,
  FormControl,
  InputLabel,
  Link,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import Sidebar from "../../components/sideBar";
import dashboardStyles from "../../styles/dashboardStyles.module.css";
import { Col, Row } from "react-bootstrap";
import { CalendarMonth, NavigateNext } from "@mui/icons-material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";
import dayjs from "dayjs";

const StaffPage = () => {
  const [shift, setShift] = useState({ date: dayjs(), time: "" });
  return (
    <>
      <Sidebar />
      <div className={dashboardStyles.mainDiv}>
        <Container className={dashboardStyles.container}>
          <Row>
            <Col>
              <Breadcrumbs
                separator={<NavigateNext fontSize="small" />}
                aria-label="breadcrumb"
                className="py-2 ps-3 mt-4 bg-primary-subtle"
              >
                <Link underline="hover" key="1" color="inherit" href="/">
                  Home
                </Link>
                ,
                <Link underline="hover" key="2" color="inherit" href="/profile">
                  Manager
                </Link>
                ,
                <Typography key="3" color="text.primary">
                  Staff
                </Typography>
              </Breadcrumbs>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card
                className={`mt-5 p-3 text-center`}
              >
                <Row>
                    <Col>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']} sx={{float: 'right'}}>
                                <DatePicker
                                    label="Date"
                                    value={shift.date}
                                    onChange={(newValue) => setValue(newValue)}
                                />
                            </DemoContainer>
                        </LocalizationProvider>
                    </Col>
                
                    <Col>
                        <FormControl sx={{ m: 1, minWidth: 250, float:'left' }}>
                            <InputLabel>
                                Shift
                            </InputLabel>
                            <Select
                                value={shift.time}
                                label="shift"
                                onChange={(e) => setShift({ ...shift, time: e.target.value })}
                            >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value={10}>07:00 AM - 03:00 PM</MenuItem>
                            <MenuItem value={20}>03:00 PM - 11:00 PM</MenuItem>
                            <MenuItem value={30}>11:00 PM - 07:00 AM</MenuItem>
                            </Select>
                        </FormControl>
                    </Col>
                </Row>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card
                className={`mt-3 py-3 text-center`}
                style={{ height: "calc(100vh - 300px)" }}
              >
                Staff Overview
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default StaffPage;
