import React, { useEffect, useState } from 'react';
import ContractTable from '../../Components/Containers/EECC/EECCContractsTable';
import { Box, Button } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../helpers/config';
import { toast } from 'react-toastify';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import CancelIcon from '@mui/icons-material/Cancel';




const DailyEnviado = () => {

    const { daily_id, contract_id, respuesta } = useParams()

    console.log(daily_id);
    console.log(contract_id);
    return (
        <Box sx={{ width: '95%', margin: '0 auto', mt: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

{(respuesta == 'Aprobado'  ) && (
                <Box display="flex" flexDirection="column" alignItems="center">

                    <h2 style={{ textAlign: 'center' }}>Daily Report "Aprobado" </h2>

                    <Box display="flex" flexDirection="column" alignItems="center">
                        <CheckCircleIcon style={{ color: 'green', fontSize: '50px', marginBottom: '10px' }} />
                        <p>El Daily Report se encuentra aprobado </p>
                        <p>Si quiere ver la información del Daily Report presione en "Visualizar Daily Report".</p>
                    </Box>
                    <Box display="flex" justifyContent="center" mt={4}>
                        <Button variant="contained" sx={{ margin: '2rem' }} color="primary" component={Link} to="/homeDTS" startIcon={<CheckCircleIcon />}>
                            Volver al Inicio
                        </Button>
                        <Button component={Link} to={`/EECCverDaily/${daily_id}/${contract_id}`} startIcon={<AutoStoriesIcon />} style={{ backgroundColor: '#37474f' }} sx={{ margin: '2rem' }} variant="contained">
                            Visualizar Daily Report 
                        </Button>
                    </Box>
                </Box>
            )}

            {respuesta == 'Rechazado' && (
                <Box display="flex" flexDirection="column" alignItems="center">

                    <h2 style={{ textAlign: 'center' }}>Daily Report Rechazado</h2>

                    <Box display="flex" flexDirection="column" alignItems="center">
                        <CancelIcon style={{ color: 'red', fontSize: '50px', marginBottom: '10px' }} />
                        <p>El Daily se encuentra Rechazado.</p>
                        <p>Se le comunicará a la empresa colaboradora del rechazo del Daily Report y se solicitará el reenvio del mismo</p>
                    </Box>
                    <Box display="flex" justifyContent="center" mt={4}>
                        <Button variant="contained" sx={{ margin: '2rem' }} color="primary" component={Link} to="/homeDTS" startIcon={<CheckCircleIcon />}>
                            Volver al Inicio
                        </Button>
                        <Button component={Link} to={`/EECCverDaily/${daily_id}/${contract_id}`} startIcon={<AutoStoriesIcon />} style={{ backgroundColor: '#37474f' }} sx={{ margin: '2rem' }} variant="contained">
                            Visualizar Daily Report 
                        </Button>
                    </Box>
                </Box>
            )}

{(respuesta == 'Finalizado'  ) && (
                <Box display="flex" flexDirection="column" alignItems="center">

                    <h2 style={{ textAlign: 'center' }}>Daily Report "Finalizado sin Acuerdo" </h2>

                    <Box display="flex" flexDirection="column" alignItems="center">
                        <CheckCircleIcon style={{ color: 'green', fontSize: '50px', marginBottom: '10px' }} />
                        <p>El Daily Report se encuentra finalizado sin acuerdo </p>
                        <p>Si quiere ver la información del Daily Report presione en "Visualizar Daily Report".</p>
                    </Box>
                    <Box display="flex" justifyContent="center" mt={4}>
                        <Button variant="contained" sx={{ margin: '2rem' }} color="primary" component={Link} to="/homeDTS" startIcon={<CheckCircleIcon />}>
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
