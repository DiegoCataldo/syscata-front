import React, { useEffect, useState } from 'react';
import ContractTable from '../../Components/Containers/EECC/EECCContractsTable';
import { Box, Button } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../helpers/config';
import { toast } from 'react-toastify';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';



const DailyEnviado = () => {

    const { daily_id, contract_id, state_id, nombre_area } = useParams()

    console.log(state_id);
    return (
        <Box sx={{ width: '95%', margin: '0 auto', mt: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

{(state_id == 2 || state_id === 3) && (
                <Box display="flex" flexDirection="column" alignItems="center">

                    <h2 style={{ textAlign: 'center' }}>Daily Report declarado Revisado por {nombre_area} </h2>

                    <Box display="flex" flexDirection="column" alignItems="center">
                        <CheckCircleIcon style={{ color: 'green', fontSize: '50px', marginBottom: '10px' }} />
                        <p>El Daily Report se encuentra en revisión por parte de CODELCO.</p>
                    </Box>
                    <Box display="flex" justifyContent="center" mt={4}>
                        <Button variant="contained" sx={{ margin: '2rem' }} color="primary" component={Link} to="/" startIcon={<CheckCircleIcon />}>
                            Volver al Inicio
                        </Button>
                        <Button component={Link} to={`/EECCverDaily/${daily_id}/${contract_id}`} startIcon={<AutoStoriesIcon />} style={{ backgroundColor: '#37474f' }} sx={{ margin: '2rem' }} variant="contained">
                            Visualizar Daily Report 
                        </Button>
                    </Box>
                </Box>
            )}

            {state_id === 4 && (
                <Box display="flex" flexDirection="column" alignItems="center">

                    <h2 style={{ textAlign: 'center' }}>Daily Report Aprobado</h2>

                    <Box display="flex" flexDirection="column" alignItems="center">
                        <CheckCircleIcon style={{ color: 'green', fontSize: '50px', marginBottom: '10px' }} />
                        <p>El Daily Report se encuentra aprobado.</p>
                    </Box>
                    <Box display="flex" justifyContent="center" mt={4}>
                        <Button variant="contained" sx={{ margin: '2rem' }} color="primary" component={Link} to="/" startIcon={<CheckCircleIcon />}>
                            Volver al Inicio
                        </Button>
                        <Button component={Link} to={`/EECCverDaily/${daily_id}/${contract_id}`} startIcon={<AutoStoriesIcon />} style={{ backgroundColor: '#37474f' }} sx={{ margin: '2rem' }} variant="contained">
                            Visualizar Daily Report 
                        </Button>
                    </Box>
                </Box>
            )}



        </Box>
    );





};

export default DailyEnviado;
