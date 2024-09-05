import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from './context/authContext'
import '../assets/css/treeDiagram.css';
import { Grid, Box, Tooltip, IconButton, Button, } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography'
import ListItemIcon from '@mui/material/ListItemIcon';
import GroupIcon from '@mui/icons-material/Group';
import axios from 'axios';
import { BASE_URL } from '..//helpers/config';
import { toast } from 'react-toastify';
import { set } from 'react-hook-form';
import { Calendar, dayjsLocalizer, momentLocalizer, Views } from 'react-big-calendar'
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ContentPasteGoIcon from '@mui/icons-material/ContentPasteGo';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import ReportOffIcon from '@mui/icons-material/ReportOff';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { startOfYear, endOfYear, addMonths, format } from 'date-fns';
import YearView from './custom/YearView';
import DailysTable from './Containers/HomeDashboard/ListaDailysTable';
import dayjs from 'dayjs';
import "dayjs/locale/es";
import moment from 'moment-timezone';
import Carousel from 'react-material-ui-carousel'
import './Containers/HomeDashboard/style.css'
import BusinessIcon from '@mui/icons-material/Business';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import tecnologiaImg from '../assets/img/tecnologia.png';
import DTSimg from '../assets/img/dtsLogo.png';
import WTSimg from '../assets/img/WTSLogo.png';
import EmailIcon from '@mui/icons-material/Email';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import { useNavigate } from 'react-router-dom';






