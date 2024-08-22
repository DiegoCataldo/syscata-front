import React, { useEffect, useState, useContext } from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Typography from '@mui/material/Typography';
import { Link, useParams } from 'react-router-dom';
import { Grid, TextField, Button, Box, FormControl, InputLabel, Select, MenuItem, OutlinedInput, Chip, Checkbox, FormControlLabel, IconButton, Tooltip } from '@mui/material';

import TableDotacion from '../../../Components/Containers/Programa/DotEquipo/DotDotacionTable'
import TableMaq from '../../../Components/Containers/Programa/DotEquipo/DotMaqTable'
import TableCargoMaq from '../../../Components/Containers/Programa/DotEquipo/DotCargoMaqTable'
import { AuthContext } from '../../../Components/context/authContext'



import axios from 'axios';
import { BASE_URL } from '../../../helpers/config';
import { set } from 'react-hook-form';



// const steps = ['Select campaign settings', 'Create an ad group', 'Create an ad'];

const IngresarPrograma = ({ onSubmit, users, companies }) => {
  const { accessToken, currentUser } = useContext(AuthContext);


  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});
  const contract_id = currentUser.contract_id;
  const [contract, setContract] = useState(null);
  const [mondays, setMondays] = useState([]);
  const [columns, setColumns] = useState([]);
  const [items, setItems] = useState([]);
  const [steps, setSteps] = useState([]);
  const [cargos, setCargos] = useState([]);
  const [maq, setMaq] = useState([]);


  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {

    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? activeStep + 0
        : activeStep + 1;
    setActiveStep(newActiveStep);

  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {

    setActiveStep(step);
  };

  const formContent = (step) => {
    if (steps.length === 0) {
      return <h2>Cargando...</h2>
    }

    if (steps[step].sheet === 'Dotación') {
      return <TableDotacion  contract_id={contract_id} datacolumns={columns} listaCargos={cargos}  />;
    } if (steps[step].sheet === 'Maquinarias') {
      return <TableMaq  contract_id={contract_id} datacolumns={columns} listaMaq ={maq}  />;
    } else if (steps[step].sheet === 'Cargo-Maquinaria') {
      return <TableCargoMaq  contract_id={contract_id}  listaMaq ={maq} listaCargos={cargos} />; 
    }

  };

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
        let columns = mondays;
        columns = [{ name: "categoria" }, ...columns];
        setColumns(columns);

        const responseItem = await axios.get(`${BASE_URL}/getItems/${contract_id}`);
        var items = responseItem.data;
        items.sort((a, b) => a.item.localeCompare(b.item));
        setItems(items);

        //obtengo la estructura del dailySheet
        const responseStructure = await axios.get(`${BASE_URL}/contracts/${contract_id}/dailySheet`);
        const structure = responseStructure.data.steps;
        //de la estructura obtengo los dropdowns de cargo y maquinaria
        const sheetPersonal = structure.find(obj => obj.sheet === 'Personal');
        const fieldCargo = sheetPersonal.fields.find(obj => obj.name === 'Cargo');
        const listCargo = fieldCargo.dropdown_lists;
        setCargos(listCargo);

        const sheetMaquinaria = structure.find(obj => obj.sheet === 'Maquinarias');
        const fieldMaq = sheetMaquinaria.fields.find(obj => obj.name === 'Tipo de Equipo');
        const listMaq = fieldMaq.dropdown_lists;
        setMaq(listMaq);


        const stepvar = [{ sheet: 'Dotación' }, { sheet: 'Maquinarias' }, { sheet: 'Cargo-Maquinaria' }];
        setSteps(stepvar);


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

    <Box
      // onSubmit=""
      sx={{ width: '90%', margin: '0 auto' }}
    >   <h2 style={{ textAlign: 'center' }}>Configurar Programa</h2>

      <Box
        component="form"
        // onSubmit=""
        sx={{ width: '95%', margin: '0 auto' }}
      >
        <Box sx={{ width: '100%' }}>
          <Stepper nonLinear activeStep={activeStep} >
            {steps.map((label, index) => (
              <Step key={label.sheet} completed={completed[index]}>
                <StepButton color="inherit" onClick={handleStep(index)}>
                  {label.sheet}
                </StepButton>
              </Step>
            ))}
          </Stepper>
          <div>
            <React.Fragment>
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Button
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />
                <Button onClick={handleNext} disabled={isLastStep()} sx={{ mr: 1 }}>
                  Next
                </Button>

              </Box>
              <Grid
                item
                xs={12}
                sx={{ padding: '10px' }}
              >
                {formContent(activeStep)}
              </Grid>

            </React.Fragment>

          </div>
        </Box>
      </Box>
    </Box>



  );
}

export default IngresarPrograma;