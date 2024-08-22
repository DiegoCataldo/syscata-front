import React, { useEffect, useState, useContext } from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Typography from '@mui/material/Typography';
import { Link, useParams } from 'react-router-dom';
import { Grid, TextField, Button, Box, FormControl, InputLabel, Select, MenuItem, OutlinedInput, Chip, Checkbox, FormControlLabel, IconButton, Tooltip } from '@mui/material';

import TableAvance from '../../../Components/Containers/Programa/Avance/AvProgramaTable'
import axios from 'axios';
import { BASE_URL } from '../../../helpers/config';
import { AuthContext } from '../../../Components/context/authContext'

import { set } from 'react-hook-form';



// const steps = ['Select campaign settings', 'Create an ad group', 'Create an ad'];

const IngresarPrograma = ({ onSubmit, users, companies }) => {

  const { accessToken, currentUser } = useContext(AuthContext);

  const contract_id = currentUser.contract_id;

  const [contract, setContract] = useState(null);
  const [mondays, setMondays] = useState([]);
  const [columns, setColumns] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchContract();
    //console.log('mondays', mondays)
  }, [contract_id]);

  const fetchContract = async () => {
    if (contract_id) {
        try {
            const response = await axios.get(`${BASE_URL}/contracts/${contract_id}`);
            const contractvar = response.data;
            setContract(response.data);
            const fecha_inicio = new Date(contractvar.fecha_inicio);
            const fecha_fin = new Date(contractvar.fecha_fin);
            const mondays = getMondays(fecha_inicio, fecha_fin);
            let columns  = mondays;
            columns = [{ name: "item"} ,{ name: 'description'},{ name: 'unidad' }, ...columns];
            //console.log('columns', columns);
            setColumns(columns);
          
            const responseItem = await axios.get(`${BASE_URL}/getItems/${contract_id}`);
            var items = responseItem.data;
            items.sort((a, b) => a.item.localeCompare(b.item));
            setItems(items);
            //console.log('items', items)


        } catch (error) {
          
        }
    }
  }

  const getMondays = (startDate, endDate) => {
    let current = new Date(startDate);
    current.setDate(current.getDate() + (1 + 7 - current.getDay()) % 7); // Set to next Monday
    const mondays = [];
    while (current <= endDate) {
      mondays.push({ name: formatDate(current) });
      current.setDate(current.getDate() + 7);
    }
    return mondays;
  };

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };


  return (
    <Box sx={{ width: '90%', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center' }}>Avances Programa</h2>
      <p style={{ textAlign: 'center' }}>En esta sección podrá ingresar el avance programado de las partidas críticas del contrato</p>


              <Grid item xs={12} sx={{ padding: '10px' }}>
              <TableAvance contract_id={contract_id} datacolumns ={columns} items = {items}  />;
              </Grid>

       
    </Box>
  );
}

export default IngresarPrograma;