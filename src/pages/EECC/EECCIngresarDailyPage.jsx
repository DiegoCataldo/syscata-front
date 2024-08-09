import React, { useEffect, useState, useContext } from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Typography from '@mui/material/Typography';
import { Link, useParams } from 'react-router-dom';
import { Grid, TextField, Button, Box, FormControl, InputLabel, Select, MenuItem, OutlinedInput, Chip, Checkbox, FormControlLabel, IconButton, Tooltip } from '@mui/material';
import TableEECC from '../../Components/Containers/EECC/TableIngresarDaily'
import TableResumen from '../../Components/Containers/EECC/EECCResumenStep'
import TableComentarios from '../../Components/Containers/EECC/EECCCommentsTable'
import axios from 'axios';
import { BASE_URL } from '../../helpers/config';
import { AuthContext } from '../../Components/context/authContext'




// const steps = ['Select campaign settings', 'Create an ad group', 'Create an ad'];

const IngresarDaily = ({ onSubmit, users, companies }) => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});
  const [steps, setSteps] = useState([]);
  const [dailyInfo, setDailyInfo] = useState({});
  const { accessToken, currentUser } = useContext(AuthContext);


  const { id, contract_id } = useParams()

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

  useEffect(() => {
    // console.log('entro al useEffect');
    fetchStepsAndFields();

  }, [id]);

  const fetchStepsAndFields = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/Dailys/${id}/dailyStructure`)
      const stepsOrdenados = response.data.steps.map((step) => {
        return {
          ...step,
          fields: step.fields.sort((a, b) => a.step - b.step)
        };
      });

      //le agrego un paso de comentarios al final
      const ComentariosStep = {
        idSheet: 'comentarios',
        sheet: 'Comentarios',
      };

      let updatedStepsOrdenados = [...stepsOrdenados, ComentariosStep];
      //le agrego un paso de resumen al ultimo
      const FinalizarStep = {
        idSheet: 'resumen',
        sheet: 'Resumen',
      };
      updatedStepsOrdenados = [...updatedStepsOrdenados, FinalizarStep];


      const responseItem = await axios.get(`${BASE_URL}/getItems/${id}`);
      let items = responseItem.data;
      //asigno el nombre de items.item a el campo item.value
      items.forEach((item, index) => {
        items[index].value = item.item;
        });
        items.sort((a, b) => a.item.localeCompare(b.item));
        
        updatedStepsOrdenados.forEach((step) => {
          if (step.sheet === "Avances") {
            step.fields.forEach((field) => {
              if (field.name === "Item") {
                field.dropdown_lists = items;
              }
            });
          }
        });


      setSteps(updatedStepsOrdenados);

      const responseDaily = await axios.get(`${BASE_URL}/getDaily/${id}`)
      var Daily_info = responseDaily.data;
      console.log('Daily_info:', Daily_info);

      setDailyInfo(Daily_info);


    } catch (error) {
      console.error('Error al obtener pasos y campos:', error);
    }
  };

  const handleStepClick = (index) => {
    setActiveStep(index);
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

  const handleComplete = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  const formContent = (step) => {
    if (steps.length === 0) {
      return <h2>Cargando...</h2>
    }

    if (steps[step].idSheet === 'resumen') {
      return <TableResumen data={steps} idDaily={id} contract_id={contract_id} currentUser={currentUser} dailyInfo ={dailyInfo} />;
    } else if (steps[step].idSheet === 'comentarios') {
      return <TableComentarios data={steps} idDaily={id} contract_id={contract_id} currentUser={currentUser} />;
    } else {
      return <TableEECC data={steps[step]} idDaily={id} contract_id={contract_id} />;
    }

  };

  return (
    <Box
      // onSubmit=""
      sx={{ width: '90%', margin: '0 auto' }}
    >   <h2 style={{ textAlign: 'center' }}>Ingresar Daily</h2>

      <Box
        component="form"
        // onSubmit=""
        sx={{ width: '95%', margin: '0 auto' }}
      >
        <Box sx={{ width: '100%' }}>
          <Stepper nonLinear activeStep={activeStep} >
            {steps.map((label, index) => (
              <Step key={label.idSheet} completed={completed[index]}>
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
                sx={{ padding: '20px' }}
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

export default IngresarDaily;