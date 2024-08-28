import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from './context/authContext'
import '../assets/css/treeDiagram.css';
import { Grid, Box } from '@mui/material';
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


export default function Home() {
    const { accessToken, currentUser } = useContext(AuthContext);
    const contract_id = currentUser.contract_id;

    const [dailys, setDailys] = useState([]);
    const [countAllDailys, setCountAllDailys] = useState([]);
    const [countDailysAlaEspera, setCountDailysAlaEspera] = useState([]);
    const [countDailysRevision, setCountDailysRevision] = useState([]);
    const [countDailysAprobacion, setCountDailysAprobacion] = useState([]);
    const [countDailysAprobados, setCountDailysAprobados] = useState([]);
    const [countDailysFinalizados, setCountDailysFinalizados] = useState([]);
    const [calendarEvents, setCalendarEvents] = useState([]);
    const [view, setView] = useState(Views.WEEK);
    const [date, setDate] = useState(new Date());
    const [listAcciones, setListAcciones] = useState([]);
    const [contract, setContract] = useState([]);

    dayjs.locale('es');
    const localizer = dayjsLocalizer(dayjs);// para calendario

    useEffect(() => {
        fetchData(1, 10);
    }, []);

    const fetchData = async (page, rowsPerPage) => {
        try {
            const response = await axios.get(`${BASE_URL}/Dailys?contract_id=${contract_id}`);
            const dailys = response.data;
            setDailys(dailys);
            const countAllDailys = dailys.length;
            setCountAllDailys(countAllDailys);
            const countDailysAlaEspera = dailys.filter(daily => daily.state_id === 1).length;
            setCountDailysAlaEspera(countDailysAlaEspera);
            const countDailysRevision = dailys.filter(daily => daily.state_id === 2).length;
            setCountDailysRevision(countDailysRevision);
            const countDailysAprobacion = dailys.filter(daily => daily.state_id === 3).length;
            setCountDailysAprobacion(countDailysAprobacion);
            const countDailysAprobados = dailys.filter(daily => daily.state_id === 4).length;
            setCountDailysAprobados(countDailysAprobados);
            const countDailysFinalizados = dailys.filter(daily => daily.state_id === 5).length;
            setCountDailysFinalizados(countDailysFinalizados);

            const calendarEvents = dailys.map((daily) => ({
                id: daily.id,
                title: daily.state_id === 1 ? "A la espera EECC" : daily.state_id === 2 ? "Revision Pendiente" : daily.state_id === 3 ? "Aprobación Pendiente" : daily.state_id === 4 ? "Aprobado" : daily.state_id === 5 ? "Finalizado Sin Acuerdo" : "",
                allDay: true,
                start: new Date(daily.date),
                end: new Date(daily.date),
            }));
            setCalendarEvents(calendarEvents);

            const responseListAcciones = await axios.get(`${BASE_URL}/dailyAccionesContract/${contract_id}`);
            const listAcciones = responseListAcciones.data;
            setListAcciones(listAcciones);

            const responseContract = await axios.get(`${BASE_URL}/contracts/${contract_id}`);
            //console.log('res', response.data)
            setContract(responseContract.data);
            console.log('contract', responseContract.data);


        } catch (error) {
            console.error('Error al obtener los Dailys:', error);
        }
    };

    const eventPropGetter = (event) => {
        let newStyle = {
            backgroundColor: 'lightgrey',
            color: 'black',
            borderRadius: '0px',
            border: 'none'
        };

        if (event.title === "A la espera EECC") {
            newStyle.backgroundColor = 'white';
            newStyle.border = '1px solid rgb(209 166 0)';
            newStyle.borderRadius = '0.75rem';
            newStyle.color = 'rgb(209 166 0)';
        } else if (event.title === "Revision Pendiente") {
            newStyle.backgroundColor = 'white';
            newStyle.border = '1px solid #ff1744';
            newStyle.borderRadius = '0.75rem';
            newStyle.color = '#ff1744';

        } else if (event.title === "Aprobación Pendiente") {
            newStyle.backgroundColor = 'white';
            newStyle.border = '1px solid #00a0ef';
            newStyle.borderRadius = '0.75rem';
            newStyle.color = '#00a0ef';
        } else if (event.title === "Aprobado") {
            newStyle.backgroundColor = 'white';
            newStyle.border = '1px solid #03b52b';
            newStyle.borderRadius = '0.75rem';
            newStyle.color = '#03b52b';
        } else if (event.title === "Finalizado Sin Acuerdo") {
            newStyle.backgroundColor = 'white';
            newStyle.border = '1px solid #6c6c6c';
            newStyle.borderRadius = '0.75rem';
            newStyle.color = '#6c6c6c';
        }

        return {
            className: "",
            style: newStyle
        };
    };

    const allViews = ['month'];

    const cardsStatusDailys = () => {

        const porcentajeAprobados = Math.round((countDailysAprobados * 100) / countAllDailys);
        const porcentajeFinalizados = Math.round((countDailysFinalizados * 100) / countAllDailys);
        const porcentajeAlaEspera = Math.round((countDailysAlaEspera * 100) / countAllDailys);
        const porcentajeRevision = Math.round((countDailysRevision * 100) / countAllDailys);
        const porcentajeAprobacion = Math.round((countDailysAprobacion * 100) / countAllDailys);

        return (
            <Grid container sx={{ mt: '3rem' }}  >

                <Grid className=' ' sx={{ mt: '3rem' }} item xs={12} md={6} lg={2.4}>
                    <div style={styles.cardDiv1} className="MuiGrid-root MuiGrid-container MuiGrid-spacing-xs-3 css-1h77wgb">
                        <div style={styles.cardDiv2} className="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-12 MuiGrid-grid-md-6 MuiGrid-grid-lg-3 css-17cu47x">
                            <div style={styles.cardDiv3} className="MuiBox-root css-rwss59">
                                <div style={styles.cardDiv4} className="MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation1 MuiCard-root css-sa3w6d">
                                    <div style={styles.cardDiv5} className="MuiBox-root css-p6siio">
                                        <div style={styles.cardBackIconYellow} className="MuiBox-root css-79or14">
                                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                <ListItemIcon sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                    <ContentPasteGoIcon sx={{ color: 'rgb(209 166 0)' }} />
                                                </ListItemIcon>
                                            </div>

                                        </div>
                                        <div style={styles.cardDiv8} className="MuiBox-root css-8k5edi">
                                            <span style={styles.cardDiv9} className="MuiTypography-root MuiTypography-button css-1dcnter">A la espera EECC</span>
                                            <h4 style={styles.cardDiv10} className="MuiTypography-root MuiTypography-h4 css-rtlgmj">{countDailysAlaEspera}</h4>
                                        </div>
                                    </div>
                                    <hr style={styles.cardDiv11} className="MuiDivider-root MuiDivider-fullWidth css-2hb8f" />
                                    <div style={styles.cardDiv12} className="MuiBox-root css-bln954">
                                        <p style={styles.cardDiv13} className="MuiTypography-root MuiTypography-button css-1fhu5z7">
                                            <span style={{fontWeight: 600}} className="MuiTypography-root MuiTypography-button css-141aiuc">{porcentajeAlaEspera}%</span>&nbsp;del total de Dailys
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Grid>
                <Grid className=' ' sx={{ mt: '3rem' }} item xs={12} md={6} lg={2.4}>
                    <div style={styles.cardDiv1} className="MuiGrid-root MuiGrid-container MuiGrid-spacing-xs-3 css-1h77wgb">
                        <div style={styles.cardDiv2} className="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-12 MuiGrid-grid-md-6 MuiGrid-grid-lg-3 css-17cu47x">
                            <div style={styles.cardDiv3} className="MuiBox-root css-rwss59">
                                <div style={styles.cardDiv4} className="MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation1 MuiCard-root css-sa3w6d">
                                    <div style={styles.cardDiv5} className="MuiBox-root css-p6siio">
                                        <div style={styles.cardBackIconRed} className="MuiBox-root css-79or14">
                                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                <ListItemIcon sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                    <ContentPasteSearchIcon sx={{ color: 'rgb(209 0 85)' }} />
                                                </ListItemIcon>
                                            </div>

                                        </div>
                                        <div style={styles.cardDiv8} className="MuiBox-root css-8k5edi">
                                            <span style={styles.cardDiv9} className="MuiTypography-root MuiTypography-button css-1dcnter">Revisión Pendiente</span>
                                            <h4 style={styles.cardDiv10} className="MuiTypography-root MuiTypography-h4 css-rtlgmj">{countDailysRevision}</h4>
                                        </div>
                                    </div>
                                    <hr style={styles.cardDiv11} className="MuiDivider-root MuiDivider-fullWidth css-2hb8f" />
                                    <div style={styles.cardDiv12} className="MuiBox-root css-bln954">
                                        <p style={styles.cardDiv13} className="MuiTypography-root MuiTypography-button css-1fhu5z7">
                                            <span style={{fontWeight: 600}} className="MuiTypography-root MuiTypography-button css-141aiuc">{porcentajeRevision}%</span>&nbsp;del total de Dailys
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Grid>
                <Grid className=' ' sx={{ mt: '3rem' }} item xs={12} md={6} lg={2.4}>
                    <div style={styles.cardDiv1} className="MuiGrid-root MuiGrid-container MuiGrid-spacing-xs-3 css-1h77wgb">
                        <div style={styles.cardDiv2} className="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-12 MuiGrid-grid-md-6 MuiGrid-grid-lg-3 css-17cu47x">
                            <div style={styles.cardDiv3} className="MuiBox-root css-rwss59">
                                <div style={styles.cardDiv4} className="MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation1 MuiCard-root css-sa3w6d">
                                    <div style={styles.cardDiv5} className="MuiBox-root css-p6siio">
                                        <div style={styles.cardBackIconBlue} className="MuiBox-root css-79or14">
                                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                <ListItemIcon sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                    <ContentPasteSearchIcon sx={{ color: '#00a0ef' }} />
                                                </ListItemIcon>
                                            </div>

                                        </div>
                                        <div style={styles.cardDiv8} className="MuiBox-root css-8k5edi">
                                            <span style={styles.cardDiv9} className="MuiTypography-root MuiTypography-button css-1dcnter">Aprobación Pendiente</span>
                                            <h4 style={styles.cardDiv10} className="MuiTypography-root MuiTypography-h4 css-rtlgmj">{countDailysAprobacion}</h4>
                                        </div>
                                    </div>
                                    <hr style={styles.cardDiv11} className="MuiDivider-root MuiDivider-fullWidth css-2hb8f" />
                                    <div style={styles.cardDiv12} className="MuiBox-root css-bln954">
                                        <p style={styles.cardDiv13} className="MuiTypography-root MuiTypography-button css-1fhu5z7">
                                            <span style={{fontWeight: 600}} className="MuiTypography-root MuiTypography-button css-141aiuc">{porcentajeAprobacion}%</span>&nbsp;del total de Dailys
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Grid>
                <Grid className=' ' sx={{ mt: '3rem' }} item xs={12} md={6} lg={2.4}>
                    <div style={styles.cardDiv1} className="MuiGrid-root MuiGrid-container MuiGrid-spacing-xs-3 css-1h77wgb">
                        <div style={styles.cardDiv2} className="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-12 MuiGrid-grid-md-6 MuiGrid-grid-lg-3 css-17cu47x">
                            <div style={styles.cardDiv3} className="MuiBox-root css-rwss59">
                                <div style={styles.cardDiv4} className="MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation1 MuiCard-root css-sa3w6d">
                                    <div style={styles.cardDiv5} className="MuiBox-root css-p6siio">
                                        <div style={styles.cardBackIconGrey} className="MuiBox-root css-79or14">
                                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                <ListItemIcon sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                    <AssignmentLateIcon sx={{ color: '#6c6c6c' }} />
                                                </ListItemIcon>
                                            </div>

                                        </div>
                                        <div style={styles.cardDiv8} className="MuiBox-root css-8k5edi">
                                            <span style={styles.cardDiv9} className="MuiTypography-root MuiTypography-button css-1dcnter">Finalizados Sin Acuerdo</span>
                                            <h4 style={styles.cardDiv10} className="MuiTypography-root MuiTypography-h4 css-rtlgmj">{countDailysFinalizados}</h4>
                                        </div>
                                    </div>
                                    <hr style={styles.cardDiv11} className="MuiDivider-root MuiDivider-fullWidth css-2hb8f" />
                                    <div style={styles.cardDiv12} className="MuiBox-root css-bln954">
                                        <p style={styles.cardDiv13} className="MuiTypography-root MuiTypography-button css-1fhu5z7">
                                            <span style={{fontWeight: 600}} className="MuiTypography-root MuiTypography-button css-141aiuc">{porcentajeFinalizados}%</span>&nbsp;del total de Dailys
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Grid>
                <Grid className=' ' sx={{ mt: '3rem' }} item xs={12} md={6} lg={2.4}>
                    <div style={styles.cardDiv1} className="MuiGrid-root MuiGrid-container MuiGrid-spacing-xs-3 css-1h77wgb">
                        <div style={styles.cardDiv2} className="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-12 MuiGrid-grid-md-6 MuiGrid-grid-lg-3 css-17cu47x">
                            <div style={styles.cardDiv3} className="MuiBox-root css-rwss59">
                                <div style={styles.cardDiv4} className="MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation1 MuiCard-root css-sa3w6d">
                                    <div style={styles.cardDiv5} className="MuiBox-root css-p6siio">
                                        <div style={styles.cardBackIconGreen} className="MuiBox-root css-79or14">
                                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                <ListItemIcon sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                    <AssignmentTurnedInIcon sx={{ color: '#03b52b' }} />
                                                </ListItemIcon>
                                            </div>

                                        </div>
                                        <div style={styles.cardDiv8} className="MuiBox-root css-8k5edi">
                                            <span style={styles.cardDiv9} className="MuiTypography-root MuiTypography-button css-1dcnter">Aprobados</span>
                                            <h4 style={styles.cardDiv10} className="MuiTypography-root MuiTypography-h4 css-rtlgmj">{countDailysAprobados}</h4>
                                        </div>
                                    </div>
                                    <hr style={styles.cardDiv11} className="MuiDivider-root MuiDivider-fullWidth css-2hb8f" />
                                    <div style={styles.cardDiv12} className="MuiBox-root css-bln954">
                                        <p style={styles.cardDiv13} className="MuiTypography-root MuiTypography-button css-1fhu5z7">
                                            <span style={{fontWeight: 600}} className="MuiTypography-root MuiTypography-button css-141aiuc">{porcentajeAprobados}%</span>&nbsp;del total de Dailys
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Grid>

            </Grid>
        );
    };

    const calendario = () => {

        return (

            <div className="row mt-5">
                <Box className="myCustomHeight" sx={{}}>
                    <Calendar
                        localizer={localizer}
                        events={calendarEvents}
                        startAccessor="start"
                        endAccessor="end"
                        views={allViews}
                        style={{ height: 500 }}
                        eventPropGetter={eventPropGetter}
                        messages={{
                            allDay: 'Todo el día',
                            previous: 'Anterior',
                            next: 'Siguiente',
                            today: 'Hoy',
                            month: 'Mes',
                            week: 'Semana',
                            day: 'Día',
                            agenda: 'Agenda',
                            date: 'Fecha',
                            time: 'Hora',
                            event: 'Evento',
                            noEventsInRange: 'No hay eventos en este rango.',
                            showMore: total => `+ Ver más (${total})`,
                            work_week: 'Semana laboral',
                            yesterday: 'Ayer',
                            tomorrow: 'Mañana',

                        }}
                    />
                </Box>

            </div>

        );
    }
    const formatDateTime = (date) => {
        const timeZone = 'America/Santiago'; // Zona horaria de Chile
        return moment.tz(date, timeZone).format('DD/MM/YYYY HH:mm');
    };

    const formatDate = (date) => {
        const timeZone = 'America/Santiago'; // Zona horaria de Chile
        return moment.tz(date, timeZone).format('DD/MM/YYYY');
    };
    const listActivities = () => {

        const listIcons = (accion) => {

            return (
                <div style={accion === "Envío" ? (styles.listIconYellow)
                    : accion === "Revisión" ? (styles.listIconBlue)
                        : accion === "Rechazo" ? (styles.listIconRed)
                            : accion === "Aprobación" ? (styles.listIconGreen)
                                : accion === "Finalización sin acuerdo" ? (styles.listIconGrey)
                                    : null


                } className="MuiBox-root css-79or14">
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <ListItemIcon sx={{ color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '0.3rem' }}>
                            {accion === "Envío" ? (<ContentPasteGoIcon sx={{ color: 'rgb(209 166 0)' }} />)
                                : accion === "Revisión" ? (<ContentPasteSearchIcon sx={{ color: '#00a0ef' }} />)
                                    : accion === "Rechazo" ? (<ReportOffIcon sx={{ color: '#ff1744' }} />)
                                        : accion === "Aprobación" ? (<AssignmentTurnedInIcon sx={{ color: '#03b52b' }} />)
                                            : accion === "Finalización sin acuerdo" ? (<AssignmentLateIcon sx={{ color: '#6c6c6c' }} />)
                                                : null}

                        </ListItemIcon>
                    </div>
                </div>)
        }

        return (
            <List sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'column', maxHeight: '550px', overflowY: 'auto' }}>
                {listAcciones.map((accion, index) => (
                    <Box key={index} sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                        <ListItem alignItems="flex-start">
                            <ListItemAvatar>

                                {listIcons(accion.accion)}

                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <React.Fragment>
                                        <Typography component="span" variant="body2" sx={{ color: 'text.primary', display: 'inline', fontSize: '1rem' }}>
                                            DR: {accion.daily_dateformated}
                                        </Typography>
                                        <Typography component="span" variant="body2" sx={{ color: '#5d5c5c', display: 'inline', fontSize: '1rem' }}>
                                            {`- ${accion.accion}`}
                                        </Typography>

                                    </React.Fragment>
                                }
                                secondary={
                                    <React.Fragment>
                                        <Typography
                                            component="span"
                                            variant="body2"
                                            sx={{ color: 'text.primary', display: 'inline' }}
                                        >
                                            {accion.user_name}
                                        </Typography>
                                        {`- Realizado:  ${formatDateTime(accion.created_at)}`}
                                    </React.Fragment>
                                }
                            />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                    </Box>
                ))}



            </List>
        );
    }


    const cardInfoContract = () => {
        return (
            <div className="card user-card-full" style={styles.cardDiv15}>
                <Grid container style={styles.cardDiv16}>
                    <Grid item xs={4} md={4} lg={4} style={styles.cardDiv17}>
                        <Grid style={styles.cardDiv18}>
                            <Grid sx={{ mb: '25px' }}>
                                <BusinessIcon sx={{ verticalAlign: 'middle', width: '65px', height: '65px' }} />
                            </Grid>
                            <h6 style={{ fontWeight: '600', fontSize: '14px' }}>Información Contrato</h6>
                            <p style={{ fontSize: '20px' }}>{contract.DEN}</p>
                        </Grid>
                    </Grid>
                    <Grid item xs={8} md={8} lg={8} >
                        <div style={{ padding: '1.25rem' }} className="card-block">
                            <h6 style={{ borderBottom: '1px solid #e0e0e0', fontWeight: 600, marginBottom: '40px', paddingBottom: '10px', fontSize: '15px' }} className="">Información General
                            </h6>
                            <div className="row">
                                <div className="col-sm-6">
                                    <p style={{ lineHeight: '25px', fontWeight: '400', marginBottom: '7px', fontSize: '15px' }} className="">Nombre Contrato</p>
                                    <h6 style={{ color: '#919aa3', fontWeight: '400', marginBottom: '7px', fontSize: '14px' }} className="">{contract.nombre_contrato}
                                    </h6>
                                </div>
                                <div className="col-sm-6">
                                    <p style={{ lineHeight: '25px', fontWeight: '400', marginBottom: '7px', fontSize: '15px' }} className="">API</p>
                                    <h6 style={{ color: '#919aa3', fontWeight: '400', marginBottom: '7px', fontSize: '14px' }} className="">{contract.API}
                                    </h6>
                                </div>
                                <div className="col-sm-6">
                                    <p style={{ lineHeight: '25px', fontWeight: '400', marginBottom: '7px', fontSize: '15px' }} className="">Proyecto</p>
                                    <h6 style={{ color: '#919aa3', fontWeight: '400', marginBottom: '7px', fontSize: '14px' }} className="">{contract.proyecto}
                                    </h6>
                                </div>
                                <div className="col-sm-6">
                                    <p style={{ lineHeight: '25px', fontWeight: '400', marginBottom: '7px', fontSize: '15px' }} className="">Fecha Inicio</p>
                                    <h6 style={{ color: '#919aa3', fontWeight: '400', marginBottom: '7px', fontSize: '14px' }} className="">{formatDate(contract.fecha_inicio)}
                                    </h6>
                                </div>
                                <div className="col-sm-6">
                                    <p style={{ lineHeight: '25px', fontWeight: '400', marginBottom: '7px', fontSize: '15px' }} className="">Fecha Término</p>
                                    <h6 style={{ color: '#919aa3', fontWeight: '400', marginBottom: '7px', fontSize: '14px' }} className="">{formatDate(contract.fecha_fin)}
                                    </h6>
                                </div>
                            </div>

                        </div>
                    </Grid>
                </Grid>
            </div>)
    };
    const cardEECCContract = () => {
        return (
            <div className="card user-card-full" style={styles.cardDiv15}>
                <Grid container style={styles.cardDiv16}>
                    <Grid item xs={4} md={4} lg={4} style={styles.cardDiv19}>
                        <Grid style={styles.cardDiv18}>
                            <Grid sx={{ mb: '25px' }}>
                                <ContentPasteGoIcon sx={{ verticalAlign: 'middle', width: '65px', height: '65px' }} />
                            </Grid>
                            <h6 style={{ fontWeight: '600', fontSize: '14px' }}>Encargados EECC</h6>
                            <p style={{ fontSize: '20px' }}>{contract.DEN}</p>
                        </Grid>
                    </Grid>
                    <Grid item xs={8} md={8} lg={8} >
                        <div style={{ padding: '1.25rem' }} className="card-block">
                            <h6 style={{ borderBottom: '1px solid #e0e0e0', fontWeight: 600, marginBottom: '40px', paddingBottom: '10px', fontSize: '15px' }} className="">Encargados EECC
                            </h6>
                            <div className="row">

                                {contract.encargadoContratista?.map((encargado, index) => (
                                    <div className="col-sm-6" key={index}>
                                        <p style={{ lineHeight: '25px', fontWeight: '400', marginBottom: '7px', fontSize: '15px' }} className="">{encargado.name}</p>
                                        <h6 style={{ color: '#919aa3', fontWeight: '400', marginBottom: '7px', fontSize: '14px' }} className="">{encargado.email}
                                        </h6>
                                    </div>
                                ))}


                            </div>

                        </div>
                    </Grid>
                </Grid>
            </div>)
    };
    const cardRevisoresPYCContract = () => {
        return (
            <div className="card user-card-full" style={styles.cardDiv15}>
                <Grid container style={styles.cardDiv16}>
                    <Grid item xs={4} md={4} lg={4} style={styles.cardDiv20}>
                        <Grid style={styles.cardDiv18}>
                            <Grid sx={{ mb: '25px' }}>
                                <ContentPasteSearchIcon sx={{ verticalAlign: 'middle', width: '65px', height: '65px' }} />
                            </Grid>
                            <h6 style={{ fontWeight: '600', fontSize: '14px' }}>Revisores P&C</h6>
                            <p style={{ fontSize: '20px' }}>{contract.DEN}</p>
                        </Grid>
                    </Grid>
                    <Grid item xs={8} md={8} lg={8} >
                        <div style={{ padding: '1.25rem' }} className="card-block">
                            <h6 style={{ borderBottom: '1px solid #e0e0e0', fontWeight: 600, marginBottom: '40px', paddingBottom: '10px', fontSize: '15px' }} className="">Revisores P&C
                            </h6>
                            <div className="row">

                                {contract.revisorPYC?.map((encargado, index) => (
                                    <div className="col-sm-6" key={index}>
                                        <p style={{ lineHeight: '25px', fontWeight: '400', marginBottom: '7px', fontSize: '15px' }} className="">{encargado.name}</p>
                                        <h6 style={{ color: '#919aa3', fontWeight: '400', marginBottom: '7px', fontSize: '14px' }} className="">{encargado.email}
                                        </h6>
                                    </div>
                                ))}
                                <div className="col-sm-6" style={{ borderTop: '1px solid rgb(224, 224, 224)', marginTop: '2rem', }}>
                                    <p style={{ lineHeight: '25px', fontWeight: '400', marginBottom: '7px', fontSize: '15px', marginTop: '0.5rem' }} className="">Revisión Obligatoria</p>
                                    <h6 style={{ color: '#919aa3', fontWeight: '400', marginBottom: '7px', fontSize: '14px' }} className="">{contract.revisorPYCRequired ? 'Si' : 'No'}
                                    </h6>
                                </div>


                            </div>

                        </div>
                    </Grid>
                </Grid>
            </div>)
    };
    const cardRevisoresCCContract = () => {
        return (
            <div className="card user-card-full" style={styles.cardDiv15}>
                <Grid container style={styles.cardDiv16}>
                    <Grid item xs={4} md={4} lg={4} style={styles.cardDiv20}>
                        <Grid style={styles.cardDiv18}>
                            <Grid sx={{ mb: '25px' }}>
                                <ContentPasteSearchIcon sx={{ verticalAlign: 'middle', width: '65px', height: '65px' }} />
                            </Grid>
                            <h6 style={{ fontWeight: '600', fontSize: '14px' }}>Revisores CC</h6>
                            <p style={{ fontSize: '20px' }}>{contract.DEN}</p>
                        </Grid>
                    </Grid>
                    <Grid item xs={8} md={8} lg={8} >
                        <div style={{ padding: '1.25rem' }} className="card-block">
                            <h6 style={{ borderBottom: '1px solid #e0e0e0', fontWeight: 600, marginBottom: '40px', paddingBottom: '10px', fontSize: '15px' }} className="">Revisores Construcción
                            </h6>
                            <div className="row">

                                {contract.revisorCC?.map((encargado, index) => (
                                    <div className="col-sm-6" key={index}>
                                        <p style={{ lineHeight: '25px', fontWeight: '400', marginBottom: '7px', fontSize: '15px' }} className="">{encargado.name}</p>
                                        <h6 style={{ color: '#919aa3', fontWeight: '400', marginBottom: '7px', fontSize: '14px' }} className="">{encargado.email}
                                        </h6>
                                    </div>
                                ))}

                                <div className="col-sm-6" style={{ borderTop: '1px solid rgb(224, 224, 224)', marginTop: '2rem', }}>
                                    <p style={{ lineHeight: '25px', fontWeight: '400', marginBottom: '7px', fontSize: '15px', marginTop: '0.5rem' }} className="">Revisión Obligatoria</p>
                                    <h6 style={{ color: '#919aa3', fontWeight: '400', marginBottom: '7px', fontSize: '14px' }} className="">{contract.revisorCCRequired ? 'Si' : 'No'}
                                    </h6>
                                </div>


                            </div>

                        </div>
                    </Grid>
                </Grid>
            </div>)
    };
    const cardRevisoresRRLLContract = () => {
        return (
            <div className="card user-card-full" style={styles.cardDiv15}>
                <Grid container style={styles.cardDiv16}>
                    <Grid item xs={4} md={4} lg={4} style={styles.cardDiv20}>
                        <Grid style={styles.cardDiv18}>
                            <Grid sx={{ mb: '25px' }}>
                                <ContentPasteSearchIcon sx={{ verticalAlign: 'middle', width: '65px', height: '65px' }} />
                            </Grid>
                            <h6 style={{ fontWeight: '600', fontSize: '14px' }}>Revisores RRLL</h6>
                            <p style={{ fontSize: '20px' }}>{contract.DEN}</p>
                        </Grid>
                    </Grid>
                    <Grid item xs={8} md={8} lg={8} >
                        <div style={{ padding: '1.25rem' }} className="card-block">
                            <h6 style={{ borderBottom: '1px solid #e0e0e0', fontWeight: 600, marginBottom: '40px', paddingBottom: '10px', fontSize: '15px' }} className="">Revisores Relaciones Laborales
                            </h6>
                            <div className="row">

                                {contract.revisorRRLL?.map((encargado, index) => (
                                    <div className="col-sm-6" key={index}>
                                        <p style={{ lineHeight: '25px', fontWeight: '400', marginBottom: '7px', fontSize: '15px' }} className="">{encargado.name}</p>
                                        <h6 style={{ color: '#919aa3', fontWeight: '400', marginBottom: '7px', fontSize: '14px' }} className="">{encargado.email}
                                        </h6>
                                    </div>
                                ))}
                                <div className="col-sm-6" style={{ borderTop: '1px solid rgb(224, 224, 224)', marginTop: '2rem', }}>
                                    <p style={{ lineHeight: '25px', fontWeight: '400', marginBottom: '7px', fontSize: '15px', marginTop: '0.5rem' }} className="">Revisión Obligatoria</p>
                                    <h6 style={{ color: '#919aa3', fontWeight: '400', marginBottom: '7px', fontSize: '14px' }} className="">{contract.revisorRRLLRequired ? 'Si' : 'No'}
                                    </h6>
                                </div>


                            </div>

                        </div>
                    </Grid>
                </Grid>
            </div>)
    };
    const cardRevisoresOtroContract = () => {
        return (
            <div className="card user-card-full" style={styles.cardDiv15}>
                <Grid container style={styles.cardDiv16}>
                    <Grid item xs={4} md={4} lg={4} style={styles.cardDiv20}>
                        <Grid style={styles.cardDiv18}>
                            <Grid sx={{ mb: '25px' }}>
                                <ContentPasteSearchIcon sx={{ verticalAlign: 'middle', width: '65px', height: '65px' }} />
                            </Grid>
                            <h6 style={{ fontWeight: '600', fontSize: '14px' }}>Revisores Otros</h6>
                            <p style={{ fontSize: '20px' }}>{contract.DEN}</p>
                        </Grid>
                    </Grid>
                    <Grid item xs={8} md={8} lg={8} >
                        <div style={{ padding: '1.25rem' }} className="card-block">
                            <h6 style={{ borderBottom: '1px solid #e0e0e0', fontWeight: 600, marginBottom: '40px', paddingBottom: '10px', fontSize: '15px' }} className="">Revisores Otra Área
                            </h6>
                            <div className="row">

                                {contract.revisorOtraArea?.map((encargado, index) => (
                                    <div className="col-sm-6" key={index}>
                                        <p style={{ lineHeight: '25px', fontWeight: '400', marginBottom: '7px', fontSize: '15px' }} className="">{encargado.name}</p>
                                        <h6 style={{ color: '#919aa3', fontWeight: '400', marginBottom: '7px', fontSize: '14px' }} className="">{encargado.email}
                                        </h6>
                                    </div>
                                ))}
                                <div className="col-sm-6" style={{ borderTop: '1px solid rgb(224, 224, 224)', marginTop: '2rem', }}>
                                    <p style={{ lineHeight: '25px', fontWeight: '400', marginBottom: '7px', fontSize: '15px', marginTop: '0.5rem' }} className="">Revisión Obligatoria</p>
                                    <h6 style={{ color: '#919aa3', fontWeight: '400', marginBottom: '7px', fontSize: '14px' }} className="">{contract.revisorOtraAreaRequired ? 'Si' : 'No'}
                                    </h6>
                                </div>

                            </div>

                        </div>
                    </Grid>
                </Grid>
            </div>)
    };
    const cardAprobadorContract = () => {
        return (
            <div className="card user-card-full" style={styles.cardDiv15}>
                <Grid container style={styles.cardDiv16}>
                    <Grid item xs={4} md={4} lg={4} style={styles.cardDiv21}>
                        <Grid style={styles.cardDiv18}>
                            <Grid sx={{ mb: '25px' }}>
                                <AssignmentTurnedInIcon sx={{ verticalAlign: 'middle', width: '65px', height: '65px' }} />
                            </Grid>
                            <h6 style={{ fontWeight: '600', fontSize: '14px' }}>Aprobadores </h6>
                            <p style={{ fontSize: '20px' }}>{contract.DEN}</p>
                        </Grid>
                    </Grid>
                    <Grid item xs={8} md={8} lg={8} >
                        <div style={{ padding: '1.25rem' }} className="card-block">
                            <h6 style={{ borderBottom: '1px solid #e0e0e0', fontWeight: 600, marginBottom: '40px', paddingBottom: '10px', fontSize: '15px' }} className="">Aprobadores
                            </h6>
                            <div className="row">

                                {contract.aprobadorCodelco?.map((encargado, index) => (
                                    <div className="col-sm-6" key={index}>
                                        <p style={{ lineHeight: '25px', fontWeight: '400', marginBottom: '7px', fontSize: '15px' }} className="">{encargado.name}</p>
                                        <h6 style={{ color: '#919aa3', fontWeight: '400', marginBottom: '7px', fontSize: '14px' }} className="">{encargado.email}
                                        </h6>
                                    </div>
                                ))}

                            </div>

                        </div>
                    </Grid>
                </Grid>
            </div>)
    };

    const items = [
        {
            name: "cardInfoContract",
        },
        {
            name: "cardEECCContract",
        },
        {
            name: "cardRevisoresPYCContract",
        },
        {
            name: "cardRevisoresCCContract",
        },
        {
            name: "cardRevisoresRRLLContract",
        },
        {
            name: "cardRevisoresOtroContract",
        },
        {
            name: "cardAprobadorContract",
        }
    ]

    const Item = (item) => {
        const name = item.item.name;

        if (name === "cardInfoContract") {
            return cardInfoContract();
        } else if (name === "cardEECCContract") {
            return cardEECCContract();
        } else if (name === "cardRevisoresPYCContract") {
            return cardRevisoresPYCContract();
        } else if (name === "cardRevisoresCCContract") {
            return cardRevisoresCCContract();
        } else if (name === "cardRevisoresRRLLContract") {
            return cardRevisoresRRLLContract();
        } else if (name === "cardRevisoresOtroContract") {
            return cardRevisoresOtroContract();
        } else if (name === "cardAprobadorContract") {
            return cardAprobadorContract();
        }

    }

    return (
        <Box className='container' sx={{ maxWidth: '95%' }}>
            <div className="row my-5">
                <div className="col-md-10 mx-auto">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="text-center mt-2" style={{ marginTop: '1rem' }}> Dashboard Estatus Daily Report </h2>
                            <div style={{ display: 'flex', justifyContent: 'center' }}></div>

                            {cardsStatusDailys()}
                            <Grid container sx={{ mt: '1rem' }} >
                                <Grid className=' ' sx={{ mt: '3rem' }} item xs={12} md={7} lg={8}>
                                    <h3 className="text-center mt-2" style={{ marginBottom: '0.5rem' }}> Calendario </h3>
                                    {calendario()}
                                </Grid>
                                <Grid className=' ' sx={{ mt: '3rem', mb: '3rem' }} item xs={12} md={5} lg={4}>
                                    <h3 className="text-center mt-2" style={{ marginBottom: '0rem' }}> Últimas Actividades </h3>
                                    {listActivities()}
                                </Grid>

                            </Grid>
                            <Grid container sx={{ mt: '1rem' }} >
                                <Grid className='dd ' sx={{ mt: '3rem' }} item xs={12} md={8} lg={8}>
                                    <h3 className="text-center mt-2" style={{ marginBottom: '0rem' }}> Lista Dailys </h3>
                                    <DailysTable dailys={dailys} />
                                </Grid>
                                <Grid className='dd ' sx={{ mt: '3rem' }} item xs={12} md={4} lg={4}>
                                    <h3 className="text-center mt-2" style={{ marginBottom: '1rem' }}> Información Contrato </h3>
                                    <Carousel
                                        next={(next, active) => console.log(`we left ${active}, and are now at ${next}`)}
                                        prev={(prev, active) => console.log(`we left ${active}, and are now at ${prev}`)}
                                        autoPlay={false} // Deshabilita el avance automático
                                        navButtonsAlwaysVisible={true}
                                    >
                                        {
                                            items.map((item, i) => <Item key={i} item={item} />)
                                        }
                                    </Carousel>
                                </Grid>
                            </Grid>





                        </div>

                    </div>
                </div>
            </div>
        </Box>

    )
}