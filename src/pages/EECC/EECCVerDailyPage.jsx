import React, { useEffect, useState } from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Typography from '@mui/material/Typography';
import { Link, useParams } from 'react-router-dom';
import { Grid, TextField, Button, Box, FormControl, InputLabel, Select, MenuItem, OutlinedInput, Chip, Checkbox, FormControlLabel, IconButton, Tooltip } from '@mui/material';
import TableEECC from '../../Components/Containers/EECC/TableVerDaily'
import TableResumen from '../../Components/Containers/EECC/EECCverDailyResumen'
import axios from 'axios';
import { BASE_URL } from '../../helpers/config';



// const steps = ['Select campaign settings', 'Create an ad group', 'Create an ad'];

const IngresarDaily = ({ onSubmit, users, companies }) => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});
  const [steps, setSteps] = useState([]);


  const { daily_id, contract_id } = useParams()

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
    
}, [daily_id]);

const fetchStepsAndFields = async () => {
  try { 
      const response = await axios.get(`${BASE_URL}/Dailys/${daily_id}/dailyStructure`)
      const stepsOrdenados = response.data.steps.map((step) => {
        return {
          ...step,
          fields: step.fields.sort((a, b) => a.step - b.step)
        };
      });
      
//le agrego un paso de resumen al ultimo
      const FinalizarStep = {
        idSheet: 'resumen',
        sheet: 'Resumen',
      };
      const updatedStepsOrdenados = [...stepsOrdenados, FinalizarStep];
      setSteps(updatedStepsOrdenados);

  } catch (error) {
      console.error('Error al obtener pasos y campos:', error);
  }
};


    
  const handleNext = () => {

    const newActiveStep =
    isLastStep() && !allStepsCompleted()
      ?  activeStep + 0
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
    if(steps.length === 0){
      return <h2>Cargando...</h2>
    }

    if(steps[step].idSheet === 'resumen'){
      return <TableResumen data={steps } idDaily = {daily_id} contract_id = {contract_id} />;
    }else{
      return <TableEECC  data={steps[step]} idDaily = {daily_id} contract_id = {contract_id} />;
    }
    
  };

  return (
    <Box
   // onSubmit=""
    sx={{ width: '90%', margin: '0 auto' }}
  >
   <h2 style={{ textAlign: 'center' }}>Visualizar Daily</h2>

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
                  <Button onClick={handleNext }   disabled={isLastStep()} sx={{ mr: 1 }}>
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