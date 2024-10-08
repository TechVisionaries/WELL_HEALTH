import ManagerHeader from '../components/managerHeader';
import { useEffect, useState } from "react";
import { Container, Row, Col, Form, Toast } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import CountUp from "react-countup";
import homeStyles from '../styles/homePageStyles.module.css'
import { Card, CardContent, IconButton } from '@mui/material';
import { BsChevronDoubleDown } from 'react-icons/bs';
import HealthCard from '../components/HealthCard';


const ManagerHomePage = () => {

    const [show, setShow] = useState(false);
    const [staffcount, setStaffCount] = useState(0);
    const [doctorcount, setDoctorCount] = useState(0);
    const [traineeCount, setTraineeCount] = useState(0);

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
                setStaffCount(0)
                setTraineeCount(0)
            } else {
                setShow(true);
                setDoctorCount(347)
                setStaffCount(812)
                setTraineeCount(987)
            }
        }, 10);
    };

    useEffect(() => {
        document.getElementById("main").addEventListener("scroll", handleScroll);
        setTimeout(() => {
            setShow(true)
            setDoctorCount(347)
            setStaffCount(812)
            setTraineeCount(987)
        }, 1);
    }, []);

    return (
        <>
            <div style={{ width: '100%' }} id='top'>
                <ManagerHeader />
                <HealthCard/>
                <div style={{ minHeight: '100vh', height: '200vh' }}>
                    <div className={homeStyles.homeBackDiv}>
                        <img src={'images/homeBackground2.png'} width={"100%"} />
                        <img src={'images/manager_home_bg.png'} width={"50%"} style={{position: 'absolute', right: 0, top: '10px'}} />
                    </div>
                    <div style={{ height: '600px', width: "100%", position: 'absolute' }}>
                    <Col className={homeStyles.homeWelcText} style={{transition:'all 0.5s ease-in', ...(show? {opacity:1} : {opacity:0})}}>
                    <center>
                            <h2><span style={{ fontFamily: 'Papyrus', display:'block', marginTop:'25px', color:"#f5427e" }}>...Welcome Back Manager...</span>A safe and secure place to keep and<br />Manage Appoinments and medical data<br />  available to you and <br />your system users anytime,<br />including in an emergency<br /></h2>
                    </center>
                    </Col>
                        <Card style={{position:'absolute', top: '450px', marginLeft:'7.5%', width:'500px', background:'#e3f2ff'}}>
                            <CardContent style={{display:'flex', padding:'16px'}}>
                                <Row style={{width:'100%'}}>
                                <Col style={{textAlign:'center'}}>
                                        <h1><CountUp duration={1} className="counter" end={doctorcount} /></h1>
                                        Doctors
                                    </Col>
                                    <Col style={{textAlign:'center'}}>
                                        <h1><CountUp duration={1} className="counter" end={staffcount} /></h1>
                                        Staff
                                    </Col>
                                    <Col style={{textAlign:'center'}}>
                                        <h1><CountUp duration={1} className="counter" end={traineeCount} /></h1>
                                        Trainee
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

export default ManagerHomePage;