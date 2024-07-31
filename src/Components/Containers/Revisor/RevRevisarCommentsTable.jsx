import { useMemo, useState, useEffect, useRef } from 'react';
import {
  MRT_EditActionButtons,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Select,
  Tooltip,
} from '@mui/material';
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQueryClient,
  useQuery,
} from '@tanstack/react-query';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { BASE_URL } from '../../../helpers/config';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import SaveIcon from '@mui/icons-material/Save';


const TableP = ({ fields, idSheet, idDaily, contract_id, currentUser, rol_info }) => {
  const [validationErrors, setValidationErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableDailys, setAvailableDailys] = useState([]);
  const [selectedDaily, setSelectedDaily] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10000);
  const [nombreArea, setNombreArea] = useState('');
  const navigate = useNavigate();




  //estas variables son para guardar valores temporales principalmente para la funcion de hh trabajadas
  const [rowValuesTemp, setRowValuesTemp] = useState({});
  const [sorting, setSorting] = useState([]);


  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'Id',
        enableEditing: false,
        size: 80,
      },


      {
        accessorKey: 'user_name',
        header: 'Usuario',
        enableEditing: false,
        muiEditTextFieldProps: {
          required: false,

          //optionally add validation checking for onBlur or onChange
        },
      },

      {
        accessorKey: 'role_name',
        header: 'Rol del Usuario',
        enableEditing: false,
        muiEditTextFieldProps: {
          required: false,
        },
      },

      {
        accessorKey: 'comentario',
        header: 'Comentario',
        muiEditTextFieldProps: {
          required: false,
        },
      },

    ],
    [validationErrors],
  );

  const resetRowValues = () => {
    setRowValuesTemp({});
  }

  const {
    data: fetchedData = [],
    isError: isLoadingUsersError,
    isFetching: isFetchingUsers,
    isLoading: isLoadingUsers,
  } = useGetRows(idDaily, idSheet, rol_info);

  // Hooks y manejadores de Crear, Actualizar, Eliminar
  const { mutateAsync: createField, isPending: isCreatingField } = useCreateField();
  const { mutateAsync: updateField, isPending: isUpdatingField } = useUpdateField();
  const { mutateAsync: deleteField, isPending: isDeletingField } = useDeleteField();


  const handleCreateField = async ({ values, table, idSheet }) => {


    //console.log('values', values);
    //console.log('rowValuesTemp', rowValuesTemp);
    //console.log('idSheet', idSheet);

    var transformedValues = [];

    transformedValues['daily_id'] = idDaily;
    transformedValues['user_id'] = currentUser.id;
    transformedValues['role_id'] = rol_info.id;
    transformedValues['comentario'] = values['comentario'];
    const transformedValuesObj = Object.assign({}, transformedValues);


    await createField(transformedValuesObj);
    toast.success('Campos creados exitosamente');
    table.setCreatingRow(null);
    resetRowValues();
    setValidationErrors({});
  };


  const handleSaveField = async ({ values, row, table }) => {
    // console.log('valuesHandleSave', values);
    //este es el id correlativo que da la tabla
    const rowId = row.id;
    // este es el id de la row de la base de datos
    // const idname = `id-${idSheet}`;
    const idValue = row.original['id'];


    var transformedValues = [];

    transformedValues['daily_id'] = idDaily;
    transformedValues['daily_sheet_id'] = idSheet;
    transformedValues['id'] = idValue;
    const transformedValuesObj = Object.assign({}, transformedValues);

    // console.log('handlesave  transformedValuesObj', transformedValuesObj);


    const newValidationErrors = validateCurrentSheetFields(idSheet, fetchedData.fields, values);

    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }

    await updateField(transformedValuesObj);
    toast.success('Actualizado exitosamente');
    table.setEditingRow(null);
    setValidationErrors({});
  };
  const openDeleteConfirmModal = (row) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este campo?')) {
      const idname = `id-${idSheet}`;
      const idValue = row.original[idname];
      deleteField({ row: idValue });
    }
  };
  const rowVirtualizerInstanceRef = useRef(null);

  useEffect(() => {
    //scroll to the top of the table when the sorting changes

    if (!rol_info) return;
    if (rol_info.name === 'revisor_pyc') {
      setNombreArea('Área de P&C');
    } else if (rol_info.name === 'revisor_cc') {
      setNombreArea('Área de Construcción');
    } else if (rol_info.name === 'revisor_otra_area') {
      setNombreArea('Área Otra');
    } else if (rol_info.name === 'revisor_rrll') {
      setNombreArea('Área de Relaciones Laborales');
    }

  }, [rol_info]);

  useEffect(() => {
    //scroll to the top of the table when the sorting changes
    console.log('rowVirtualizerInstanceRef', rowVirtualizerInstanceRef);
    if (!rowVirtualizerInstanceRef.current) return;
    try {
      rowVirtualizerInstanceRef.current?.scrollToIndex?.(0);
    } catch (error) {
      console.error(error);
    }
  }, [sorting]);


  const sendData = async () => {
    console.log('fetchedData', fetchedData);
    const response = await axios.post(`${BASE_URL}/revisarDaily/${rol_info.id}/${idDaily}`);

    if (response.status === 200) {
      navigate(`/RevDailyRevisado/${idDaily}/${contract_id}/${fetchedData.state_id}/${nombreArea}`);
    }
}



  const table = useMaterialReactTable({
    columns,
    data: fetchedData.comentarios ? fetchedData.comentarios : [],
    enablePagination: true,
    displayColumnDefOptions: {
      'mrt-row-actions': {
        size: 100,
      },
      'mrt-row-expand': {
        size: 10,
      },
    },
    createDisplayMode: 'row',
    editDisplayMode: 'row',
    enableEditing: true,
    rowVirtualizerInstanceRef, //optional
    rowVirtualizerOptions: { overscan: 5 }, //optionally customize the row virtualizer
    columnVirtualizerOptions: { overscan: 2 }, //optionally customize the column virtualizer
    enableRowVirtualization: true,
    onSortingChange: setSorting,
    getRowId: (row) => row.id,
    enableRowNumbers: true,
    muiTableContainerProps: { sx: { minHeight: '500px', maxHeight: '800px' } },
    muiPaginationProps: {
      rowsPerPageOptions: [10, 50, 100, 1000, 2000],
      showFirstButton: true,
      showLastButton: false,
    },
    muiTableBodyCellProps: {
      sx: {
        align: 'center',
        textAlign: 'center',
        border: '0.01px solid rgba(81, 81, 81, .08)',
        fontWeight: 'normal',
      },
    },
    muiTableHeadCellProps: {
      sx: {
        align: 'center',
        textAlign: 'center',
        border: '0.01px solid rgba(81, 81, 81, .08)',


      },
    },
    onCreatingRowCancel: () => {
      setValidationErrors({});
      resetRowValues();
    },

    onCreatingRowSave: async ({ values, table }) => {
      await handleCreateField({ values, table, idSheet, idDaily });
    },
    onEditingRowCancel: () => {
      setValidationErrors({});
    },

    onEditingRowSave: async ({ values, row, table }) => {
      await handleSaveField({ values, row, table });
      resetRowValues();
    },

    renderRowActions: ({ row, table }) => (
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '150px' }}>
        <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '8px' }}>
          <Tooltip title="Editar" sx={{}}>
            <IconButton onClick={() => table.setEditingRow(row)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar">
            <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </div>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Button variant="contained" onClick={() => table.setCreatingRow(true)}>
          NUEVO REGISTRO
        </Button>

      </Box>

    ),
    state: {
      isLoading: isLoadingUsers,
      showAlertBanner: isLoadingUsersError,
      showProgressBars: isFetchingUsers,
      isSaving: isCreatingField || isUpdatingField || isDeletingField,
    },
  });

  return (
    <Box sx={{ width: '100%', margin: '0 auto', justifyContent: 'center', alignItems: 'center', paddingBottom: '2rem' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>

        {fetchedData.Daily_revisado_area === 'No' && (
          <Tooltip title="Enviar Daily Report">
            <Button
              id="guardarCambiosButton"
              startIcon={<SaveIcon />}
              style={{ backgroundColor: '#388e3c' }}
              variant="contained"
              onClick={() => {
                if (window.confirm('Al confirmar, se le confirmará al aprobador Codelco que el Daily Report se encuentra revisado por tu área. ¿Estás seguro de querer continuar?')) {
                  sendData();
                  alert('Cambios guardados exitosamente');
                }
              }}
            >
              Declarar Revisado por {nombreArea}
            </Button>
          </Tooltip>
        )}
       
      </Box>
      <Box sx={{ width: '95%', margin: '0 auto', justifyContent: 'center', alignItems: 'center' }}>
        <MaterialReactTable table={table} />
      </Box>
    </Box>
  );
};


//READ hook (get fields from api)
function useGetRows(idDaily, idSheet, rol_info) {

  return useQuery({
    queryKey: ['fields', idSheet],
    queryFn: async () => {

      //rows
      const response = await axios.get(`${BASE_URL}/Dailys/${idDaily}/dailyStructure`)
      var comentarios = response.data.comentarios;
      console.log('comentarios:', comentarios);
      const responseDaily = await axios.get(`${BASE_URL}/getDaily/${idDaily}`)
      var Daily_info = responseDaily.data;
      console.log('Daily_info:', Daily_info);
      const state_id = Daily_info.state_id;
      var Daily_revisado_area = 'No';

      //revisar si el daily esta revisado en el area del usuario
        if (rol_info.name === 'revisor_pyc' && Daily_info.revisado_pyc === 'Si') {
          Daily_revisado_area = 'Si';
        } else if (rol_info.name === 'revisor_cc' && Daily_info.revisado_cc === 'Si') {
          Daily_revisado_area = 'Si';
        } else if (rol_info.name === 'revisor_otra_area' && Daily_info.revisado_otro === 'Si') {
          Daily_revisado_area = 'Si';
        } else if (rol_info.name === 'revisor_rrll' && Daily_info.revisado_rrll === 'Si') {
          Daily_revisado_area = 'Si';
        } else {
          Daily_revisado_area = 'No';
        }



      return {
        comentarios: comentarios,
        Daily_revisado_area: Daily_revisado_area,
        state_id: state_id
      };

    },
    refetchOnWindowFocus: false,
  });
}

// CREATE hook
function useCreateField(fetchedData) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (fieldData) => {

      const response = await axios.post(`${BASE_URL}/comentarios/create`, fieldData);
      return response.data;
    },
    onSuccess: () => {
      console.log('onSuccess');
      queryClient.invalidateQueries(['fields']); // Invalidar consultas para volver a obtener datos
    },
  });
}

