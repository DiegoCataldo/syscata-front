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

const TableP = ({ fields, idSheet, idDaily, contract_id }) => {
  const [validationErrors, setValidationErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableDailys, setAvailableDailys] = useState([]);
  const [selectedDaily, setSelectedDaily] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10000);



  //estas variables son para guardar valores temporales principalmente para la funcion de hh trabajadas
  const [rowValuesTemp, setRowValuesTemp] = useState({});

  const [HHtrabajadasTable, setHHtrabajadasTable] = useState([]);
  const [HMoperativasTable, setHMoperativasTable] = useState([]);
  const [HMnoOperativasTable, setHMnoOperativasTable] = useState([]);
  const [HMmantencion, setHMmantencion] = useState([]);
  const [HMenPanne, setHMenPanne] = useState([]);
  const [PersInv, setPersInv] = useState([]);
  const [HHTotalesInt, setHHtotalesInt] = useState([]);
  const [HMTotalesInt, setHMtotalesInt] = useState([]);


  const [sorting, setSorting] = useState([]);

  const columns = useMemo(() => {

    const safeFields = fields || [];
    const safeValidationErrors = validationErrors || {};
    return safeFields
      .filter((field) => field.name !== 'id') // Filtra la columna "id"
      .map((field) => {
        const newfieldname = `${field.name}-${idSheet}`;
        return {
          // necesitamos un accessorKey único para cada columna
          accessorKey: newfieldname,
          header: field.name,
          ...(field.name === 'Comentarios EECC' && { size: 300 }),
          ...(field.name !== 'Comentarios Codelco' && { enableEditing: false  }),
          ...(field.name == 'Comentarios Codelco' && {  size: 300 }),
          muiTableHeadCellProps: {
            align: 'left',
          },
          muiTableBodyCellProps: {
            align: 'center',
          },
          muiTableFooterCellProps: {
            align: 'center',
          },
          ...(field.name === 'HH Trabajadas' && { Footer: () => <div>Total: {HHtrabajadasTable} </div> }),
          ...(field.name === 'Horas Operativas' && { Footer: () => <div>Total: {HMoperativasTable} </div> }),
          ...(field.name === 'Horas No Operativas' && { Footer: () => <div>Total: {HMnoOperativasTable} </div> }),
          ...(field.name === 'Horas Mantención Programada' && { Footer: () => <div>Total: {HMmantencion} </div> }),
          ...(field.name === 'Horas Equipo en Panne' && { Footer: () => <div>Total: {HMenPanne} </div> }),
          ...(field.name === 'HH Totales' && { Footer: () => <div>Total: {HHTotalesInt} </div> }),
          ...(field.name === 'Cantidad Personal Involucrado' && { Footer: () => <div>Total: {PersInv} </div> }),
          ...(field.name === 'HM Totales' && { Footer: () => <div>Total: {HMTotalesInt} </div> }),


          muiEditTextFieldProps: ({ cell, row, table }) => ({
            ...(field.name === 'HH Trabajadas' && {
              value: rowValuesTemp[newfieldname] || '',
              onChange: (e) => handleHH(e, field, row, table),

            }),
            id: `${field.name}-${row.id}`,
            required: true,
            error: !!safeValidationErrors[newfieldname],
            helperText: safeValidationErrors[newfieldname],

            ...(field.name === 'Estado Personal' && { onChange: (e) => handleEstado(e, field, row, table) }),
            ...(field.name === 'Jornada' && { onChange: (e) => handleJornada(e, field, row, table) }),
            ...(field.name === 'Categoría' && { onChange: (e) => handleCategoria(e, field, row, table) }),
            ...(field.field_type === 'integer' && { type: 'number' }),
            ...(field.field_type === 'date' && { type: 'date' }),
            ...(field.field_type === 'hour' && { type: 'time' }),
          }),
          ...(field.field_type === 'list' && {
            editVariant: 'select',
            editSelectOptions: field.dropdown_lists,
          }),

        };
      });
  }, [fields, validationErrors, rowValuesTemp, HHtrabajadasTable, HMoperativasTable, HMnoOperativasTable, HMmantencion, HMenPanne, HHTotalesInt, PersInv, HMTotalesInt]);

  const handleOpenModal = async () => {
    await fetchDailys();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const fetchDailys = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/Dailys?contract_id=${contract_id}&page=${page}&per_page=${rowsPerPage}`);
      setAvailableDailys(response.data.data);
    } catch (error) {
      console.error('Error al obtener los Dailys:', error);
    }

  };

  const handleSelectDaily = async (selectedDaily, idDaily) => {
    try {
      const copyResponse = await axios.post(`${BASE_URL}/copyValuesRow`, {
        selectedDaily: selectedDaily,
        idDaily: idDaily,
      });
      queryClient.invalidateQueries(['fields']);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };



  // Función para manejar el cambio en "HH trabajadas"
  const handleHH = (event, field, row, table) => {
    const newValue = event.target.value;
    const valueJornada = rowValuesTemp[`Jornada-${idSheet}`];
    // Actualiza el estado con el nuevo valor
    setRowValuesTemp(prevValues => ({
      ...prevValues,
      [`${field.name}-${idSheet}`]: newValue,
    }));
  };
  const handleJornada = (event, field, row, table) => {
    const newValue = event.target.value;
    //intentamos tomar el valor desde rowvaluestemp, si no existe, lo tomamos desde row.original
    let valueEstado = rowValuesTemp[`Estado Personal-${idSheet}`];
    if (!valueEstado) {
      if (row.original[`Estado Personal-${idSheet}`] !== undefined) {
        valueEstado = row.original[`Estado Personal-${idSheet}`];
      }
    }
    //por el momento no se esta tomando en cuenta categoría, pero puede que a futuro se necesite
    const valueCategoria = rowValuesTemp[`Categoría-${idSheet}`];
    // Actualiza el estado de Jornada en rowValuesTemp
    setRowValuesTemp(prevValues => ({
      ...prevValues,
      [`${field.name}-${idSheet}`]: newValue,
    }));
    let valorFinalHH = rowValuesTemp[`HH Trabajadas-${idSheet}`];
    //comienza formula para defnir HH trabajadas
    if (valueEstado === "Trabajando" || valueEstado === "Teletrabajo") {
      if (newValue === "5x2") {
        valorFinalHH = "10";
      } else if (newValue === "8x6" || newValue === "10x10" || newValue === "14x14" || newValue === "11x9" || newValue === "7x7" || newValue === "4x3") {
        valorFinalHH = "11";
      } else if (newValue === "10x5") {
        valorFinalHH = "9";
      }
    }
    // Actualiza el estado de HH trabajadas en rowValuesTemp
    setRowValuesTemp(prevValues => ({
      ...prevValues,
      [`HH Trabajadas-${idSheet}`]: valorFinalHH,
    }));
  };
  // Función para manejar el cambio en "HH trabajadas"
  const handleEstado = (event, field, row, table) => {
    const newValue = event.target.value;
    //intentamos tomar el valor desde rowvaluestemp, si no existe, lo tomamos desde row.original
    let valueJornada = rowValuesTemp[`Jornada-${idSheet}`];
    if (!valueJornada) {
      if (row.original[`Jornada-${idSheet}`] !== undefined) {
        valueJornada = row.original[`Jornada-${idSheet}`];
      }
    }

    //por el momento no se esta tomando en cuenta categoría, pero puede que a futuro se necesite
    const valueCategoria = rowValuesTemp[`Categoría-${idSheet}`];
    // Actualiza el estado de Estado Personal en rowValuesTemp
    setRowValuesTemp(prevValues => ({
      ...prevValues,
      [`${field.name}-${idSheet}`]: newValue,
    }));

    let valorFinalHH = rowValuesTemp[`HH Trabajadas-${idSheet}`];
    //comienza formula para defnir HH trabajadas
    if (newValue === "Trabajando" || newValue === "Teletrabajo") {
      if (valueJornada === "5x2") {
        valorFinalHH = "10";
      } else if (valueJornada === "8x6" || valueJornada === "10x10" || valueJornada === "14x14" || valueJornada === "11x9" || valueJornada === "7x7" || valueJornada === "4x3") {
        valorFinalHH = "11";
      } else if (valueJornada === "10x5") {
        valorFinalHH = "9";
      }
    } else {
      valorFinalHH = "0";
    }
    // Actualiza el estado de HH trabajadas en rowValuesTemp
    setRowValuesTemp(prevValues => ({
      ...prevValues,
      [`HH Trabajadas-${idSheet}`]: valorFinalHH,
    }));
  };
  const handleCategoria = (event, field, row, table) => {
    const newValue = event.target.value;
    const valueJornada = rowValuesTemp[`Jornada-${idSheet}`];
    const valueEstado = rowValuesTemp[`Estado Personal-${idSheet}`];
    // Actualiza el estado de Categoria en rowValuesTemp
    setRowValuesTemp(prevValues => ({
      ...prevValues,
      [`${field.name}-${idSheet}`]: newValue,
    }));
  };
  const resetRowValues = () => {
    setRowValuesTemp({});
  }

  const {
    data: fetchedData = [],
    isError: isLoadingUsersError,
    isFetching: isFetchingUsers,
    isLoading: isLoadingUsers,
  } = useGetRows(idDaily, idSheet);

  // Hooks y manejadores de Crear, Actualizar, Eliminar
  const { mutateAsync: createField, isPending: isCreatingField } = useCreateField();
  const { mutateAsync: updateField, isPending: isUpdatingField } = useUpdateField();
  const { mutateAsync: deleteField, isPending: isDeletingField } = useDeleteField();


  const handleCreateField = async ({ values, table, idSheet }) => {

    const rowId = table.getState().creatingRowId;
    const maxRow = Math.max(...fetchedData.rows.map(row => row.id), 0);
    const newRowId = maxRow + 1;
    //console.log('values', values);
    //console.log('rowValuesTemp', rowValuesTemp);
    //console.log('idSheet', idSheet);

    //pasos para solucionar problema de hh trabajadas no viene en values, si es que se actualiza con funcion handleEstado o handleJornada
    const hhtrabajadasValues = `HH Trabajadas-${idSheet}`;
    const hhtrabajadasRowValues = `HH Trabajadas-${idSheet}`;
    if (!values[hhtrabajadasValues]) {
      values[hhtrabajadasValues] = rowValuesTemp[hhtrabajadasRowValues];
    }
    //transfmar nombres de fields de la row a nombres de fields de la tabla
    //toda esta transformaciom es para guardar en la tabla bbdd de valuesRow
    var transformedValues = [];
    fetchedData.fields.map((field) => {
      var step = field.step;
      var name = `col_${step}`;
      transformedValues[name] = values[field.name];

    });
    transformedValues['daily_id'] = idDaily;
    transformedValues['daily_sheet_id'] = idSheet;
    const transformedValuesObj = Object.assign({}, transformedValues);

    const newValidationErrors = validateCurrentSheetFields(idSheet, fetchedData.fields, values);

    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }

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
    const idname = `id-${idSheet}`;
    const idValue = row.original[idname];


    //pasos para solucionar problema de hh trabajadas no viene en values, si es que se actualiza con funcion handleEstado o handleJornada
    const hhtrabajadasValues = `HH Trabajadas-${idSheet}`;
    const hhtrabajadasRowValues = `HH Trabajadas-${rowId}`;
    if (!values[hhtrabajadasValues]) {
      values[hhtrabajadasValues] = rowValuesTemp[hhtrabajadasRowValues];
    }

    //transfmar nombres de fields de la row a nombres de fields de la tabla
    //toda esta transformaciom es para guardar en la tabla bbdd de valuesRow
    var transformedValues = [];
    fetchedData.fields.map((field) => {
      var step = field.step;
      var name = `col_${step}`;
      transformedValues[name] = values[field.name];

    });
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
    try {
      rowVirtualizerInstanceRef.current?.scrollToIndex?.(0);
    } catch (error) {
      console.error(error);
    }
  }, [sorting]);

  const table = useMaterialReactTable({
    columns,
    data: fetchedData.rows ? fetchedData.rows : [],
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
          
        </Box>
      </div>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
       
      </Box>

    ),
    state: {
      isLoading: isLoadingUsers,
      showAlertBanner: isLoadingUsersError,
      showProgressBars: isFetchingUsers,
      isSaving: isCreatingField || isUpdatingField || isDeletingField,
    },
  });

  useEffect(() => {
    //esto es para el totalizado por columna  hh trabajadas HH OPERATIVAS, NO OPERATIVAS, ETC
    const prePaginationRowModel = table.getPrePaginationRowModel();
    if (!prePaginationRowModel.rows) return;
    const dataFiltrada = prePaginationRowModel.rows.map(row => row.original);

    const sumHHTrabajadas = dataFiltrada.reduce((sum, row) => {
      const hhTrabajadas = parseFloat(row[`HH Trabajadas-${idSheet}`]) || 0;
      return sum + hhTrabajadas;
    }, 0);
    setHHtrabajadasTable(sumHHTrabajadas);

    const sumHMOperativas = dataFiltrada.reduce((sum, row) => {
      const hmOperativas = parseFloat(row[`Horas Operativas-${idSheet}`]) || 0;
      return sum + hmOperativas;
    }, 0);
    setHMoperativasTable(sumHMOperativas);

    const sumHMNoOperativas = dataFiltrada.reduce((sum, row) => {
      const hmNoOperativas = parseFloat(row[`Horas No Operativas-${idSheet}`]) || 0;
      return sum + hmNoOperativas;
    }
      , 0);
    setHMnoOperativasTable(sumHMNoOperativas);

    const sumHMMantencion = dataFiltrada.reduce((sum, row) => {
      const hmMantencion = parseFloat(row[`Horas Mantención Programada-${idSheet}`]) || 0;
      return sum + hmMantencion;
    }
      , 0);
    setHMmantencion(sumHMMantencion);

    const sumHMenPanne = dataFiltrada.reduce((sum, row) => {
      const hmEnPanne = parseFloat(row[`Horas Equipo en Panne-${idSheet}`]) || 0;
      return sum + hmEnPanne;
    }
      , 0);
    setHMenPanne(sumHMenPanne);

    const sumPersInv = dataFiltrada.reduce((sum, row) => {
      const persInv = parseFloat(row[`Cantidad Personal Involucrado-${idSheet}`]) || 0;
      return sum + persInv;
    }
      , 0);
    setPersInv(sumPersInv);

    const sumHHTotalesInt = dataFiltrada.reduce((sum, row) => {
      const hhTotalesInt = parseFloat(row[`HH Totales-${idSheet}`]) || 0;
      return sum + hhTotalesInt;
    }
      , 0);
    setHHtotalesInt(sumHHTotalesInt);

    const sumHMTotalesInt = dataFiltrada.reduce((sum, row) => {
      const hmTotalesInt = parseFloat(row[`HM Totales-${idSheet}`]) || 0;
      return sum + hmTotalesInt;
    }
      , 0);
    setHMtotalesInt(sumHMTotalesInt);


  }, [table.getState().columnFilters, fetchedData.rows]);


  return (
    <>
      <MaterialReactTable table={table} />
      
      <Dialog open={isModalOpen} onClose={handleCloseModal}>
        <DialogTitle>Seleccione una Daily</DialogTitle>
        <DialogContent>
          <Select
            value={selectedDaily}
            onChange={(e) => setSelectedDaily(e.target.value)}
            fullWidth
          >
            {availableDailys.map((daily) => (
              <MenuItem key={daily.id} value={daily.id}>
                {daily.date}
              </MenuItem>
            ))}

          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancelar</Button>
          <Button onClick={() => handleSelectDaily(selectedDaily, idDaily)}>
            Cargar Datos
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};


//READ hook (get fields from api)
function useGetRows(idDaily, idSheet) {

  return useQuery({
    queryKey: ['fields', idSheet],
    queryFn: async () => {

      //rows
      const response = await axios.get(`${BASE_URL}/Dailys/${idDaily}/dailyStructure`)
      var rowsResponse = response.data.values[idSheet];
      if (!rowsResponse) {
        rowsResponse = [];
      }
      if (!Array.isArray(rowsResponse)) {
        console.log('no es array:');
        rowsResponse = [rowsResponse];
      }
      console.log('response:', response.data.values);
      //dejo los fields como el nombre de la columna + idSheet para que no se repitan
      var fields = response.data.steps.find(step => step.idSheet === idSheet).fields;
      fields = fields.map((field) => {
        field.name = `${field.name}-${idSheet}`;
        return field;
      });

      const steps = response.data.steps;
      console.log('steps:', steps);
      console.log('rowsResponse:', rowsResponse);
      console.log('fields:', fields);



      return {
        fields: fields,
        rows: rowsResponse
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

      const response = await axios.post(`${BASE_URL}/valuesRow`, fieldData);
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

const Table = ({ data, idDaily, contract_id }) => {
  if (!data) return null;
  let fields = data.fields.sort((a, b) => a.step - b.step);


  const idSheet = data.idSheet;

  if (!fields.some(field => field.name === 'id')) {
    fields.push({ name: "id" });
  }
  return (
    <QueryClientProvider client={queryClient}>
      <TableP fields={fields} idSheet={idSheet} idDaily={idDaily} contract_id={contract_id} />
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


function validateCurrentSheetFields(currentSheetId, allFields, values) {
  const validationErrorsVar = {};

  // Filtrar los campos que pertenecen al idSheet actual
  const currentSheetFields = allFields;

  // Validar los campos filtrados
  currentSheetFields.forEach(field => {
    var fieldAndSheet = field.name;
    var originalName = field.name.split('-')[0];
    if (field.required === 'Si' && !values[fieldAndSheet]) {



      if (field.name === "HH Trabajadas") {
        validationErrorsVar[field.name] = `Seleccione Manualmente el campo`;
      } else {
        validationErrorsVar[field.name] = `${originalName} es requerido`;
      }
    } else {
      if (validationErrorsVar[field.name]) {
        delete validationErrorsVar[field.name];
      }
    }
  });


  console.log(validationErrorsVar);

  return validationErrorsVar;
}




