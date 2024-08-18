import React, { useContext, useEffect, useState } from 'react';
import { Grid, TextField, Button, Box, FormControl, InputLabel, Select, MenuItem, OutlinedInput, Chip, Checkbox, FormControlLabel } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { AuthContext } from '../../../context/authContext';

import { Link } from 'react-router-dom';

const ContractForm = ({ onSubmit, daily_info, states, structures }) => {


  //valores iniciales de id
  const daily_state_id = daily_info.state_id;
  const daily_structrure_id = daily_info.daily_structure_id;

  //valor inicial de estado con info
  const initialState = states.find(state => state.id === daily_state_id);

  const [selectedState, setSelectedState] = useState(daily_state_id || '');
  const [selectedStructure, setSelectedStructure] = useState(daily_structrure_id || '');



  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
  };

  const handleStructureChange = (event) => {
    setSelectedStructure(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    onSubmit(selectedState, selectedStructure);
  };

  useEffect(() => {
    setSelectedState(daily_state_id || '');
    setSelectedStructure(daily_structrure_id || '');
  }, [daily_info, initialState]);

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth>
          <InputLabel id="user-label"> Estado</InputLabel>
            <Select
              labelId="user-label"
              id="user-select"
              value={selectedState}
              onChange={handleStateChange}
            >
              {states?.map((state) => (
                <MenuItem key={state.id} value={state.id}>
                  {state.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
          <InputLabel id="user-label">Daily Structure</InputLabel>
            <Select
              labelId="user-label"
              id="user-select"
              value={selectedStructure}
              onChange={handleStructureChange}
              label={daily_structrure_id ? daily_structrure_id : 'Structure'}
            >
              {structures?.map((structure) => (
                <MenuItem key={structure.id} value={structure.id}>
                  {structure.id}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default ContractForm;
