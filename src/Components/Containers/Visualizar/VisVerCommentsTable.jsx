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
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import ExcelJS from 'exceljs';



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
        accessorKey: 'revision',
        header: 'Revision',
        enableEditing: false,

        muiEditTextFieldProps: {
          required: false,

          //optionally add validation checking for onBlur or onChange
        },
      },

      {
        accessorKey: 'user_name',
        header: 'Nombre Revisor',
        enableEditing: false,
        muiEditTextFieldProps: {
          required: false,

          //optionally add validation checking for onBlur or onChange
        },
      },

      {
        accessorKey: 'role_name',
        header: 'Rol Revisor',
        enableEditing: false,
        muiEditTextFieldProps: {
          required: false,
        },
      },

      {
        accessorKey: 'comentario_codelco',
        header: 'Comentario Codelco',

        //remove any previous validation errors when user focuses on the input


        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.comentario_codelco,
          helperText: validationErrors?.comentario_codelco,
        },
      },
      {
        accessorKey: 'comentario_eecc',
        header: 'Respuesta EECC',
        enableEditing: false,
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
    console.log('validationErrors', validationErrors);
    if (!rowVirtualizerInstanceRef.current) return;
    try {
      rowVirtualizerInstanceRef.current?.scrollToIndex?.(0);
    } catch (error) {
      console.error(error);
    }
  }, [sorting, validationErrors]);




  const handleExportPDF = (rows) => {
    const doc = new jsPDF();
    let tableData = rows.map((row) => Object.values(row.original));
    tableData = tableData.map(row => row.slice(1));
    const tableHeaders = columns.map((c) => c.header);

    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
    });

    doc.save('mrt-pdf-example.pdf');
  };
  const handleExportExcel = async () => {
    
    if (!fetchedData || !fetchedData.comentarios || fetchedData.comentarios.length === 0) {
      console.error('No data available to export');
      return;
    }
    console.log('fetchedData:', fetchedData.comentarios);
  
    // Obtener los encabezados de columns.header
    const headers = columns.map(column => column.header);
  
    // Crear un nuevo libro de trabajo y una hoja de trabajo
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Comentarios');
  
    // Agregar encabezados
    worksheet.addRow(headers);
  
    // Agregar datos filtrados
    fetchedData.comentarios.forEach((comentario) => {
      const filteredData = {
        revision: comentario.revision,
        user_name: comentario.user_name,
        role_name: comentario.role_name,
        comentario_codelco: comentario.comentario_codelco,
        comentario_eecc: comentario.comentario_eecc
      };
      worksheet.addRow(Object.values(filteredData));
    });
  
    // Generar el archivo Excel y descargarlo
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'export.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };






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
   

    renderRowActions: ({ row, table }) => (
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '150px' }}>

      </div>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          flexWrap: 'wrap',
        }}
      >
        <Button
          disabled={table.getPrePaginationRowModel().rows.length === 0}
          //export all rows, including from the next page, (still respects filtering and sorting)
          onClick={() =>
            handleExportPDF(table.getPrePaginationRowModel().rows)
          }
          startIcon={<FileDownloadIcon />}
        >
          Exportar a PDF
        </Button>
        <Button

          //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
          onClick={handleExportExcel}
          startIcon={<FileDownloadIcon />}
        >
          Exportar a Excel
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



      return {
        comentarios: comentarios,

        state_id: state_id,
        daily_info: Daily_info
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
      const response = await axios.put(`${BASE_URL}/comentarios/update`, field);
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
    mutationFn: async ({ row }) => {
      console.log('row:', row);
      await axios.delete(`${BASE_URL}/comentarios`, {
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

function validateComentario(comentario_codelco) {
  const validationErrorsVar = {};
  if (!comentario_codelco) {
    validationErrorsVar['comentario_codelco'] = `Comentario Codelco es requerido`;

  } else {
    delete validationErrorsVar['comentario_codelco'];
  }

  return validationErrorsVar;
}






