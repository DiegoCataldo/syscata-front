import React, { useEffect, useState, createContext, useContext } from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Typography from '@mui/material/Typography';
import { Link, useParams } from 'react-router-dom';
import { Grid, TextField, Button, Box, FormControl, InputLabel, Select, MenuItem, OutlinedInput, Chip, Checkbox, FormControlLabel, IconButton, Tooltip, Modal } from '@mui/material';
import TableEstructure from '../../Components/Containers/Configurar/Contracts/PagesEstructure/TableEstructure'
import TableHojas from '../../Components/Containers/Configurar/Contracts/PagesEstructure/TableHojas'
import axios from 'axios';
import { BASE_URL } from '../../helpers/config';
import { toast } from 'react-toastify';
import { StepsProvider, useSteps } from '../../Components/Containers/Configurar/Contracts/PagesEstructure/StepsContext';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import SaveIcon from '@mui/icons-material/Save';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { blueGrey, red } from '@mui/material/colors';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CancelIcon from '@mui/icons-material/Cancel';




const ContractFormato = ({ onSubmit, users, companies }) => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [objetoInicial, setObjetoInicial] = useState([]);
  const [completed, setCompleted] = React.useState({});
  const { steps } = useSteps();
  const { setSteps } = useSteps();
  const { id } = useParams();
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
    fetchStepsAndFields();
  }, [id]);
  const fetchStepsAndFields = async () => {
    if (steps.length === 0) {
      try {
        const response = await axios.get(`${BASE_URL}/contracts/${id}/dailySheet`)
        setSteps(response.data.steps);
        if (objetoInicial.length === 0) {
          // Realiza una copia profunda de response.data.steps antes de establecer el estado
          let stepsDeepCopy = JSON.parse(JSON.stringify(response.data.steps));
          //obtener items
          const responseItem = await axios.get(`${BASE_URL}/getItems/${id}`);
          let items = responseItem.data;

          //asigno el nombre de items.item a el campo item.value
          items.forEach((item, index) => {
            items[index].value = item.item;
            });  
            //modifico los dropdowns de la hoja de avances ya que los dropdowns de items deberian venir de la tabla items.
            stepsDeepCopy.forEach((step) => {
              if (step.sheet === "Avances") {
                step.fields.forEach((field) => {
                  if (field.name === "Item") {
                    field.dropdown_lists = items;
                  }
                });
              }
            });
            
   
            console.log('stepsDeepCopy:', stepsDeepCopy);

          setObjetoInicial(stepsDeepCopy);

          console.log('stepsDeepCopy:', stepsDeepCopy);
        }
      } catch (error) {
        console.error('Error al obtener pasos y campos:', error);
      }
    }
  };


  const handleNext = () => {
    console.log('inicialSteps:', objetoInicial);
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
  const sendData = async () => {
    console.log('steps:', steps);
    console.log('objetoInicial:', objetoInicial);
//esto es para saber si las hojas y fields originales son iguales a las actuales (sin tomar en cuenta los dropdowns)
//la idea es que si solo se modificaron los dropdowns no se genere un nuevo structure daily
    const steps2 = steps.map((step) => {
      const updatedFields = Array.isArray(step.fields) ? step.fields.map((field) => {
        const { dropdown_lists, ...rest } = field;
        return rest;
      }) : [];
      return { ...step, fields: updatedFields };
    });
    const objetoInicial2 = objetoInicial.map((step) => {
      const updatedFields = Array.isArray(step.fields) ? step.fields.map((field) => {
        const { dropdown_lists, ...rest } = field;
        return rest;
      }) : [];
      return { ...step, fields: updatedFields };
    });
    const areFieldsNameEqual = (steps1, steps2) => {
      for (let i = 0; i < steps1.length; i++) {
        const fields1 = steps1[i].fields || [];
        const fields2 = steps2[i].fields || [];
        for (let j = 0; j < fields1.length; j++) {
          if (
            fields1[j].name !== fields2[j].name ||
            fields1[j].description !== fields2[j].description ||
            fields1[j].field_type !== fields2[j].field_type ||
            fields1[j].step !== fields2[j].step
          ) {
            return false;
          }
        }
      }
      return true;
    };
    const areObjectsEqual = (obj1, obj2) => {
      return JSON.stringify(obj1) === JSON.stringify(obj2);
    };
    var iguales = '';
    if (areObjectsEqual(steps2, objetoInicial2) && areFieldsNameEqual(steps2, objetoInicial2)) {
      iguales = "si"
    } else {
      iguales = "no"
    }
    console.log('iguales:', iguales);
    const response = await axios.post(`${BASE_URL}/dailyStructure/create/${id}/${iguales}`, steps);
    toast.success('Campo creado exitosamente');
  };
  const stepStyle = {
    boxShadow: 2,
    backgroundColor: "rgba(0,0,0,0.1)",
    padding: 2,
    "& .Mui-active": {
      "&.MuiStepIcon-root": {
        color: "warning.main",
        fontSize: "2rem",
      },
      "& .MuiStepConnector-line": {
        borderColor: "warning.main"
      }
    },
    "& .Mui-completed": {
      "&.MuiStepIcon-root": {
        color: "secondary.main",
        fontSize: "2rem",
      },
      "& .MuiStepConnector-line": {
        borderColor: "secondary.main"
      }
    }
  }
  const formContent = () => {
    return <TableEstructure
      key={activeStep}
      data={steps[activeStep]}
      currentStep={activeStep}
      idContract={id}
    />;
  };

  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  return (
    <Box sx={{ width: '95%', margin: '0 auto', justifyContent: 'center', alignItems: 'center' }}>
      <h2>Modificar Estructura Daily</h2>
      <Box
        sx={{ width: '100%', margin: '0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center', paddingBottom: '2rem' }}
      >
        <Tooltip title="Guardar Cambios">
          <Button
            id="guardarCambiosButton"
            startIcon={<SaveIcon />}
            style={{ backgroundColor: '#388e3c' }}
            sx={{ marginLeft: '2rem' }}
            variant="contained"
            onClick={() => {
              if (window.confirm('¿Estás seguro de guardar los cambios?')) {
                sendData();
                alert('Cambios guardados exitosamente');
              }
            }}
          >
            Guardar Cambios
          </Button>
        </Tooltip>

        <Button  // este boton deberia recargar la pagina con un boton de alerta asi la variable step retorna a como esta en la base de datos
          color="error" startIcon={<CancelIcon />} sx={{ margin: '2rem' }} variant="outlined" onClick={handleOpenModal}>
          Cancelar Cambios
        </Button>
      </Box>
      <Box component="form" sx={{ width: '95%', margin: '0 auto' }}>
        <Box sx={{ width: '100%' }}>
          <Stepper nonLinear activeStep={activeStep}>
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
                <Button variant="outlined" sx={{ color: '#01579b', borderColor: '#01579b', maxHeight: '35px' }} startIcon={<ArrowBackIosIcon />} disabled={activeStep === 0} onClick={handleBack} >
                  Back
                </Button>
                <Box
                  sx={{ width: '100%', margin: '0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center', paddingBottom: '1rem' }}
                ><Button startIcon={<AutoStoriesIcon />} style={{ backgroundColor: '#37474f' }} sx={{ marginTop: '0rem' }} variant="contained" onClick={handleOpenModal}>
                    Modificar Hojas
                  </Button>
                </Box>
                <Box sx={{ flex: '1 1 auto' }} />
                <Button variant="outlined" sx={{ color: '#01579b', borderColor: '#01579b', maxHeight: '35px' }} endIcon={<ArrowForwardIosIcon />} onClick={handleNext} disabled={isLastStep()} >
                  Next
                </Button>
              </Box>
              <Grid item xs={12} sx={{ padding: '20px' }}>
                {formContent()}
              </Grid>
            </React.Fragment>
          </div>
        </Box>
      </Box>
      {openModal && (
        <Modal open={openModal} onClose={handleCloseModal} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description"
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{ bgcolor: 'background.paper', boxShadow: 24, p: 4, width: '90%', borderRadius: 2 }}>
            <Box sx={{ margin: '0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
              <Button startIcon={<SaveIcon />} sx={{ borderColor: '#388e3c' }} variant="outlined" onClick={handleCloseModal} >Cerrar</Button>
            </Box>
            <TableHojas />
          </Box>
        </Modal>
      )}
    </Box>
  );
}
export default () => (
  <StepsProvider>
    <ContractFormato />
  </StepsProvider>
);