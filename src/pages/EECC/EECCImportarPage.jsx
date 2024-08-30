import React, { useEffect, useState, useContext } from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Typography from '@mui/material/Typography';
import { Link, useParams } from 'react-router-dom';
import { Grid, TextField, Button, Box, FormControl, InputLabel, Select, MenuItem, OutlinedInput, Chip, Checkbox, FormControlLabel, IconButton, Tooltip } from '@mui/material';
import TableEECC from '../../Components/Containers/EECC/EECCImportarTable'
import axios from 'axios';
import { BASE_URL } from '../../helpers/config';
import { AuthContext } from '../../Components/context/authContext'
import { set } from 'react-hook-form';




// const steps = ['Select campaign settings', 'Create an ad group', 'Create an ad'];

const IngresarDaily = ({ }) => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});
  const [steps, setSteps] = useState([]);
  const [dailyInfo, setDailyInfo] = useState({});
  const { accessToken, currentUser } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [currentStep, setCurrentStep] = useState([]);

  const contract_id = currentUser.contract_id;
  //daily_id
  const { daily_id, idSheet } = useParams()

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


      const responseItem = await axios.get(`${BASE_URL}/getItems/${contract_id}`);
      let items = responseItem.data;
      //asigno el nombre de items.item a el campo item.value
      items.forEach((item, index) => {
        items[index].value = item.item;
      });
      items.sort((a, b) => a.item.localeCompare(b.item));

      setItems(items);

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


      const filteredSteps = updatedStepsOrdenados.filter(step => step.idSheet == idSheet);
      setCurrentStep(filteredSteps[0]);

      const responseDaily = await axios.get(`${BASE_URL}/getDaily/${daily_id}`)
      var Daily_info = responseDaily.data;



      setDailyInfo(Daily_info);


    } catch (error) {
      console.error('Error al obtener pasos y campos:', error);
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
    <Box sx={{ width: '90%', margin: '0 auto', mt: '1.5rem' }}>  
    <Box sx={{ mb: '1.2rem' }}>
     <h2 style={{ textAlign: 'center'  }}>Importar Data Daily: {datedaily}</h2>
    </Box>
    <h3 style={{ textAlign: 'left', color:'GrayText' }}>Instrucciones:</h3>
      <p style={{ textAlign: 'left', color:'GrayText' }}> <span style={{ color: 'black' }}>Paso 1:</span> En caso de no tener el formato adecuado en Excel presionar "Descargar Template", recordar utilizar este formato (encabezados) al momento de intentar subir información</p>
      <p style={{ textAlign: 'left', color:'GrayText' }}><span style={{ color: 'black' }}>Paso 2:</span> Presionar "Importar Excel", esto traera la información del Excel deseado</p>
      <p style={{ textAlign: 'left', color:'GrayText'  }}><span style={{ color: 'black' }}>Paso 3:</span>Verificar que el archivo no contenga ningun error de validación, en caso de que tenga, debe modificar la fila en cuestión</p>
      <p style={{ textAlign: 'left', color:'GrayText' }}><span style={{ color: 'black' }}>Paso 4:</span> Presionar "Guardar" para guardar la información en la base de datos</p>
      <p style={{ textAlign: 'left', color:'GrayText'  }}><span style={{ color: 'black' }}>Recordar</span> que en está sección de importar datos, la información no es guardada automaticamente, por lo que una vez tenga la información sin problemas de validación, debe presionar "Guardar Cambios" </p>



      <Box
        component="form"
        // onSubmit=""
        sx={{ width: '95%', margin: '0 auto', mt: '1.5rem' }}
      >
        <Box sx={{ width: '100%' }}>
          <h3> Hoja: {currentStep.sheet}</h3>


          <TableEECC data={currentStep} idDaily={daily_id} contract_id={contract_id} items={items} />



        </Box>
      </Box>
    </Box>
  );
}

export default IngresarDaily;