import React, { useContext, useEffect, useState } from 'react';
import { Grid, TextField, Button, Box, FormControl, InputLabel, Select, MenuItem, OutlinedInput, Chip, Checkbox, FormControlLabel } from '@mui/material';
import { useForm, Controller, set } from 'react-hook-form';
import { AuthContext } from '../../../context/authContext';
import DeleteIcon from '@mui/icons-material/Delete';


import { Link } from 'react-router-dom';

const ContractForm = ({ onSubmit, users, companies, contract }) => {
  const { control, register, handleSubmit, formState: { errors, }, setValue, getValues } = useForm({
    defaultValues: {
      revisorPYC: [],
      revisorCC: [],
      revisorOtraArea: [],
      encargadoContratista: [],
      aprobadorCodelco: [],
      adminDeTerreno: [],
      visualizador: [],
      revisorRRLL: [],
      revisorPYCRequired: false,
      revisorCCRequired: false,
      revisorOtraAreaRequired: false,
      revisorRRLLRequired: false,
      id_company: contract ? contract.empresa_contratista : ''
    }
  });
  const [selectedApprover, setSelectedApprover] = useState([]);
  const [empresaContratista, setEmpresaContratista] = useState([1]);
  const [isApproverRequired, setIsApproverRequired] = useState({
    revisorPYC: false,
    revisorCC: false,
    revisorOtraArea: false
  });

  const { currentUser, accessToken } = useContext(AuthContext);
  const handleRevisorPYCChange = (selected) => {
    setValue('revisorPYC', selected);
  };
  const handleRemoveRevisorPYC = (id, event) => {
    event.stopPropagation();
    const currentValues = getValues('revisorPYC');
    setValue('revisorPYC', currentValues.filter(value => value !== id));
  };

  const handleRevisorRRLLChange = (selected) => {
    setValue('revisorRRLL', selected);
  };
  const handleRemoveRevisorRRLL = (id, event) => {
    event.stopPropagation();
    const currentValues = getValues('revisorRRLL');
    setValue('revisorRRLL', currentValues.filter(value => value !== id));
  };

  const handleRevisorCCChange = (selected) => {
    setValue('revisorCC', selected);
  };
  const handleRemoveRevisorCC = (id, event) => {
    event.stopPropagation();
    const currentValues = getValues('revisorCC');
    setValue('revisorCC', currentValues.filter(value => value !== id));
  };

  const handleRevisorOtraAreaChange = (selected) => {
    setValue('revisorOtraArea', selected);
  };
  const handleRemoveRevisorOtraArea = (id, event) => {
    event.stopPropagation();
    const currentValues = getValues('revisorOtraArea');
    setValue('revisorOtraArea', currentValues.filter(value => value !== id));
  };

  const handleEncargadoContratistaChange = (selected) => {
    setValue('encargadoContratista', selected);
  };
  const handleRemoveEncargadoContratista = (id, event) => {
    event.stopPropagation();
    const currentValues = getValues('encargadoContratista');
    setValue('encargadoContratista', currentValues.filter(value => value !== id));
  };
  const handleAdminDeTerrenoChange = (selected) => {
    setValue('adminDeTerreno', selected);
  };
  const handleRemoveAdminDeTerreno = (id, event) => {
    event.stopPropagation();
    const currentValues = getValues('adminDeTerreno');
    setValue('adminDeTerreno', currentValues.filter(value => value !== id));
  };

  const handleVisualizadorChange = (selected) => {
    setValue('visualizador', selected);
  };
  const handleRemoveVisualizador = (id, event) => {
    event.stopPropagation();
    const currentValues = getValues('visualizador');
    setValue('visualizador', currentValues.filter(value => value !== id));
  };

  const handleAprobadorCodelcoChange = (selected) => {
    setValue('aprobadorCodelco', selected);
  };
  const handleRemoveAprobadorCodelco = (id, event) => {
    event.stopPropagation();
    const currentValues = getValues('aprobadorCodelco');
    setValue('aprobadorCodelco', currentValues.filter(value => value !== id));
  };

  const customSubmit = (data) => {
    console.log(data);
    onSubmit({ ...data, created_by: currentUser.id });
  };

  useEffect(() => {
    if (contract) {
      setValue('name_contract', contract.nombre_contrato);
      setValue('NSAP', contract.NSAP);
      setValue('DEN', contract.DEN);
      setValue('project', contract.proyecto);
      setValue('id_company', contract.empresa_contratista);
      setValue('API', contract.API);
      setValue('encargadoContratista', contract.encargadoContratista?.map(user => user.id));
      setValue('visualizador', contract.visualizador?.map(user => user.id));
      setValue('adminDeTerreno', contract.adminTerreno?.map(user => user.id));
      setValue('revisorPYC', contract.revisorPYC?.map(user => user.id));
      setValue('revisorCC', contract.revisorCC?.map(user => user.id));
      setValue('revisorOtraArea', contract.revisorOtraArea?.map(user => user.id));
      setValue('start_date', contract.fecha_inicio);
      setValue('end_date', contract.fecha_fin);
      setValue('revisorPYCRequired', contract.revisorPYCRequired);
      setValue('revisorCCRequired', contract.revisorCCRequired);
      setValue('revisorRRLLRequired', contract.revisorOtraAreaRequired);
      setValue('revisorOtraAreaRequired', contract.revisorOtraAreaRequired);
      setValue('revisorRRLL', contract.revisorRRLL?.map(user => user.id));
      setValue('aprobadorCodelco', contract.aprobadorCodelco?.map(user => user.id));

    }
  }, [contract, setValue]);


  return (
    <Box
      component="form"
      onSubmit={handleSubmit(customSubmit)}
      sx={{ width: '90%', margin: '0 auto' }}
    >
      {contract && (
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button type="submit" variant="contained" color="primary" component={Link} to={`/contracts/formato/${contract.id}`}>Editar Formato Daily</Button>
        </Box>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Nombre contrato"
            fullWidth
            {...register('name_contract', { required: 'El campo no puede estar vacío' })}
            error={!!errors.name_contract}
            helperText={errors.name_contract?.message}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="NSAP"
            fullWidth
            {...register('NSAP', { required: 'El campo no puede estar vacío' })}
            error={!!errors.NSAP}
            helperText={errors.NSAP?.message}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="DEN"
            fullWidth
            {...register('DEN', { required: 'El campo no puede estar vacío' })}
            error={!!errors.DEN}
            helperText={errors.DEN?.message}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Proyecto"
            fullWidth
            {...register('project', { required: 'El campo no puede estar vacío' })}
            error={!!errors.project}
            helperText={errors.project?.message}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="API"
            fullWidth
            {...register('API', { required: 'El campo no puede estar vacío' })}
            error={!!errors.API}
            helperText={errors.API?.message}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="company-label">Empresa contratista</InputLabel>
            <Controller
              name="id_company"
              control={control}
              render={({ field }) => (
                <Select
                  labelId="company-label"
                  id="company"
                  {...field}
                  input={<OutlinedInput label="Empresa contratista" />}
                >
                  {companies.map((company) => (
                    <MenuItem key={company.id} value={company.id}>
                      {company.name} ({company.rut_number}-{company.rut_verifier})
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.company && <p style={{ color: 'red' }}>{errors.company.message}</p>}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="encargadoContratista-field-label">Encargado contratista (daily)</InputLabel>
            <Controller
              name="encargadoContratista"
              control={control}
              rules={{ required: 'El campo no puede estar vacío' }}
              render={({ field }) => (
                <Select
                  labelId="encargadoContratista-field-label"
                  id="encargadoContratista"
                  {...field}
                  multiple
                  input={<OutlinedInput label="Encargado contratista (daily)" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip
                          key={value}
                          label={users.find(user => user.id === value)?.name}
                          deleteIcon={

                            <DeleteIcon
                              style={{ color: 'red' }}
                              onMouseDown={(event) => event.stopPropagation()}
                              onClick={(event) => handleRemoveEncargadoContratista(value, event)}
                            />
                          }
                          onDelete={(event) => handleRemoveEncargadoContratista(value, event)}
                        />
                      ))}
                    </Box>
                  )}
                  onChange={(e) => handleEncargadoContratistaChange(e.target.value)}
                >
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.encargadoContratista && <p style={{ color: 'red' }}>{errors.encargadoContratista.message}</p>}
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="adminDeContrato-field-label">Aprobador Codelco (Daily)</InputLabel>
            <Controller
              name="aprobadorCodelco"
              control={control}
              rules={{ required: 'El campo no puede estar vacío' }}
              render={({ field }) => (
                <Select
                  labelId="aprobadorCodelco-field-label"
                  id="aprobadorCodelco"
                  {...field}
                  multiple
                  input={<OutlinedInput label="aprobadorCodelco" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip
                          key={value}
                          label={users.find(user => user.id === value)?.name}
                          deleteIcon={

                            <DeleteIcon
                              style={{ color: 'red' }}
                              onMouseDown={(event) => event.stopPropagation()}
                              onClick={(event) => handleRemoveEncargadoContratista(value, event)}
                            />
                          }
                          onDelete={(event) => handleRemoveAprobadorCodelco(value, event)}
                        />
                      ))}
                    </Box>
                  )}
                  onChange={(e) => handleAprobadorCodelcoChange(e.target.value)}
                >
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.aprobadorCodelco && <p style={{ color: 'red' }}>{errors.aprobadorCodelco.message}</p>}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="adminDeContrato-field-label">Visualizador</InputLabel>
            <Controller
              name="visualizador"
              control={control}

              render={({ field }) => (
                <Select
                  labelId="visualizador-field-label"
                  id="visualizador"
                  {...field}
                  multiple
                  input={<OutlinedInput label="Visualizador" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip
                        key={value}
                        label={users.find(user => user.id === value)?.name}
                        deleteIcon={

                          <DeleteIcon
                            style={{ color: 'red' }}
                            onMouseDown={(event) => event.stopPropagation()}
                            onClick={(event) => handleRemoveVisualizador(value, event)}
                          />
                        }
                        onDelete={(event) => handleRemoveVisualizador(value, event)}
                      />
                    ))}
                  </Box>
                  )}
                  onChange={(e) => handleVisualizadorChange(e.target.value)}
                >
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.visualizador && <p style={{ color: 'red' }}>{errors.visualizador.message}</p>}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="adminDeContrato-field-label">Administrador de terreno</InputLabel>
            <Controller
              name="adminDeTerreno"
              control={control}
              render={({ field }) => (
                <Select
                  labelId="adminDeTerreno-field-label"
                  id="adminDeTerreno"
                  {...field}
                  multiple
                  input={<OutlinedInput label="Administrador de terreno" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip
                          key={value}
                          label={users.find(user => user.id === value)?.name}
                          deleteIcon={

                            <DeleteIcon
                              style={{ color: 'red' }}
                              onMouseDown={(event) => event.stopPropagation()}
                              onClick={(event) => handleRemoveAdminDeTerreno(value, event)}
                            />
                          }
                          onDelete={(event) => handleRemoveAdminDeTerreno(value, event)}
                        />
                      ))}
                    </Box>
                  )}
                  onChange={(e) => handleAdminDeTerrenoChange(e.target.value)}
                >
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.adminDeTerreno && <p style={{ color: 'red' }}>{errors.adminDeTerreno.message}</p>}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} container alignItems="center" spacing={1}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="revisorPYC-field-label">Revisor PYC</InputLabel>
              <Controller
                name="revisorPYC"
                control={control}
                render={({ field }) => (
                  <Select
                    labelId="revisorPYC-field-label"
                    id="revisorPYC"
                    {...field}
                    multiple
                    input={<OutlinedInput label="Revisor PYC" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip
                            key={value}
                            label={users.find(user => user.id === value)?.name}
                            deleteIcon={

                              <DeleteIcon
                                style={{ color: 'red' }}
                                onMouseDown={(event) => event.stopPropagation()}
                                onClick={(event) => handleRemoveRevisorPYC(value, event)}
                              />
                            }
                            onDelete={(event) => handleRemoveRevisorPYC(value, event)}
                          />
                        ))}
                      </Box>
                    )}
                    onChange={(e) => handleRevisorPYCChange(e.target.value)}
                  >
                    {users.map((user) => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.revisorPYC && <p style={{ color: 'red' }}>{errors.revisorPYC.message}</p>}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Controller
                  name="revisorPYCRequired"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      {...field}
                      checked={field.value}
                    />
                  )}
                />
              }
              label="¿Es revisor PYC obligatorio?"
            />
          </Grid>
        </Grid>

        <Grid item xs={12} sm={6} container alignItems="center" spacing={1}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="revisorRRLL-field-label">Revisor RRLL</InputLabel>
              <Controller
                name="revisorRRLL"
                control={control}
                render={({ field }) => (
                  <Select
                    labelId="revisorRRLL-field-label"
                    id="revisorRRLL"
                    {...field}
                    multiple
                    input={<OutlinedInput label="Revisor RRLL" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip
                            key={value}
                            label={users.find(user => user.id === value)?.name}
                            deleteIcon={

                              <DeleteIcon
                                style={{ color: 'red' }}
                                onMouseDown={(event) => event.stopPropagation()}
                                onClick={(event) => handleRemoveRevisorRRLL(value, event)}
                              />
                            }
                            onDelete={(event) => handleRemoveRevisorRRLL(value, event)}
                          />
                        ))}
                      </Box>
                    )}
                    onChange={(e) => handleRevisorRRLLChange(e.target.value)}
                  >
                    {users.map((user) => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.revisorRRLL && <p style={{ color: 'red' }}>{errors.revisorRRLL.message}</p>}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Controller
                  name="revisorRRLLRequired"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      {...field}
                      checked={field.value}
                    />
                  )}
                />
              }
              label="¿Es revisor RRLL obligatorio?"
            />
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6} container alignItems="center" spacing={1}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="revisorCC-field-label">Revisor CC</InputLabel>
              <Controller
                name="revisorCC"
                control={control}
                render={({ field }) => (
                  <Select
                    labelId="revisorCC-field-label"
                    id="revisorCC"
                    {...field}
                    multiple
                    input={<OutlinedInput label="Revisor CC" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip
                            key={value}
                            label={users.find(user => user.id === value)?.name}
                            deleteIcon={

                              <DeleteIcon
                                style={{ color: 'red' }}
                                onMouseDown={(event) => event.stopPropagation()}
                                onClick={(event) => handleRemoveRevisorCC(value, event)}
                              />
                            }
                            onDelete={(event) => handleRemoveRevisorCC(value, event)}
                          />
                        ))}
                      </Box>
                    )}
                    onChange={(e) => handleRevisorCCChange(e.target.value)}
                  >
                    {users.map((user) => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.revisorCC && <p style={{ color: 'red' }}>{errors.revisorCC.message}</p>}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Controller
                  name="revisorCCRequired"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      {...field}
                      checked={field.value}
                    />
                  )}
                />
              }
              label="¿Es revisor CC obligatorio?"
            />
          </Grid>

        </Grid>
        <Grid item xs={12} sm={6} container alignItems="center" spacing={1}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="revisorOtraArea-field-label">Revisor otra área</InputLabel>
              <Controller
                name="revisorOtraArea"
                control={control}
                render={({ field }) => (
                  <Select
                    labelId="revisorOtraArea-field-label"
                    id="revisorOtraArea"
                    {...field}
                    multiple
                    input={<OutlinedInput label="Revisor otra área" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip
                          key={value}
                          label={users.find(user => user.id === value)?.name}
                          deleteIcon={

                            <DeleteIcon
                              style={{ color: 'red' }}
                              onMouseDown={(event) => event.stopPropagation()}
                              onClick={(event) => handleRemoveRevisorOtraArea(value, event)}
                            />
                          }
                          onDelete={(event) => handleRemoveRevisorOtraArea(value, event)}
                        />
                      ))}
                    </Box>
                    )}
                    onChange={(e) => handleRevisorOtraAreaChange(e.target.value)}
                  >
                    {users.map((user) => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.revisorOtraArea && <p style={{ color: 'red' }}>{errors.revisorOtraArea.message}</p>}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Controller
                  name="revisorOtraAreaRequired"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      {...field}
                      checked={field.value}
                    />
                  )}
                />
              }
              label="¿Es otra área obligatorio?"
            />
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            type="date"
            label="Fecha inicio"
            fullWidth
            {...register('start_date', { required: 'El campo no puede estar vacío' })}
            InputLabelProps={{
              shrink: true,
            }}
            error={!!errors.start_date}
            helperText={errors.start_date?.message}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            type="date"
            label="Fecha fin"
            fullWidth
            {...register('end_date', { required: 'El campo no puede estar vacío' })}
            InputLabelProps={{
              shrink: true,
            }}
            error={!!errors.end_date}
            helperText={errors.end_date?.message}
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">Guardar</Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ContractForm;