const styles = {

    cardDiv1: {
        boxSizing: 'border-box',
        display: 'flex',
        flexFlow: 'wrap',
        marginTop: '-24px',
        width: 'calc(100% + 24px)',
        maxWidth: 'calc(100% + 24px)',
        marginLeft: '-24px',
    },
    cardDiv2: {
        paddingLeft: '24px',
        paddingTop: '24px',
        width: 'calc(100% - 24px)',

        boxSizing: 'border-box',
        margin: '0px'
    },
    cardDiv3: {
        marginBottom: '12px',
        opacity: 1,
        background: 'transparent',
        color: 'rgb(52, 71, 103)',
        boxShadow: 'none',
    },
    cardDiv4: {
        color: 'rgba(0, 0, 0, 0.87)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        minWidth: '0px',
        overflowWrap: 'break-word',
        backgroundColor: 'rgb(255, 255, 255)',
        backgroundClip: 'border-box',
        boxShadow: 'rgba(0, 0, 0, 0.1) 0rem 0.25rem 0.375rem -0.0625rem, rgba(0, 0, 0, 0.06) 0rem 0.125rem 0.25rem -0.0625rem',
        transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        borderWidth: '0px',
        borderStyle: 'solid',
        borderColor: 'rgba(0, 0, 0, 0.125)',
        borderImage: 'initial',
        borderRadius: '0.75rem',
        overflow: 'visible',
    },
    cardDiv5: {
        display: 'flex',
        WebkitBoxPack: 'justify',
        justifyContent: 'space-between',
        paddingTop: '8px',
        paddingLeft: '16px',
        paddingRight: '16px',
        opacity: 1,
        background: 'transparent',
        color: 'rgb(52, 71, 103)',
        boxShadow: 'none',
        minHeight: '80px',
    },
    cardDiv6: {
        display: 'flex',
        WebkitBoxPack: 'center',
        justifyContent: 'center',
        WebkitBoxAlign: 'center',
        alignItems: 'center',
        width: '4rem',
        height: '4rem',
        marginTop: '-24px',
        opacity: 1,
        background: 'linear-gradient(195deg, rgb(66, 66, 74), rgb(25, 25, 25))',
        color: 'rgb(255, 255, 255)',
        borderRadius: '0.75rem',
        boxShadow: 'rgba(0, 0, 0, 0.14) 0rem 0.25rem 1.25rem 0rem, rgba(64, 64, 64, 0.4) 0rem 0.4375rem 0.625rem -0.3125rem',
    },
    cardDiv7: {
        userSelect: 'none',
        width: '1em',
        height: '1em',
        overflow: 'hidden',
        display: 'inline-block',
        textAlign: 'center',
        flexShrink: 0,
        fontSize: '1.5rem',
    },
    cardDiv8: {
        textAlign: 'right',
        lineHeight: 1.25,
        opacity: 1,
        background: 'transparent',
        color: 'rgb(52, 71, 103)',
        boxShadow: 'none',
    },
    cardDiv9: {
        margin: '0px',
        fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
        fontSize: '0.9rem',
        lineHeight: '1.5',
        letterSpacing: '0.02857em',
        opacity: '1',
        textTransform: 'none',
        verticalAlign: 'unset',
        textDecoration: 'none',
        color: 'rgb(123, 128, 154)',
        fontWeight: '600',
    },
    cardDiv10: {
        margin: '0px',
        fontSize: '1.5rem',
        lineHeight: '1.375',
        fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
        fontWeight: '700',
        letterSpacing: '0.00735em',
        opacity: '1',
        textTransform: 'none',
        verticalAlign: 'unset',
        textDecoration: 'none',
        color: 'rgb(52, 71, 103)',
    },
    cardDiv11: {
        flexShrink: '0',
        backgroundColor: 'transparent',
        height: '0.0625rem',
        opacity: '0.25',
        backgroundImage: 'linear-gradient(to right, rgba(52, 71, 103, 0), rgba(52, 71, 103, 0.4), rgba(52, 71, 103, 0))',
        borderWidth: '0px 0px 0px',
        borderStyle: 'solid solid none',
        borderColor: 'rgba(0, 0, 0, 0.12) rgba(0, 0, 0, 0.12) rgba(0, 0, 0, 0.12)',
        margin: '0.9rem 0px',
        borderBottom: 'none',
    },
    cardDiv12: {
        paddingBottom: '16px',
        paddingLeft: '16px',
        paddingRight: '16px',
        opacity: '1',
        background: 'transparent',
        color: 'rgb(52, 71, 103)',
        boxShadow: 'none',
    },
    cardDiv13: {
        margin: '0px',
        fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
        fontSize: '0.875rem',
        fontWeight: '300',
        lineHeight: '1.5',
        letterSpacing: '0.02857em',
        display: 'flex',
        opacity: '1',
        textTransform: 'none',
        verticalAlign: 'unset',
        textDecoration: 'none',
        color: 'rgb(123, 128, 154)',
    },
    cardDiv14: {
        margin: '0px',
        fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
        fontSize: '0.875rem',
        lineHeight: '1.5',
        letterSpacing: '0.02857em',
        opacity: '1',
        textTransform: 'none',
        verticalAlign: 'unset',
        textDecoration: 'none',
        color: 'rgb(76, 175, 80)',
        fontWeight: '700',
    },
    cardBackIconYellow: {
        display: 'flex',
        WebkitBoxPack: 'center',
        justifyContent: 'center',
        WebkitBoxAlign: 'center',
        alignItems: 'center',
        width: '4rem',
        height: '4rem',
        marginTop: '-24px',
        opacity: 1,
        background: 'rgb(227 225 112 / 30%)',
        color: 'rgb(255, 255, 255)',
        borderRadius: '0.75rem',
        boxShadow: 'rgba(0, 0, 0, 0.14) 0rem 0.25rem 1.25rem 0rem, rgba(64, 64, 64, 0.4) 0rem 0.4375rem 0.625rem -0.3125rem',
        border: '1px solid rgb(209 166 0)',
    },
    cardBackIconRed: {
        display: 'flex',
        WebkitBoxPack: 'center',
        justifyContent: 'center',
        WebkitBoxAlign: 'center',
        alignItems: 'center',
        width: '4rem',
        height: '4rem',
        marginTop: '-24px',
        opacity: 1,
        // background: 'linear-gradient(195deg, rgb(255, 0, 115), rgb(127, 0, 0))',
        background: '#ffe2e5',
        color: 'rgb(255, 255, 255)',
        borderRadius: '0.75rem',
        boxShadow: 'rgba(0, 0, 0, 0.14) 0rem 0.25rem 1.25rem 0rem, rgba(64, 64, 64, 0.4) 0rem 0.4375rem 0.625rem -0.3125rem',
        border: '1px solid #ff1744',
    },
    cardBackIconBlue: {
        display: 'flex',
        WebkitBoxPack: 'center',
        justifyContent: 'center',
        WebkitBoxAlign: 'center',
        alignItems: 'center',
        width: '4rem',
        height: '4rem',
        marginTop: '-24px',
        opacity: 1,
        background: 'rgb(203 237 253)',
        color: 'rgb(255, 255, 255)',
        borderRadius: '0.75rem',
        boxShadow: 'rgba(0, 0, 0, 0.14) 0rem 0.25rem 1.25rem 0rem, rgba(64, 64, 64, 0.4) 0rem 0.4375rem 0.625rem -0.3125rem',
        border: '1px solid #00a0ef',
    },
    cardBackIconGrey: {
        display: 'flex',
        WebkitBoxPack: 'center',
        justifyContent: 'center',
        WebkitBoxAlign: 'center',
        alignItems: 'center',
        width: '4rem',
        height: '4rem',
        marginTop: '-24px',
        opacity: 1,
        background: 'rgb(215 215 215)',
        color: 'rgb(255, 255, 255)',
        borderRadius: '0.75rem',
        boxShadow: 'rgba(0, 0, 0, 0.14) 0rem 0.25rem 1.25rem 0rem, rgba(64, 64, 64, 0.4) 0rem 0.4375rem 0.625rem -0.3125rem',
        border: '1px solid #6c6c6c',
    },
    cardBackIconGreen: {
        display: 'flex',
        WebkitBoxPack: 'center',
        justifyContent: 'center',
        WebkitBoxAlign: 'center',
        alignItems: 'center',
        width: '4rem',
        height: '4rem',
        marginTop: '-24px',
        opacity: 1,
        background: 'rgb(224 255 230)',
        color: 'rgb(255, 255, 255)',
        borderRadius: '0.75rem',
        boxShadow: 'rgba(0, 0, 0, 0.14) 0rem 0.25rem 1.25rem 0rem, rgba(64, 64, 64, 0.4) 0rem 0.4375rem 0.625rem -0.3125rem',
        border: '1px solid #03b52b',
    },
    listIconYellow: {
        display: 'flex',
        WebkitBoxPack: 'center',
        justifyContent: 'center',
        WebkitBoxAlign: 'center',
        alignItems: 'center',
        width: '2.7rem',
        height: '2.7rem',
        marginTop: '0px',
        opacity: 1,
        background: 'rgb(227 225 112 / 30%)',
        color: 'rgb(255, 255, 255)',
        borderRadius: '1rem',
        boxShadow: 'rgba(0, 0, 0, 0.14) 0rem 0.25rem 1.25rem 0rem, rgba(64, 64, 64, 0.4) 0rem 0.4375rem 0.625rem -0.3125rem',
        border: '1px solid rgb(209 166 0)',
    },
    listIconRed: {
        display: 'flex',
        WebkitBoxPack: 'center',
        justifyContent: 'center',
        WebkitBoxAlign: 'center',
        alignItems: 'center',
        width: '2.7rem',
        height: '2.7rem',
        marginTop: '0px',
        opacity: 1,
        background: '#ffe2e5',
        color: 'rgb(255, 255, 255)',
        borderRadius: '1rem',
        boxShadow: 'rgba(0, 0, 0, 0.14) 0rem 0.25rem 1.25rem 0rem, rgba(64, 64, 64, 0.4) 0rem 0.4375rem 0.625rem -0.3125rem',
        border: '1px solid #ff1744',
    },
    listIconBlue: {
        display: 'flex',
        WebkitBoxPack: 'center',
        justifyContent: 'center',
        WebkitBoxAlign: 'center',
        alignItems: 'center',
        width: '2.7rem',
        height: '2.7rem',
        marginTop: '0px',
        opacity: 1,
        background: 'rgb(203 237 253)',
        color: 'rgb(255, 255, 255)',
        borderRadius: '1rem',
        boxShadow: 'rgba(0, 0, 0, 0.14) 0rem 0.25rem 1.25rem 0rem, rgba(64, 64, 64, 0.4) 0rem 0.4375rem 0.625rem -0.3125rem',
        border: '1px solid #00a0ef',
    },
    listIconGreen: {
        display: 'flex',
        WebkitBoxPack: 'center',
        justifyContent: 'center',
        WebkitBoxAlign: 'center',
        alignItems: 'center',
        width: '2.7rem',
        height: '2.7rem',
        marginTop: '0px',
        opacity: 1,
        background: 'rgb(224 255 230)',
        color: 'rgb(255, 255, 255)',
        borderRadius: '1rem',
        boxShadow: 'rgba(0, 0, 0, 0.14) 0rem 0.25rem 1.25rem 0rem, rgba(64, 64, 64, 0.4) 0rem 0.4375rem 0.625rem -0.3125rem',
        border: '1px solid #03b52b',
    },
    listIconGrey: {
        display: 'flex',
        WebkitBoxPack: 'center',
        justifyContent: 'center',
        WebkitBoxAlign: 'center',
        alignItems: 'center',
        width: '2.7rem',
        height: '2.7rem',
        marginTop: '0px',
        opacity: 1,
        background: 'rgb(215 215 215)',
        color: 'rgb(255, 255, 255)',
        borderRadius: '1rem',
        boxShadow: 'rgba(0, 0, 0, 0.14) 0rem 0.25rem 1.25rem 0rem, rgba(64, 64, 64, 0.4) 0rem 0.4375rem 0.625rem -0.3125rem',
        border: '1px solid #6c6c6c',
    },
    cardDiv15: {
        WebkitBoxShadow: '0 1px 20px 0 rgba(69, 90, 100, 0.08)',
        boxShadow: '0 1px 20px 0 rgba(69, 90, 100, 0.08)',
        marginBottom: '30px',
        position: 'relative',
        display: 'flex',
        msFlexDirection: 'column',
        flexDirection: 'column',
        minWidth: '0',
        wordWrap: 'break-word',
        backgroundColor: '#fff',
        backgroundClip: 'border-box',
        border: '1px solid rgba(0, 0, 0, 0.125)',
        borderRadius: '.25rem',
        height: '500px',
    },
    cardDiv16: {
        display: 'flex',
        flexWrap: 'wrap',
        marginLeft: 0,
        marginRight: 0,
        height: '100%',
    },
    cardDiv17: {
        borderRadius: '5px 0 0 5px',
        background: 'linear-gradient(to right, rgb(2 93 95), rgb(0 148 151))',
        padding: '20px 0',
        height: '100%',
    },
    cardDiv18: {
        padding: '1.25rem',
        color: '#fff ',
        textAlign: 'center',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%',
    },
    cardDiv19: {
        borderRadius: '5px 0 0 5px',
        background: 'linear-gradient(to right, rgb(221 204 0), rgb(229, 224, 1))',
        padding: '20px 0',
        height: '100%',
    },
    cardDiv20: {
        borderRadius: '5px 0 0 5px',
        background: 'linear-gradient(to right, rgb(255 43 85), rgb(255 93 93))',
        padding: '20px 0',
        height: '100%',
    },
    cardDiv21: {
        borderRadius: '5px 0 0 5px',
        background: 'linear-gradient(to right, #01a9ac, #01dbdf)',
        padding: '20px 0',
        height: '100%',
    },
};

const handleScrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
};
export default function Home() {
    const navigate = useNavigate();

  
    return (
        <Box>
            <header className="masthead">
                <div className="container d-flex h-100 align-items-center">
                    <div style={{ textAlign: 'center' }} className=" center-vertical mx-auto text-center">
                        <h1 style={{ marginBlockStart: '0em' }}>AG ANALYTICS</h1>
                        <Box display="flex" justifyContent="center">
                            <h2 className="text-white mt-2 mb-5" style={{ marginBlockStart: '0em', color: 'white', fontWeight: 500, fontFamily: 'serif', letterSpacing: '0.0625em' }}>
                                The Power of Data
                            </h2>
                        </Box>
                        <Box display="flex" justifyContent="center">
                            <Tooltip  sx={{
                                m: '2rem', maxWidth: ' 300px', padding: '1.25rem 2rem', letterSpacing: '.15rem',
                            }}>
                                <Button
                                    id="nosotrosButtton"
                                    style={{ backgroundColor: '#64a19d' }}
                                    variant="contained"
                                    onClick={handleScrollToAbout}
                                >
                                    NOSOTROS
                                </Button>
                            </Tooltip>
                        </Box>

                    </div>
                </div>
            </header>
            <section id="about" className="about-section text-center">
                <div className="container">
                    <div className="row">
                        <Grid container spacing={1}>
                            <Grid item lg={2}>
                            </Grid>
                            <Grid item lg={8}>
                                <h1 className="text-white mb-4" style={{ color: '#d9d9d9', fontFamily: 'inherit', fontSize: '35px' }}>Nuestra empresa</h1>
                                <p className="text-white" style={{ color: '#d9d9d9', marginBlockStart: '1rem', fontFamily: 'inherit', marginBottom: '1rem' }}>Somos una empresa especializada en Transformación Digital con enfoque en Analítica de Datos e Inteligencia de Negocios. Ofrecemos soluciones tecnológicas innovadoras que optimizan la operación y toma de decisiones de nuestros clientes. Nuestro equipo multidisciplinario, con expertos en desarrollo de software, analítica y gestión de proyectos, impulsa el crecimiento a través de soluciones personalizadas. Nos especializamos en plataformas a medida, integración de sistemas y analítica avanzada, abordando desde la automatización de procesos hasta el análisis predictivo. En AG Analytics, creamos el futuro digital de nuestros clientes como socios estratégicos.
                                </p>
                            </Grid>
                            <Grid item lg={2}>
                            </Grid>F
                        </Grid>
                    </div>
                    <img src={tecnologiaImg} className="img-fluid" alt="" />

                </div>
            </section>
            <section id="services" className="services-section bg-light" style={{ marginBottom: '8rem' }}>
                <Box className="" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', marginTop: '80px', height: '100%' }}>
                    <h2 className="text-white mb-4" style={{ color: 'rgb(58 58 58)', fontFamily: 'inherit', fontSize: '35px' }}>Nuestros Servicios</h2>
                </Box>
                <Box className="" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', marginTop: '50px', height: '100%' }}>
                    <Grid container spacing={1}>
                        <Grid item lg={2}></Grid>
                        <Grid item lg={8}>
                            <Grid container spacing={1} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                <Grid item lg={6} xs={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                    <img className="img-fluid" src={DTSimg} alt="" style={{ maxHeight: '100%', maxWidth: '100%' }} />
                                </Grid>
                                <Grid item lg={6} xs={12}>
                                    <div className="blackbg text-center h-100 project">
                                        <div className="d-flex h-100">
                                            <div className="project-text w-100 my-auto text-center">
                                                <h4 style={{ fontSize: '20px', marginBlockEnd: '10px' }} className="text-white">DTS</h4>
                                                <p style={{ color: '#rgb(131 130 130)', textAlign: 'justify' }} className="mb-0 text-white-50 text-lg-left">
                                                    "Daily Track System" es un Sistema de reportabilidad y analítica diaria, que permite a los usuarios, llevar un control del personal, maquinarias y actividades diarias,  ademas de una gran flexibilidad a la hora de configurar la información necesaria a llenar, permitiendo acomodarse a las distintas necesidades y estandares de las empresas.
                                                </p>
                                                <Tooltip title="" sx={{
                                                    m: '2rem', maxWidth: ' 300px', padding: '0.5rem 1rem', letterSpacing: '.15rem',
                                                }}>
                                                    <Button
                                                        id="aprobarButton"
                                                        style={{ backgroundColor: '#64a19d' }}
                                                        variant="contained"
                                                        onClick={() => {
                                                            navigate('/homeDTS')
                                                        }}
                                                    >
                                                        IR A DTS
                                                    </Button>
                                                </Tooltip>
                                            </div>
                                        </div>
                                    </div>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item lg={2}></Grid>
                    </Grid>
                </Box>
                <Box className="" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', marginTop: '10px', height: '100%' }}>
                    <Grid container spacing={1}>
                        <Grid item lg={2}></Grid>
                        <Grid item lg={8}>
                            <Grid container spacing={1} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                <Grid item lg={6} xs={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                    <img className="img-fluid" src={WTSimg} alt="" style={{ maxHeight: '100%', maxWidth: '100%' }} />
                                </Grid>
                                <Grid item lg={6} xs={12}>
                                    <div className="blackbg text-center h-100 project">
                                        <div className="d-flex h-100">
                                            <div className="project-text w-100 my-auto text-center">
                                                <h4 style={{ fontSize: '20px', marginBlockEnd: '10px' }} className="text-white">WTS</h4>
                                                <p style={{ color: '#rgb(131 130 130)', textAlign: 'justify' }} className="mb-0 text-white-50 text-lg-left">
                                                    "Weekly Track System" es un Sistema de reportabilidad y analítica Semanal, que permite a los usuarios, llevar un control de los avances de la obra de un proyecto.
                                                </p>
                                                <Tooltip title="" sx={{
                                                    m: '2rem', maxWidth: ' 300px', padding: '0.5rem 1rem', letterSpacing: '.15rem',
                                                }}>
                                                    <Button
                                                        id="aprobarButton"
                                                        style={{ backgroundColor: '#64a19d' }}
                                                        variant="contained"
                                                        onClick={() => {
                                                         
                                                        }}
                                                    >
                                                        PROXIMAMENTE
                                                    </Button>
                                                </Tooltip>
                                            </div>
                                        </div>
                                    </div>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item lg={2}></Grid>
                    </Grid>
                </Box>

            </section>

            <section id="signup" className="signup-section">
                <div className="container">
                    <div className="row">
                        <div className="col-md-10 col-lg-8 mx-auto text-center">

                            <EmailIcon sx={{ color: 'white', fontSize: '50px' }} />
                            <h2 style={{ color: 'white', fontSize: '30px', fontFamily: 'inherit', fontWeight: 400 }} className="text-white mb-5">Envíennos un correo!</h2>

                            <Tooltip title="Aprobar Daily Report" sx={{
                                m: '2rem', maxWidth: ' 300px', padding: '1.25rem 2rem', letterSpacing: '.15rem',
                            }}>
                                <Button
                                    id="aprobarButton"
                                    style={{ backgroundColor: '#64a19d' }}
                                    variant="contained"
                                >
                                    CONTACTO
                                </Button>
                            </Tooltip>

                        </div>
                    </div>
                </div>
            </section>


            <section className="contact-section bg-black" style={{ paddingBottom: '1rem' }}>
                <div className="container">

                    <Grid container spacing={4}>

                        <Grid item lg={4} xs={12} md={4} >
                            <div className="card py-4 h-100" style={{maxHeight:'230px'}}>
                                <div className="card-body text-center">

                                    <ContactMailIcon sx={{ color: '#64a19d', fontSize: '30px' }} />
                                    <h4 className="text-uppercase m-0">Dirección</h4>
                                    <hr className="my-4" />
                                    <div className="small text-black-50">Santiago, Chile</div>
                                </div>
                            </div>
                        </Grid>

                        <Grid item lg={4} xs={12} md={4}>

                            <div className="card py-4 h-100" style={{maxHeight:'230px'}}>
                                <div className="card-body text-center">
                                    <EmailIcon sx={{ color: '#64a19d', fontSize: '30px' }} />
                                    <h4 className="text-uppercase m-0">Email</h4>
                                    <hr className="my-4" />
                                    <div className="small text-black-50">
                                        <a href="#">tpoblete@aganalytics.cl</a>
                                    </div>
                                </div>
                            </div>
                        </Grid>

                        <Grid item lg={4} xs={12} md={4}>

                            <div className="card py-4 h-100" >
                                <div className="card-body text-center">
                                    <ContactPhoneIcon sx={{ color: '#64a19d', fontSize: '30px' }} />
                                    <h4 className="text-uppercase m-0">Teléfono</h4>
                                    <hr className="my-4" />
                                    <div className="small text-black-50">+56 967579214</div>
                                </div>
                            </div>
                        </Grid>
                    </Grid>

                    <div className="social d-flex justify-content-center">
                        <a href="#" className="mx-2">
                            <FacebookIcon sx={{ color: '##686868', fontSize: '25px' }} />
                        </a>
                        <a href="#" className="mx-2">
                            <InstagramIcon sx={{ color: '##686868', fontSize: '25px' }} />
                        </a>
                        <a href="#" className="mx-2">
                            <LinkedInIcon sx={{ color: '##686868', fontSize: '25px' }} />
                        </a>
                    </div>

                </div>
            </section>

            <footer className="bg-black small text-center text-white-50">
                <div style={{ color: 'white' }} className="container">
                    Copyright &copy; Todos los derechos reservados
                </div>
            </footer>

        </Box>


    )
}