import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { BASE_URL, getConfig } from '../../helpers/config';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AuthContext } from '../context/authContext';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Avatar from '@mui/material/Avatar';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Container } from '@mui/material';

import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import CottageIcon from '@mui/icons-material/Cottage';
import MailIcon from '@mui/icons-material/Mail';
import BadgeIcon from '@mui/icons-material/Badge';
import GroupIcon from '@mui/icons-material/Group';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ConstructionIcon from '@mui/icons-material/Construction';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ContentPasteGoIcon from '@mui/icons-material/ContentPasteGo';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FireTruckIcon from '@mui/icons-material/FireTruck';
import Collapse from '@mui/material/Collapse';
import AGlogo from '../../assets/img/AG.png'
import DTSlogo from '../../assets/img/DTS.png'
import BusinessIcon from '@mui/icons-material/Business';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PeopleIcon from '@mui/icons-material/People';
import { useLocation } from 'react-router-dom';





export default function Header() {
    const { accessToken, setAccessToken, currentUser, setCurrentUser } = useContext(AuthContext);
    const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

    const [openConfigurar, setOpenConfigurar] = React.useState(false);
    const [openDailys, setOpenDailys] = React.useState(false);
    const [openPrograma, setOpenPrograma] = React.useState(false);
    const [openAnalitica, setOpenAnalitica] = React.useState(false);
    const [openServicios, setOpenServicios] = React.useState(false);
    const location = useLocation();

    const handleClickConfigurar = () => {
        setOpenConfigurar(!openConfigurar);
    };
    const handleClickDailys = () => {
        setOpenDailys(!openDailys);
    };
    const handleClickPrograma = () => {

        setOpenPrograma(!openPrograma);
    };
    const handleClickAnalitica = () => {
        setOpenAnalitica(!openAnalitica);
    };
    const handleClickServicios = () => {
        setOpenServicios(!openServicios);
    };

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [anchorElUser, setAnchorElUser] = useState(null);

    const logoutUser = async () => {
        try {
            const response = await axios.post(`${BASE_URL}/user/logout`, null, getConfig(accessToken));
            localStorage.removeItem('currentToken');
            localStorage.removeItem('currentUser')
            setCurrentUser(null);
            setAccessToken('');
            toast.success(response.data.message);
        } catch (error) {
            if (error?.response?.status === 401) {
                localStorage.removeItem('currentToken');
                setCurrentUser(null);
                setAccessToken('');
            }
            console.error(error);
        }
    };

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleUserMenuItemClick = (setting) => {
        if (setting === 'Logout') {
            logoutUser();
        }
        handleCloseUserMenu();
    };
    const drawerWidth = 240;

    const homeHeader = () => {
        return(
            <Box sx={{ display: 'flex', backgroundColor: '#39383F' }}>
            <CssBaseline />
            <AppBar
                position="relative" sx={{ backgroundColor: '#39383F' }}
            >
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography
                            variant="h6"
                            noWrap
                            component={Link}
                            to="/homeDTS"
                            sx={{
                                mr: 2,
                                display: { xs: 'none', md: 'flex' },
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            <Box
                                component="img"
                                sx={{

                                    height: 50,
                                    width: 150,
                                    maxHeight: { xs: 233, md: 167 },
                                    maxWidth: { xs: 350, md: 250 },
                                }}
                                alt="The house from the offer."
                                src={AGlogo}
                            />

                        </Typography>

                       



                    </Toolbar>
                </Container>
            </AppBar>
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={handleDrawerToggle}
            >
                <Box sx={{ width: 250, backgroundColor: '#39383F', height: '100%', color: 'white' }} role="presentation">
                    <List >
                        <ListItem component={Link} to="/" key="Inicio" sx={{ color: 'white' }}>
                            <ListItemButton>
                                <ListItemIcon sx={{ color: 'white' }}>
                                    <CottageIcon />
                                </ListItemIcon>
                                <ListItemText primary="Inicio" />
                            </ListItemButton>
                        </ListItem>

                       
                          {/* COMIENZA lista de Servicios */}
         
                        <ListItemButton onClick={handleClickServicios}>
                            <ListItemIcon sx={{ color: 'white' }}>
                                <AssessmentIcon />
                            </ListItemIcon>
                            <ListItemText primary="Servicios" />
                            {openServicios ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
      

                        <Collapse in={openServicios} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding sx={{ color: 'white', backgroundColor: '#312d2d' }}>
                                <ListItem component={Link} to="/homeDTS" key="DTS" sx={{ color: 'white' }}>
                                    <ListItemButton sx={{ pl: 4 }}>
                                        <ListItemIcon sx={{ color: 'white' }}>
                                            <AssignmentIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="DTS" />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem component={Link} to="/" key="WTS" sx={{ color: 'white' }}>
                                    <ListItemButton sx={{ pl: 4 }}>
                                        <ListItemIcon sx={{ color: 'white' }}>
                                            <FireTruckIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="WTS" />
                                    </ListItemButton>
                                </ListItem>

                            </List>
                        </Collapse>
       

                        {/* TERMINA lista de Servicios */}


                    </List>
                </Box>
            </Drawer>
        </Box>
        )
    }

    const dtsHeader = () => {
        return(
            <Box sx={{ display: 'flex', backgroundColor: '#39383F' }}>
            <CssBaseline />
            <AppBar
                position="relative" sx={{ backgroundColor: '#39383F' }}
            >
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography
                            variant="h6"
                            noWrap
                            component={Link}
                            to="/"
                            sx={{
                                mr: 2,
                                display: { xs: 'none', md: 'flex' },
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            <Box
                                component="img"
                                sx={{

                                    height: 50,
                                    width: 150,
                                    maxHeight: { xs: 233, md: 167 },
                                    maxWidth: { xs: 350, md: 250 },
                                }}
                                alt="The house from the offer."
                                src={AGlogo}
                            />

                        </Typography>

                        <Box sx={{ flexGrow: 2, display: 'flex', justifyContent: 'center' }}>
                            <Box
                                component="img"
                                sx={{
                                    height: 60,
                                    width: 120,
                                    maxHeight: { xs: 233, md: 167 },
                                    maxWidth: { xs: 350, md: 250 },
                                }}
                                alt="The house from the offer."
                                src={DTSlogo}
                            />
                        </Box>

                        <Box sx={{ flexGrow: 1 }} />
                        <Box sx={{ marginRight: '1rem' }}>
                            {currentUser && (
                                <Box sx={{ fontSize: '1rem', color: 'white' }}> Contrato: {currentUser.contract_den}</Box>
                            )}
                            {currentUser && (
                                <Box sx={{ fontSize: '0.8rem', color: 'white' }}>Rol: {currentUser.role_name}</Box>
                            )}
                        </Box>
                        <Box sx={{ flexGrow: 0 }}>

                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <AccountCircleIcon sx={{ fontSize: '3rem', color: 'white' }} />
                            </IconButton>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >

                                {settings.map((setting) => (
                                    <MenuItem key={setting} onClick={() => handleUserMenuItemClick(setting)}>
                                        <Typography textAlign="center">{setting}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={handleDrawerToggle}
            >
                <Box sx={{ width: 250, backgroundColor: '#39383F', height: '100%', color: 'white' }} role="presentation">
                    <List >
                        
                        <ListItem component={Link} to="/homeDTS" key="Inicio" sx={{ color: 'white' }}>
                            <ListItemButton>
                                <ListItemIcon sx={{ color: 'white' }}>
                                    <CottageIcon />
                                </ListItemIcon>
                                <ListItemText primary="Inicio" />
                            </ListItemButton>
                        </ListItem>

                        {/* COMIENZA lista de CONFIGURAR */}
                        {currentUser && currentUser.is_super_admin === 'Si' && (
                            <ListItemButton onClick={handleClickConfigurar}>
                                <ListItemIcon sx={{ color: 'white' }}>
                                    <ConstructionIcon />
                                </ListItemIcon>
                                <ListItemText primary="Configurar" />
                                {openConfigurar ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                        )}
                        {currentUser && currentUser.is_super_admin === 'Si' && (
                            <Collapse in={openConfigurar} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding sx={{ color: 'white', backgroundColor: '#312d2d' }}>
                                    <ListItem component={Link} to="/contracts" key="Gestionar contratos" sx={{ color: 'white' }}>
                                        <ListItemButton sx={{ pl: 4 }}>
                                            <ListItemIcon sx={{ color: 'white' }}>
                                                <BadgeIcon />
                                            </ListItemIcon>
                                            <ListItemText primary="Gestionar contratos" />
                                        </ListItemButton>
                                    </ListItem>
                                    <ListItem component={Link} to="/users"  key="Gestionar usuarios" sx={{ color: 'white' }}>
                                        <ListItemButton sx={{ pl: 4 }}>
                                            <ListItemIcon sx={{ color: 'white' }}>
                                                <GroupIcon />
                                            </ListItemIcon>
                                            <ListItemText primary="Gestionar usuarios" />
                                        </ListItemButton>
                                    </ListItem>
                                    <ListItem component={Link} to="/ConfListaDailys"  key="Gestionar Dailys" sx={{ color: 'white' }}>
                                        <ListItemButton sx={{ pl: 4 }}>
                                            <ListItemIcon sx={{ color: 'white' }}>
                                                <AssignmentIcon />
                                            </ListItemIcon>
                                            <ListItemText primary="Gestionar Dailys" />
                                        </ListItemButton>
                                    </ListItem>
                                    <ListItem component={Link} to="/ConfListaCompanies"  key="Gestionar Empresas" sx={{ color: 'white' }}>
                                        <ListItemButton sx={{ pl: 4 }}>
                                            <ListItemIcon sx={{ color: 'white' }}>
                                                <BusinessIcon />
                                            </ListItemIcon>
                                            <ListItemText primary="Gestionar Empresas" />
                                        </ListItemButton>
                                    </ListItem>
                                </List>
                            </Collapse>
                        )}

                        {/* TERMINA lista de CONFIGURAR */}


                        {/* COMIENZA lista de Dailys */}

                        <ListItemButton onClick={handleClickDailys}>
                            <ListItemIcon sx={{ color: 'white' }}>
                                <AssignmentIcon />
                            </ListItemIcon>
                            <ListItemText primary="Dailys" />
                            {openDailys ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>




                        <Collapse in={openDailys} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding sx={{ color: 'white', backgroundColor: '#312d2d' }}>
                                {currentUser && (currentUser.is_super_admin === 'Si' || currentUser.role_id === 8) && (
                                    <ListItem component={Link} to="/EECCDailys" key="Ingresar Dailys" sx={{ color: 'white' }}>
                                        <ListItemButton sx={{ pl: 4 }}>
                                            <ListItemIcon sx={{ color: 'white' }}>
                                                <ContentPasteGoIcon />
                                            </ListItemIcon>
                                            <ListItemText primary="Ingresar Dailys" />
                                        </ListItemButton>
                                    </ListItem>
                                )}
                                {currentUser && (currentUser.is_super_admin === 'Si' || currentUser.role_id === 3 || currentUser.role_id === 4 || currentUser.role_id === 5 || currentUser.role_id === 6) && (
                                    <ListItem component={Link} to="/RevListaDailys" button key="Revisar Dailys" sx={{ color: 'white' }}>
                                        <ListItemButton sx={{ pl: 4 }}>
                                            <ListItemIcon sx={{ color: 'white' }}>
                                                <ContentPasteSearchIcon />
                                            </ListItemIcon>
                                            <ListItemText primary="Revisar Dailys" />
                                        </ListItemButton>
                                    </ListItem>
                                )}
                                 {currentUser && (currentUser.is_super_admin === 'Si' || currentUser.role_id === 10) && (
                                <ListItem component={Link} to="/AproListaDailys" button key="Aprobar Dailys" sx={{ color: 'white' }}>
                                    <ListItemButton sx={{ pl: 4 }}>
                                        <ListItemIcon sx={{ color: 'white' }}>
                                            <AssignmentTurnedInIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Aprobar Dailys" />
                                    </ListItemButton>
                                </ListItem>
                                )}
                            
                                <ListItem component={Link} to="/VisListaDailys" button key="Visualizar Dailys" sx={{ color: 'white' }}>
                                    <ListItemButton sx={{ pl: 4 }}>
                                        <ListItemIcon sx={{ color: 'white' }}>
                                            <FindInPageIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Visualizar Dailys" />
                                    </ListItemButton>
                                </ListItem>
                              

                            </List>
                        </Collapse>


                        {/* TERMINA lista de Dailys */}

                        {/* COMIENZA lista de Programa */}
                        {currentUser && (currentUser.is_super_admin === 'Si' || currentUser.role_id === 8) && (
                        <ListItemButton onClick={handleClickPrograma}>
                            <ListItemIcon sx={{ color: 'white' }}>
                                <CalendarMonthIcon />
                            </ListItemIcon>
                            <ListItemText primary="Programa" />
                            {openPrograma ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        )}
                        {currentUser && (currentUser.is_super_admin === 'Si' || currentUser.role_id === 8) && (
                        <Collapse in={openPrograma} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding sx={{ color: 'white', backgroundColor: '#312d2d' }}>
                                <ListItem component={Link} to="/AvPrograma" key="Avances" sx={{ color: 'white' }}>
                                    <ListItemButton sx={{ pl: 4 }}>
                                        <ListItemIcon sx={{ color: 'white' }}>
                                            <BadgeIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Avances" />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem component={Link} to="/DotPrograma" key="Dotación" sx={{ color: 'white' }}>
                                    <ListItemButton sx={{ pl: 4 }}>
                                        <ListItemIcon sx={{ color: 'white' }}>
                                            <GroupIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Dotación" />
                                    </ListItemButton>
                                </ListItem>

                            </List>
                        </Collapse>
                        )}

                        {/* TERMINA lista de Programa */}

                          {/* COMIENZA lista de Analitica */}
                          {currentUser  && (
                        <ListItemButton onClick={handleClickAnalitica}>
                            <ListItemIcon sx={{ color: 'white' }}>
                                <AssessmentIcon />
                            </ListItemIcon>
                            <ListItemText primary="Analítica" />
                            {openAnalitica ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        )}
                        {currentUser && (
                        <Collapse in={openAnalitica} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding sx={{ color: 'white', backgroundColor: '#312d2d' }}>
                                <ListItem component={Link} to="/AnPersonal" key="Personal" sx={{ color: 'white' }}>
                                    <ListItemButton sx={{ pl: 4 }}>
                                        <ListItemIcon sx={{ color: 'white' }}>
                                            <PeopleIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Personal" />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem component={Link} to="/AnMaquinaria" key="Maquinaria" sx={{ color: 'white' }}>
                                    <ListItemButton sx={{ pl: 4 }}>
                                        <ListItemIcon sx={{ color: 'white' }}>
                                            <FireTruckIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Maquinaria" />
                                    </ListItemButton>
                                </ListItem>

                            </List>
                        </Collapse>
                        )}

                        {/* TERMINA lista de Analitica */}


                    </List>
                </Box>
            </Drawer>
        </Box>
        )
    }

    return (
      <Box>
            {location.pathname === '/' ? homeHeader() : dtsHeader()}
        </Box>
    );
}
