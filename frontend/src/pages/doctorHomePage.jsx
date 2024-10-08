import Header from '../components/header';
import { useEffect, useState } from "react";
import { Container, Row, Col, Form, Toast } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import CountUp from "react-countup";
import homeStyles from '../styles/homePageStyles.module.css'
import { Card, CardContent, IconButton } from '@mui/material';
import { BsChevronDoubleDown } from 'react-icons/bs';
import HealthCard from '../components/HealthCard';


const DoctorHomePage = () => {

    const [show, setShow] = useState(false);
    const [hopitalcount, setHospitalCount] = useState(0);
    const [doctorcount, setDoctorCount] = useState(0);
    const [userCount, setUserCount] = useState(0);

    const navigate = useNavigate();

    const scrollToAnimHeader = () => {
        const animHeaderElement = document.getElementById('animHeader');
        if (animHeaderElement) {
            animHeaderElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

    let timeout;
    const handleScroll = () => {
        if (timeout) {
            clearTimeout(timeout);
        }

        timeout = setTimeout(() => {
            if (document.getElementById("main").scrollTop > 500) {
                setShow(false);
                setDoctorCount(0)
                setHospitalCount(0)
                setUserCount(0)
            } else {
                setShow(true);
                setDoctorCount(347)
                setHospitalCount(26)
                setUserCount(1987)
            }
        }, 10);
    };

    useEffect(() => {
        document.getElementById("main").addEventListener("scroll", handleScroll);
        setTimeout(() => {
            setShow(true)
            setDoctorCount(347)
            setHospitalCount(26)
            setUserCount(1987)
        }, 1);
    }, []);

    return (
        <>
            <div style={{ width: '100%' }} id='top'>
                <Header />
                <HealthCard/>
                <div style={{ minHeight: '100vh', height: '200vh' }}>
                    <div className={homeStyles.homeBackDiv}>
                        <img src={'images/homeBackground2.png'} width={"100%"} />
                        <img src={'images/hospital_staff_bg.png'} width={"50%"} style={{position: 'absolute', right: 0, top: '110px'}} />
                    </div>
                    <div style={{ height: '600px', width: "100%", position: 'absolute' }}>
                    <Col className={homeStyles.homeWelcText} style={{transition:'all 0.5s ease-in', ...(show? {opacity:1} : {opacity:0})}}>
                    <center>
                            <h2>A safe and secure place to keep<br />your key health information, available to you<br />and your healthcare providers anytime,<br />including in an emergency<br /><span style={{ fontFamily: 'Papyrus', display:'block', marginTop:'25px', color:"#f5427e" }}>WellHealth.LK.Doctor</span></h2>
                            <Button onClick={() => navigate('/login')} variant='contained' color='info' className={homeStyles.welcBtns} style={{clipPath:'polygon(95% 0%, 80% 100%, 0% 100%, 0% 0%)', padding:'15px'}}>&nbsp;&nbsp;&nbsp;&nbsp;LOGIN&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Button>
                            <Button onClick={() => navigate('/register')} variant='contained' color='warning' className={homeStyles.welcBtns} style={{clipPath:'polygon(100% 0%, 100% 100%, 5% 100%, 20% 0%)', marginLeft:'-45px', padding:'15px'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;REGISTER</Button>
                    </center>
                    </Col>
                        <Card style={{position:'absolute', top: '450px', marginLeft:'7.5%', width:'500px', background:'#e3f2ff'}}>
                            <CardContent style={{display:'flex', padding:'16px'}}>
                                <Row style={{width:'100%'}}>
                                    <Col style={{textAlign:'center'}}>
                                        <h1><CountUp duration={1} className="counter" end={hopitalcount} /></h1>
                                        Hopitals
                                    </Col>
                                    <Col style={{textAlign:'center'}}>
                                        <h1><CountUp duration={1} className="counter" end={doctorcount} /></h1>
                                        Doctors
                                    </Col>
                                    <Col style={{textAlign:'center'}}>
                                        <h1><CountUp duration={1} className="counter" end={userCount} /></h1>
                                        Users
                                    </Col>
                                </Row>
                            </CardContent>
                        </Card>
                        <IconButton style={{top:'550px', left:'50%'}} color='warning' onClick={scrollToAnimHeader}><BsChevronDoubleDown /></IconButton>
                    </div>
                    <div className={homeStyles.servicesDiv}  id="animHeader">
                        <center style={{ marginTop: '2%' }}>
                            <Row style={{ margin: '5%' }}>
                                <h1 className={homeStyles.h1}>Our Services</h1>
                            </Row>
                            <Row style={{ margin: '0px 8%' }}>
                                <Col>
                                    <div className={homeStyles.doDivs}>
                                        <div className={homeStyles.doDivsimgDiv}>
                                            <img src={'images/payments.png'} width={'100%'} height={'150px'} style={{objectFit:'cover'}} />
                                        </div>
                                        <div>
                                            <p className={homeStyles.doDivP}>Easy payments</p>
                                            <p style={{textAlign:'left', lineHeight:'28px', color:'black'}}>The payment portal is effortlessly user-friendly, ensuring smooth and secure transactions for everyone. With its intuitive interface and simplicity, users can navigate the process seamlessly, fostering trust and satisfaction.</p>
                                        </div>
                                    </div>
                                </Col>
                                <Col>
                                        <div className={homeStyles.doDivs}>
                                            <div className={homeStyles.doDivsimgDiv}>
                                                <img src={'images/digitlHealthCard.jpg'} width={'100%'} height={'150px'} style={{objectFit:'cover'}} />
                                            </div>
                                            <div>
                                                <p className={homeStyles.doDivP}>Digital Health Card</p>
                                                <p style={{textAlign:'left', lineHeight:'28px', color:'black'}}>A Digital Health Card stores a person's medical records, insurance details, and health history. It enables easy access to healthcare services, secure sharing of health data with medical providers, and streamlines processes like appointments.</p>
                                            </div>
                                        </div>
                                </Col>

                                <Col>
                                    <Link to={'/search'} style={{textDecoration:'none'}}>
                                        <div className={homeStyles.doDivs}>
                                            <div className={homeStyles.doDivsimgDiv}>
                                                <img src={'images/onlineAppoinments.jpg'} width={'100%'} height={'150px'} style={{objectFit:'cover'}} />
                                            </div>
                                            <div>
                                                <p className={homeStyles.doDivP}>Onine Appoinment Scheduling</p>
                                                <p style={{textAlign:'left', lineHeight:'28px', color:'black'}}>Online doctor appointment service allow patients to schedule, reschedule, or cancel medical appointments with Well Health providers. It provides convenience, reduces waiting times, and offers features like video consultations, reminders, and secure patient data management.</p>
                                            </div>
                                        </div>
                                    </Link>
                                </Col>

                                <Col>
                                    <Link to={'/owner/boardings'} style={{textDecoration:'none'}}>
                                        <div className={homeStyles.doDivs}>
                                            <div className={homeStyles.doDivsimgDiv}>
                                                <img src={'images/digitalHealthResords.jpg'} width={'100%'} height={'150px'} style={{objectFit:'cover'}} />
                                            </div>
                                            <div>
                                                <p className={homeStyles.doDivP}>Digital Health Records</p>
                                                <p style={{textAlign:'left', lineHeight:'28px', color:'black'}}>A Digital Health Record as a service allows users to securely store, manage, and access their medical history and health data online. It facilitates easy sharing of records with healthcare providers, tracks medical appointments, and supports integration with other health services for better care management.</p>
                                            </div>
                                        </div>
                                    </Link>
                                </Col>

                            </Row>
                        </center>
                    </div>
                </div>
            </div>
        </>
    );
}

export default DoctorHomePage;