// UPDATE hook
function useUpdateField() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (field) => {
      const response = await axios.put(`${BASE_URL}/updateValues`, field);
      return response.data;
    },
    onMutate: async (newFieldInfo) => {
      const previousFields = queryClient.getQueryData(['Fields']);
      queryClient.setQueryData(['Fields'], (prevFields) =>
        prevFields?.map((prevField) =>
          prevField.id === newFieldInfo.id ? newFieldInfo : prevField,
        ),
      );
      return { previousFields };
    },
    onError: (error, newFieldInfo, context) => {
      queryClient.setQueryData(['Fields'], context.previousFields);
    },
    onSettled: () => {
      queryClient.invalidateQueries(['Fields']);
    },
  });
}

// DELETE hook
function useDeleteField() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ row, daily_id, daily_sheet_id }) => {
      console.log('row:', row);
      await axios.delete(`${BASE_URL}/values`, {
        data: { row }
      });
    },

    onMutate: (deletedField) => {
      queryClient.setQueryData(['Fields'], (prevFields) =>
        prevFields?.filter((field) => field.id !== deletedField.row),
      );
    },
    onError: (error) => {
      toast.error('Error al eliminar el campo');
    },
    onSettled: (data, error) => {
      if (!error) {
        toast.success('Campos eliminados exitosamente');
      }
      queryClient.invalidateQueries(['Fields']);
    },
  });
}

const queryClient = new QueryClient();
const Table = ({ data, idDaily, contract_id, currentUser, rol_info }) => {
  if (!data) return null;
  let fields = []

  console.log('currentUser', currentUser);
  console.log('rol_info', rol_info);

  const idSheet = data.idSheet;

  if (!fields.some(field => field.name === 'id')) {
    fields.push({ name: "id" });
  }
  return (
    <QueryClientProvider client={queryClient}>
      <TableP fields={fields} idSheet={idSheet} idDaily={idDaily} contract_id={contract_id} currentUser={currentUser} rol_info={rol_info} />
    </QueryClientProvider>
  );
};

export default Table;

const validateRequired = (value) => !!value.length;
const validateEmail = (email) =>
  !!email.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );






