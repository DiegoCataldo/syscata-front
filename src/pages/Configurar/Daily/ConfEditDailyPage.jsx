import React, { useEffect, useState } from 'react';
import ContractForm from '../../../Components/Containers/Configurar/Daily/ConfEditDailyForm';
import axios from 'axios';
import { BASE_URL } from '../../../helpers/config';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Box, Button } from '@mui/material';


const ContractFormPage = () => {

  const navigate = useNavigate(); 
  const { daily_id } = useParams();

   
  const [daily_info, setDaily_info] = useState([]);
  const [states, setStates] = useState([]);
  const [structures, setStructures] = useState([]);


  useEffect(() => {
    fetchData();

  }, []);

  const fetchData = async () => {
    try {
      const responseDaily = await axios.get(`${BASE_URL}/Dailys/${daily_id}`);
      const daily_infovar = responseDaily.data;
      const contract_id = daily_infovar.contract_id;
      setDaily_info(daily_infovar);
      console.log('Daily info:', daily_infovar);

      const responseStates = await axios.get(`${BASE_URL}/getStates`);
      setStates(responseStates.data);

      const responseStructure = await axios.get(`${BASE_URL}/getStructuresContract/${contract_id}`);
      setStructures(responseStructure.data);


    } catch (error) {
      console.error('Error al obtener los usuarios', error);
    }
  };

  
  
  const handleEditDaily = async (selectedState, selectedStructure) => {

    const dataEnviar = {
      state_id: selectedState,
      daily_structure_id: selectedStructure,
    };

    try {
      const response = await axios.put(`${BASE_URL}/updateDaily/${daily_id}`, dataEnviar);
      console.log('Daily editado:', response.data);
      toast.success('Daily editado con éxito');
      navigate( `/ConfEditDaily/${daily_id}`);
    } catch (error) {
      console.error('Error al editar el daily', error);
      toast.error('Error al editar el daily');
  }
};



  return (
    <Box sx={{ width: '95%', margin: '0 auto', mt: 4}}>
    <div>
      <h2>Editar Daily </h2>
       <ContractForm onSubmit={handleEditDaily} daily_info={daily_info} states={states} structures ={structures} />
    </div>
    </Box>
  );
};

export default ContractFormPage;
