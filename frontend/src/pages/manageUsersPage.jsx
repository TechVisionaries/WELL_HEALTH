import * as React from 'react';
import { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Card, CardContent, TextField, FormControl, RadioGroup, FormControlLabel, Radio, InputAdornment, IconButton, Avatar, Button, Stack, List, Divider, Modal, Box, Breadcrumbs, Typography, MenuItem, Select, InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from '../components/sideBar';
import dashboardStyles from '../styles/dashboardStyles.module.css';
import ConditionalHeader from '../components/headers/conditionalHeader';
import { ImageToBase64 } from "../utils/ImageToBase64";
import styles from '../styles/loginStyles.module.css';
import { Delete, Sync, Visibility, VisibilityOff } from '@mui/icons-material';
import { LinearProgress } from '@mui/joy';
import LoadingButton from '@mui/lab/LoadingButton';
import { useRegisterMutation, useGetAllUsersQuery, useDeleteUserMutation } from '../slices/usersApiSlice'; // Added custom hooks
import { toast } from 'react-toastify';

const ManageUsersPage = () => {
    const [imagePath, setImagePath] = useState('./images/addProfile.png');
    const [image, setImage] = useState('');

    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [userType, setUserType] = useState('');
    const [workPlace, setWorkPlace] = useState('');
    const [department, setDepartment] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [gender, setGender] = useState('Male');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [register, { isLoading }] = useRegisterMutation();
    const { data: users, isLoading: usersLoading } = useGetAllUsersQuery(); // Fetching all users
    const [deleteUser] = useDeleteUserMutation(); // Delete user functionality
    const [filteredUsers, setFilteredUsers] = useState([]); // State for filtered users
    const [userTypeFilter, setUserTypeFilter] = useState(''); // State for user type filter


    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await register({
                email, image, firstName, lastName, password, userType, department, workPlace, specialization, gender
            }).unwrap();
            toast.success('Email Verification Sent!');
            document.getElementById("registerForm").style.display = "none";
            document.getElementById("emailSentMsg").style.display = "block";
        } catch (err) {
            toast.error(err.data?.message || err.error);
        }
    };

    const previewImage = async (e) => {
        setImagePath(URL.createObjectURL(e.target.files[0]));
        const data = await ImageToBase64(e.target.files[0]);
        setImage(data);
    };

    useEffect(() => {
        // Filter out users who are not patients
        const filtered = users?.filter(user => user.userType !== 'patient' && user.userType !== 'manager');
        setFilteredUsers(filtered);
    }, [users]);

    const handleDeleteUser = async (id) => {
        try {
            await deleteUser(id).unwrap();
            toast.success('User deleted successfully');
            setFilteredUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
        } catch (err) {
            toast.error('Failed to delete user');
        }
    };

    const handleFilterChange = (event) => {
        const selectedType = event.target.value;
        setUserTypeFilter(selectedType);
        const filtered = users?.filter(user => user.userType === selectedType || selectedType === '' && user.userType !== 'patient' && user.userType !== 'manager');
        setFilteredUsers(filtered);
    };

    return (
        <>
            <ConditionalHeader />
            <div className={dashboardStyles.mainDiv}>
                <Container className={dashboardStyles.container}>
                    <Row>
                        <Col>
                            <Breadcrumbs aria-label="breadcrumb" className="py-4 ps-3 mt-4 bg-primary-subtle">
                                <Typography color="text.primary"></Typography>
                            </Breadcrumbs>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} md={4}>
                            <Card>
                                <Breadcrumbs 
                                    aria-label="breadcrumb" 
                                    className="py-4 ps-3 mt-4" 
                                    style={{ backgroundColor: '#ea3367df', display: 'flex', justifyContent: 'center' }}>
                                    <Typography color="text.primary">Register New Users</Typography>
                                </Breadcrumbs>

                                <CardContent className={dashboardStyles.cardContent}>
                                    <form encType="multipart/form-data" onSubmit={submitHandler}>
                                        <Row>
                                            <TextField
                                                type="text"
                                                label="First Name"
                                                size="small"
                                                onChange={(e) => setFirstName(e.target.value)}
                                                className={styles.inputBox}
                                                variant="standard"
                                                required
                                            />
                                        </Row>
                                        <Row>
                                            <TextField
                                                type="text"
                                                label="Last Name"
                                                size="small"
                                                onChange={(e) => setLastName(e.target.value)}
                                                className={styles.inputBox}
                                                variant="standard"
                                            />
                                        </Row>
                                        <Row>
                                            <TextField
                                                type="email"
                                                label="Email Address"
                                                size="small"
                                                onChange={(e) => setEmail(e.target.value)}
                                                className={styles.inputBox}
                                                variant="standard"
                                                required
                                            />
                                        </Row>

                                        {/* User Type Selection */}
                                        <Row>
                                            <FormControl fullWidth className="mt-3">
                                                <InputLabel id="userType-label">User Type</InputLabel>
                                                <Select
                                                    labelId="userType-label"
                                                    value={userType}
                                                    onChange={(e) => setUserType(e.target.value)}
                                                    label="User Type"
                                                    required
                                                >
                                                    <MenuItem value="doctor">Doctor</MenuItem>
                                                    <MenuItem value="nurse">Nurse</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Row>

                                        {/* Conditional Fields based on User Type */}
                                        {userType === 'doctor' && (
                                            <>
                                                <Row>
                                                    <TextField
                                                        type="text"
                                                        label="Specialization"
                                                        size="small"
                                                        onChange={(e) => setSpecialization(e.target.value)}
                                                        className={styles.inputBox}
                                                        variant="standard"
                                                        required
                                                    />
                                                </Row>
                                            </>
                                        )}

                                        {(userType === 'doctor' || userType === 'nurse' || userType === 'manager') && (
                                            <>
                                                <Row>
                                                    <TextField
                                                        type="text"
                                                        label="Department"
                                                        size="small"
                                                        onChange={(e) => setDepartment(e.target.value)}
                                                        className={styles.inputBox}
                                                        variant="standard"
                                                        required
                                                    />
                                                </Row>
                                                <Row>
                                                    <TextField
                                                        type="text"
                                                        label="Workplace"
                                                        size="small"
                                                        onChange={(e) => setWorkPlace(e.target.value)}
                                                        className={styles.inputBox}
                                                        variant="standard"
                                                        required
                                                    />
                                                </Row>
                                            </>
                                        )}

                                        <Row>
                                            <FormControl className="mt-3">
                                                <RadioGroup
                                                    row
                                                    aria-labelledby="gender"
                                                    name="gender"
                                                    value={gender}
                                                    onChange={(e) => setGender(e.target.value)}
                                                >
                                                    <FormControlLabel value="Male" control={<Radio />} label="Male" />
                                                    <FormControlLabel value="Female" control={<Radio />} label="Female" />
                                                </RadioGroup>
                                            </FormControl>
                                        </Row>

                                        <Row>
                                            <TextField
                                                type={showPassword ? 'text' : 'password'}
                                                value={password}
                                                label="Password"
                                                size="small"
                                                onChange={(e) => setPassword(e.target.value)}
                                                className={styles.inputBox}
                                                variant="standard"
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                aria-label="toggle password visibility"
                                                                onClick={handleClickShowPassword}
                                                                onMouseDown={handleMouseDownPassword}
                                                            >
                                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                required
                                            />
                                            <Stack spacing={0.5}>
                                                <LinearProgress determinate size="sm" value={Math.min((password.length * 100) / 10, 100)} />
                                            </Stack>
                                        </Row>

                                        <center>
                                            <LoadingButton
                                                type="submit"
                                                loading={isLoading}
                                                color="primary"
                                                variant="contained"
                                                className="mt-3"
                                            >
                                                Add User
                                            </LoadingButton>
                                        </center>
                                    </form>
                                </CardContent>
                            </Card>
                        </Col>

                        <Col xs={12} md={8}>
                        <Card>
                <CardContent>
                <Breadcrumbs 
                                    aria-label="breadcrumb" 
                                    className="py-4 ps-3 mt-2" 
                                    style={{ backgroundColor: '#ea3367df', display: 'flex', justifyContent: 'center' }}>
                                    <Typography color="text.primary">All Staff</Typography>
                                </Breadcrumbs>
                    {/* Radio Buttons to Filter by User Type */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                        <RadioGroup row value={userTypeFilter} onChange={handleFilterChange}>
                            <FormControlLabel value="" control={<Radio />} label="All" />
                            <FormControlLabel value="doctor" control={<Radio />} label="Doctor" />
                            <FormControlLabel value="nurse" control={<Radio />} label="Nurse" />
                        </RadioGroup>
                    </div>


                    {/* Loading Indicator */}
                    {usersLoading ? (
                        <Typography>Loading...</Typography>
                    ) : (
                        /* Table to Display Users */
                        <TableContainer component={Paper} style={{ maxHeight: '360px', overflowY: 'scroll' }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>First Name</TableCell>
                                        <TableCell>Last Name</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>User Type</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredUsers?.map((user) => (
                                        <TableRow key={user._id}>
                                            <TableCell>{user.firstName}</TableCell>
                                            <TableCell>{user.lastName}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>{user.userType}</TableCell>
                                            <TableCell>
                                                <IconButton color="error" onClick={() => handleDeleteUser(user._id)}>
                                                    <Delete />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </CardContent>
            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
};

export default ManageUsersPage;
