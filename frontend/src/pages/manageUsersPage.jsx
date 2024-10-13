import * as React from 'react';
import { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, TextField, FormControl, RadioGroup, FormControlLabel, Radio, InputAdornment, IconButton, Avatar, Button, Stack, List, Divider, Modal, Box, Breadcrumbs, Typography } from '@mui/material';
import { Container, Form, Row, Col } from 'react-bootstrap';
import Sidebar from '../components/sideBar';
import dashboardStyles from '../styles/dashboardStyles.module.css';
import ManagerHeader from '../components/managerHeader';
import { ImageToBase64 } from "../utils/ImageToBase64";
import styles from '../styles/loginStyles.module.css';
import { Delete, Sync, Visibility, VisibilityOff } from '@mui/icons-material';
import { LinearProgress } from '@mui/joy';
import LoadingButton from '@mui/lab/LoadingButton';
import { useGoogleLoginMutation, useRegisterMutation } from '../slices/usersApiSlice';

const ManageUsersPage = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const [imagePath, setImagePath] = useState('./images/addProfile.png');
    const [image, setImage] = useState('');
    
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [occupation, setOccupation] = useState('');
    const [maritalState, setMaritalState] = useState('');
    const [workPlace, setWorkPlace] = useState('');
    const [department, setDepartment] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [birthday, setBirthday] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('Male');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isGoogleLoadingPatient, setIsGoogleLoadingPatient] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [register, { isLoading }] = useRegisterMutation();

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
        } else if (password.length < 8) {
            toast.error('Password is too short');
        } else {
            try {
                const res = await register({ email, image, firstName, lastName, password, userType: "user", gender }).unwrap();
                toast.success('Email Verification Sent!');
                document.getElementById("registerForm").style.display = "none";
                document.getElementById("emailSentMsg").style.display = "block";
            } catch (err) {
                toast.error(err.data?.message || err.error);
            }
        }
    };

    useEffect(() => {
        // Set up the page's state based on user info
        setEmail(userInfo.email);
        setFirstName(userInfo.firstName);
        setLastName(userInfo.lastName);
        setOccupation(userInfo.occupation);
        setMaritalState(userInfo.maritalState);
        setWorkPlace(userInfo.workPlace);
        setDepartment(userInfo.department);
        setSpecialization(userInfo.specialization);
        setBirthday(userInfo.birthday);
        setAge(userInfo.age);
    }, [userInfo]);

    const previewImage = async (e) => {
        setImagePath(URL.createObjectURL(e.target.files[0]));
        const data = await ImageToBase64(e.target.files[0]);
        setImage(data);
    };

    const ownerGoogleLoginSuccess = async (res) => {
        fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${res.access_token}`,
            },
        })
            .then(response => response.json())
            .then(async (data) => {
                const userInfo = {
                    email: data.email,
                    image: data.picture,
                    firstName: data.given_name,
                    lastName: data.family_name,
                    userType: "owner",
                };

                try {
                    setIsGoogleLoadingPatient(true);
                    const googleRes = await googleLogin({ ...userInfo }).unwrap();
                    dispatch(setUserInfo({ ...googleRes }));
                    toast.success('Login Successful');
                    navigate('/');
                } catch (err) {
                    setIsGoogleLoadingPatient(false);
                    toast.error(err.data?.message || err.error);
                }
            })
            .catch(error => {
                toast.error("Error fetching user profile:", error);
            });
    };

    return (
        <>
            <ManagerHeader />
            <div className={dashboardStyles.mainDiv}>
                <Container className={dashboardStyles.container}>
                    <Row>
                        <Col>
                            <Breadcrumbs aria-label="breadcrumb" className="py-4 ps-3 mt-4 bg-primary-subtle">
                                <Typography color="text.primary">New Page</Typography>
                            </Breadcrumbs>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} md={4}>
                            <Card>
                                <CardContent className={dashboardStyles.cardContent}>
                                    <form encType="multipart/form-data" onSubmit={submitHandler}>
                                        <Form.Group controlId="formFile" className="mb-0 text-center">
                                            <Form.Label className="mb-0">
                                                <Avatar 
                                                    alt={`${firstName} ${lastName}`} 
                                                    src={imagePath} 
                                                    sx={{ width: 200, height: 200, cursor: 'pointer' }} 
                                                />
                                            </Form.Label>
                                            <Form.Control type="file" accept="image/*" onChange={previewImage} hidden />
                                        </Form.Group>

                                        <Row>
                                            <Col xs={12} md={6}>
                                                <TextField
                                                    type="text"
                                                    value={firstName}
                                                    label="First Name"
                                                    size="small"
                                                    onChange={(e) => setFirstName(e.target.value)}
                                                    className={styles.inputBox}
                                                    variant="standard"
                                                    required
                                                />
                                            </Col>
                                            <Col xs={12} md={6}>
                                                <TextField
                                                    type="text"
                                                    value={lastName}
                                                    label="Last Name"
                                                    size="small"
                                                    onChange={(e) => setLastName(e.target.value)}
                                                    className={styles.inputBox}
                                                    variant="standard"
                                                />
                                            </Col>
                                        </Row>

                                        <Row>
                                            <TextField
                                                type="email"
                                                value={email}
                                                label="Email Address"
                                                size="small"
                                                onChange={(e) => setEmail(e.target.value)}
                                                className={styles.inputBox}
                                                variant="standard"
                                                required
                                            />
                                        </Row>

                                        <Row className="ms-1">
                                            <FormControl className="mt-3">
                                                <RadioGroup row aria-labelledby="gender" name="gender" value={gender} onChange={(e) => setGender(e.target.value)}>
                                                    <FormControlLabel value="Male" control={<Radio />} label="Male" />
                                                    <FormControlLabel value="Female" control={<Radio />} label="Female" />
                                                </RadioGroup>
                                            </FormControl>
                                        </Row>

                                        <Row>
                                            <Col xs={12} md={6}>
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
                                                    <Typography>{password.length < 3 ? 'Very weak' : password.length < 8 ? 'Weak' : password.length < 10 ? 'Strong' : 'Very strong'}</Typography>
                                                </Stack>
                                            </Col>
                                            <Col xs={12} md={6}>
                                                <TextField
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={confirmPassword}
                                                    label="Confirm Password"
                                                    size="small"
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                                            </Col>
                                        </Row>

                                        <center>
                                            <LoadingButton type="submit" loading={isLoading} color="primary" variant="contained" className="mt-3">
                                                Add User
                                            </LoadingButton>
                                        </center>
                                    </form>
                                </CardContent>
                            </Card>
                        </Col>

                        <Col xs={12} md={8}>
                            <Card>
                                <CardContent className={dashboardStyles.cardContent}>
                                    <List sx={{ width: '100%' }}>
                                        <Row className="py-3">
                                            <Col><b>Full Name</b></Col>
                                            <Col>{`${firstName} ${lastName}`}</Col>
                                        </Row>
                                        <Divider />
                                        {/* Add other rows for birthday, age, etc */}
                                    </List>
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
