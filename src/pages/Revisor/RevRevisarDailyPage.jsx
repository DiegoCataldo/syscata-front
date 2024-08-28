import React, { useEffect, useState, useContext } from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Typography from '@mui/material/Typography';
import { Link, useParams } from 'react-router-dom';
import { Grid, TextField, Button, Box, FormControl, InputLabel, Select, MenuItem, OutlinedInput, Chip, Checkbox, FormControlLabel, IconButton, Tooltip } from '@mui/material';
import TableSteps from '../../Components/Containers/Revisor/RevRevisarDailyTable';
import TableResumen from '../../Components/Containers/Revisor/RevRevisarResumenStep'
import TableComentarios from '../../Components/Containers/Revisor/RevRevisarCommentsTable'
import axios from 'axios';
import { BASE_URL } from '../../helpers/config';
import { AuthContext } from '../../Components/context/authContext'




// const steps = ['Select campaign settings', 'Create an ad group', 'Create an ad'];

const IngresarDaily = ({ onSubmit, users, companies }) => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});
  const [steps, setSteps] = useState([]);
  const [rol_info, setRol_info] = useState(0);
  const { currentUser } = useContext(AuthContext);
  const [dailyInfo, setDailyInfo] = useState({});

const contract_id = currentUser.contract_id;
const role_id = currentUser.role_id;

  const { id } = useParams()

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

      //le agrego un paso de resumen al final
      const FinalizarStep = {
        idSheet: 'resumen',
        sheet: 'Resumen',
      };
      let updatedStepsOrdenados = [...stepsOrdenados, FinalizarStep];

      //le agrego un paso de comentarios al final
      const ComentariosStep = {
        idSheet: 'comentarios',
        sheet: 'Comentarios',
      };
      updatedStepsOrdenados = [...updatedStepsOrdenados, ComentariosStep];

      setSteps(updatedStepsOrdenados);

      const responseRol = await axios.get(`${BASE_URL}/getRolinfo/${role_id}`)
      // console.log('responseRol', responseRol.data);
      setRol_info(responseRol.data);
      
      const responseDaily = await axios.get(`${BASE_URL}/getDaily/${id}`)
      var Daily_info = responseDaily.data;
      setDailyInfo(Daily_info);

    } catch (error) {
      console.error('Error al obtener pasos y campos:', error);
    }
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

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  const formContent = (step) => {
    if (steps.length === 0) {
      return <h2>Cargando...</h2>
    }

    if (steps[step].idSheet === 'resumen') {
      return <TableResumen data={steps} idDaily={id} contract_id={contract_id} />;
    }else if (steps[step].idSheet === 'comentarios') {
      return <TableComentarios data={steps} idDaily={id} contract_id={contract_id} currentUser={currentUser} rol_info={rol_info} />;
    } else {
      return <TableSteps data={steps[step]} idDaily={id} contract_id={contract_id} />;
    }

  };

  const formatDateTime = (date) => {
    const parsedDate = new Date(date);
    const utcDate = new Date(parsedDate.getTime() + parsedDate.getTimezoneOffset() * 60000);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = utcDate.toLocaleDateString('es-ES', options);
    return formattedDate;
};

  const datedaily = dailyInfo.date ? formatDateTime(dailyInfo.date) : '';

  return (
    <Box
      // onSubmit=""
      sx={{ width: '90%', margin: '0 auto', mt: '1rem' }}
    >   <h2 style={{ textAlign: 'center' }}>Revisar Daily: {datedaily}</h2>

      <Box
        component="form" sx={{ width: '95%', margin: '0 auto', mt: '2rem' }}
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