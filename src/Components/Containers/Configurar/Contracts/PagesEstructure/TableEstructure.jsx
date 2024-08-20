import { useMemo, useState } from 'react';
import {
  MRT_EditActionButtons,
  MaterialReactTable,
  // createRow,
  useMaterialReactTable,
} from 'material-react-table';
import {
  Box,
  Button,
  TextField,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  Typography,
  Modal,
  Chip,
  Checkbox 
} from '@mui/material';
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ListIcon from '@mui/icons-material/List';
import SaveIcon from '@mui/icons-material/Save';
import { BASE_URL } from '../../../../../helpers/config';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSteps } from './StepsContext';
import FeaturedPlayListIcon from '@mui/icons-material/FeaturedPlayList';
import { render } from 'react-dom';
import { set } from 'react-hook-form';
import CancelIcon from '@mui/icons-material/Cancel';


//list of field types
const ListTypes = [
  'text',
  'integer',
  'list',
  'hour',
  'date'
];
//list of True/False
const ListRequired = [
  'Si', 'No'
];


const Table = ({ handleCreateField, handleSaveField, openDeleteConfirmModal, fields, idSheet, idContract, GuardarDropdown }) => {
  const [validationErrors, setValidationErrors] = useState({});

  const idSheet2 = idSheet
  const idContract2 = idContract

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'Id',
        enableEditing: false,
        size: 80,
      },
      {
        accessorKey: 'name',
        header: 'Nombre Columna',
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.name,
          helperText: validationErrors?.name,
          //remove any previous validation errors when Field focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              name: undefined,
            }),
          //optionally add validation checking for onBlur or onChange
        },
      },
      {
        accessorKey: 'description',
        header: 'Descripción',
        muiEditTextFieldProps: {
          error: !!validationErrors?.description,
          helperText: validationErrors?.description,
          //remove any previous validation errors when Field focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              description: undefined,
            }),
        },
      },
      {
        accessorKey: 'field_type',
        header: 'Tipo de Campo',
        editVariant: 'select',
        editSelectOptions: ListTypes,
        muiEditTextFieldProps: {
          required: true,
          select: true,
          error: !!validationErrors?.field_type,
          helperText: validationErrors?.field_type,
        },
      },

      {
        accessorKey: 'required',
        header: 'Obligatorio',
        editVariant: 'select',
        editSelectOptions: ListRequired,
        muiEditTextFieldProps: {
          select: true,
          required: true,
          error: !!validationErrors?.required,
          helperText: validationErrors?.required,
        },
      },
       {
        accessorKey: 'step',
        header: 'Orden',
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.description,
          helperText: validationErrors?.description,
          //remove any previous validation errors when Field focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              description: undefined,
            }),
          type: 'number', // set the type to 'number' for numeric input
        },
      },
    ],
    [validationErrors],
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);
  const [newItem, setNewItem] = useState('');
  const [updatedDropdownLists, setUpdatedDropdownLists] = useState([]);

  const handleOpenModal = (row) => {
    setCurrentRow(row.original);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {

    setIsModalOpen(false);

  };


  const addDropdown = () => {
    const newDropdown = {
      value: "",
      field_id: currentRow.id,
      id: (Math.random() + 1).toString(36).substring(7),
    };
    setCurrentRow({ ...currentRow, dropdown_lists: [...currentRow.dropdown_lists, newDropdown] });
    // setCurrentRow( ...currentRow, {dropdown_lists: [...currentRow.dropdown_lists, "" ]});

  }

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...currentRow.dropdown_lists];
    list[index].value = value;
    setCurrentRow({ ...currentRow, dropdown_lists: list });
  }

  const handleRemoveDropdown = (index) => {

    const list = [...currentRow.dropdown_lists];

    list.splice(index, 1);
    setCurrentRow({ ...currentRow, dropdown_lists: list });
  }

  const handleGuardarDropdown = async() => {
    setIsModalOpen(false);
    GuardarDropdown(currentRow);
    
  }


  const renderModal = () => (
    <Modal
      open={isModalOpen}
      onClose={handleCloseModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflowY: 'auto', // Add overflowY property to enable vertical scroll
      }}
    >

      <Box sx={{ bgcolor: 'background.paper', boxShadow: 24, paddingLeft: 4, width: '90%', borderRadius: 2, marginTop: '3rem' }}>
        <h2>Modificar Lista Desplegable</h2>
        <Box sx={{ margin: '0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '0.5rem' }}>
          <Button
            id="guardarCambiosButton"
            startIcon={<SaveIcon />}
            style={{ backgroundColor: '#388e3c' }}
            sx={{ marginLeft: '2rem' }}
            variant="contained"
            onClick={ handleGuardarDropdown}
          >
            Guardar Cambios
          </Button>
          <Button color="error" startIcon={<CancelIcon />} sx={{ margin: '2rem' }} variant="outlined" onClick={handleCloseModal}>
            Cancelar Cambios
          </Button>
        </Box>
        <Box>
          {currentRow && currentRow.dropdown_lists.length > 0 && currentRow.dropdown_lists.map((value, index) => (
            <Box key={index} sx={{ margin: '0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '0.5rem' }}>
              <TextField
                sx={{ minHeight: '30px', minWidth: '80%' }} // Adjust the minHeight property to reduce the height of the TextField
                label="Item"
                variant="outlined"
                size="small"
                onChange={(e) => handleChange(e, index)}
                value={value.value}
              />
              <Button sx={{ minHeight: '38px' }} color="error" startIcon={<SaveIcon />} variant="outlined" onClick={() => handleRemoveDropdown(index)}>
                Borrar
              </Button>
            </Box>
          ))}
          <Box sx={{ margin: '0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '2rem' }}>
            <Button startIcon={<SaveIcon />} sx={{ borderColor: '#388e3c' }} variant="outlined" onClick={addDropdown}>
              Agregar Otro Item
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );

  const table = useMaterialReactTable({
    columns,
    data: fields,
    createDisplayMode: 'row', //default ('row', and 'custom' are also available)
    editDisplayMode: 'row', //default ('row', 'cell', 'table', and 'custom' are also available)
    enableEditing: true,
    initialState: { columnVisibility: { id: false } },
    getRowId: (row) => row.id,
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateField,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveField,
    //optionally customize modal content
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (

      <>
        <DialogTitle variant="h3">Crear nueva columna</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          {internalEditComponents} {/* or render custom edit components here */}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>

    ),
    //optionally customize modal content
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Edit Field</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    // row.original.name != 'Item' esto es ya que el item deberia modificarse solo desde la seccion programa
    renderRowActions: ({ row, table }) => (
      
      <Box sx={{ display: 'flex', gap: '1rem' }}>
      {row.original.is_standard !== 'Si' && (
        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
      )}
        {row.original.field_type === 'list' && row.original.name != 'Item' && (
          <Tooltip title="Listas">
            <IconButton onClick={() => handleOpenModal(row)}>
              <ListIcon />
            </IconButton>
          </Tooltip>
        )}
          {row.original.is_standard !== 'Si' && (
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )}
      </Box>

    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Box>
        <Button
          style={{ backgroundColor: '#01579b' }}
          variant="contained"
          startIcon={<FeaturedPlayListIcon />}
          onClick={() => {
            table.setCreatingRow(true); //simplest way to open the create row modal with no default values
            //or you can pass in a row object to set default values with the `createRow` helper function
            // table.setCreatingRow(
            //   createRow(table, {
            //     //optionally pass in default values for the new row, useful for nested data or other complex scenarios
            //   }),
            // );
          }}
        >
          Crear nueva columna
        </Button>
      </Box>
    ),
    /*  state: { 
        isLoading: isLoadingFields,
        isSaving: isCreatingField || isUpdatingField || isDeletingField,
        showAlertBanner: isLoadingFieldsError,
        showProgressBars: isFetchingFields,
      }, */
  });

  return (
    <>
      <MaterialReactTable table={table} />

      {renderModal()}
    </>
  );
}

const queryClient = new QueryClient();

const TableEstructure = ({ data, currentStep, idContract }) => {

  if (!data) return null
  const { steps } = useSteps();
  const { setSteps } = useSteps();
  //tomo las fields y las ordeno segun su step
  const fields = steps[currentStep]?.fields?.sort((a, b) => a.step - b.step) || [];
  const idSheet = data.idSheet
  const [validationErrors, setValidationErrors] = useState({});

  const handleCreateField = async ({ values, table }) => {
    const newValidationErrors = validateField(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});

    const stepValueAsInteger = parseInt(values.step, 10);
    // Generar un ID temporal para el nuevo campo
    const newField = {
      ...values,
      step: stepValueAsInteger,
      id: (Math.random() + 1).toString(36).substring(7),
    };
    // Crear una copia profunda de steps para evitar mutaciones directas
    const newSteps = [...steps];
    // Asegurarse de que el objeto en el currentStep exista y tenga un arreglo de fields
    if (newSteps[currentStep] && Array.isArray(newSteps[currentStep].fields)) {
      newSteps[currentStep].fields = [...newSteps[currentStep].fields, newField];
    } else {
      // Si no existe, inicializarlo con el nuevo campo
      newSteps[currentStep].fields = [{ ...newField }];;
    }
    setSteps(newSteps); // Actualizar el estado global
    table.setCreatingRow(null); // Exit creating mode
  };

  const handleSaveField = async ({ values, table, row }) => {
    const newValidationErrors = validateField(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});

    const newSteps = [...steps];

    newSteps[currentStep].fields = steps[currentStep].fields.map((field) =>
      field.id === row.id ? { ...field, ...values } : field
    );
    setSteps(newSteps); // Actualizar el estado global
    table.setEditingRow(null); // Exit editing mode
  };


  const GuardarDropdown = async (currentRow) => {

    const newSteps = [...steps];
    newSteps[currentStep].fields = steps[currentStep].fields.map((field) =>
      field.id === currentRow.id ? { ...currentRow } : field
    );
    setSteps(newSteps); // Actualizar el estado global
  }

  const openDeleteConfirmModal = (row) => {
    if (window.confirm('Are you sure you want to delete this Field?')) {
      const newSteps = [...steps];

      newSteps[currentStep].fields = steps[currentStep].fields.filter((field) => field.id !== row.original.id);
      console.log('newSteps:', newSteps);

      setSteps(newSteps); // Update local state
    }
  };



  return (
    <QueryClientProvider client={queryClient}>
      <Table
        fields={fields}
        idSheet={idSheet}
        idContract={idContract}
        handleCreateField={handleCreateField}
        handleSaveField={handleSaveField}
        openDeleteConfirmModal={openDeleteConfirmModal}
        GuardarDropdown={GuardarDropdown} />
    </QueryClientProvider>);


};



export default TableEstructure;

const validateRequired = (value) => !!value.length;
const validateEmail = (email) =>
  !!email.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
function validateField(Field) {
  return {
    name: !validateRequired(Field.name) ? ' Name is Required' : '',
    description: !validateRequired(Field.description) ? 'description is Required' : '',
    field_type: !validateRequired(Field.field_type) ? 'field_type is Required' : '',
    //step: !validateRequired(Field.step) ? 'step is Required' : '',  //para el step hay que crear una validación especial ya que al ser numero no me tira el length
  };
}


