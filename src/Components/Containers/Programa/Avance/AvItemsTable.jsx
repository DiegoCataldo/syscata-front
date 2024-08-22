import { useMemo, useState } from 'react';
import {
    MaterialReactTable,
    // createRow,
    useMaterialReactTable,
} from 'material-react-table';
import { Box, Button, IconButton, Tooltip } from '@mui/material';
import {
    QueryClient,
    QueryClientProvider,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../../../helpers/config';
import axios from 'axios';
import { toast } from 'react-toastify';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


const dataPrev = [
    {
        id: '9s41rp',
        firstName: 'Kelvin',
        lastName: 'Langosh',
        email: 'Jerod14@hotmail.com',
        state: 'Ohio',
    },
    {
        id: '08m6rx',
        firstName: 'Molly',
        lastName: 'Purdy',
        email: 'Hugh.Dach79@hotmail.com',
        state: 'Rhode Island',
    },
]

const unidades = [
    'm3',
    'm2',
    'cu',
    'kg',
    'lt',
    'm',
    'ton',
    'ml',
    'otro'


]

const Example = ({ contract_id }) => {
    const [validationErrors, setValidationErrors] = useState({});
    const navigate = useNavigate();

    const columns = useMemo(
        () => [
            {
                accessorKey: 'item',
                header: 'Item',
                muiEditTextFieldProps: {
                    required: true,
                    error: !!validationErrors?.item,
                    helperText: validationErrors?.item,
                    //remove any previous validation errors when user focuses on the input
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            item: undefined,
                        }),
                    //optionally add validation checking for onBlur or onChange
                },
            },
            {
                accessorKey: 'description',
                header: 'Descripción Item',
                muiEditTextFieldProps: {
                    required: true,
                    error: !!validationErrors?.description,
                    helperText: validationErrors?.description,
                    //remove any previous validation errors when user focuses on the input
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            description: undefined,
                        }),
                },
            },
            {
                accessorKey: 'unidad',
                header: 'Unidad',
                editVariant: 'select',
                editSelectOptions: unidades,
                muiEditTextFieldProps: {
                    select: true,
                    error: !!validationErrors?.unidad,
                    helperText: validationErrors?.unidad,
                },
            },
        ],
        [validationErrors],
    );


    //call CREATE hook
    const { mutateAsync: createRow, isPending: isCreatingUser } =
        useCreateRow();
    //call READ hook
    const {
        data: fetchedRows = [],
        isError: isLoadingUsersError,
        isFetching: isFetchingUsers,
        isLoading: isLoadingUsers,
    } = useGetRows(contract_id);
    //call UPDATE hook
    const { mutateAsync: updateRow, isPending: isUpdatingUser } =
        useUpdateRow();
    //call DELETE hook
    const { mutateAsync: deleteRow, isPending: isDeletingUser } =
        useDeleteRow();

    //CREATE action
    const handleCreateRow = async ({ values, table }) => {
        const newValidationErrors = validateRow(values);
        if (Object.values(newValidationErrors).some((error) => error)) {
            setValidationErrors(newValidationErrors);
            return;
        }
        setValidationErrors({});

        let newValues = values;
        newValues['contract_id'] = contract_id;

        await createRow(newValues);
        toast.success('Item creado exitosamente');
        table.setCreatingRow(null); //exit creating mode
    };

    //UPDATE action
    const handleSaveRow = async ({ values, table, row }) => {

        const newValidationErrors = validateRow(values);
        if (Object.values(newValidationErrors).some((error) => error)) {
            setValidationErrors(newValidationErrors);
            return;
        }
        setValidationErrors({});

        let newValues = values;
        const idValue = row.original['id'];
        newValues['contract_id'] = contract_id;
        newValues['id'] = idValue;


        await updateRow(newValues);
        toast.success('Item actualizado exitosamente');
        table.setEditingRow(null); //exit editing mode
    };

    //DELETE action
    const openDeleteConfirmModal = (row) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            deleteRow( {row: row.original.id});
        }
    };

    const table = useMaterialReactTable({
        columns,
        data: fetchedRows,
        createDisplayMode: 'row', // ('modal', and 'custom' are also available)
        editDisplayMode: 'row', // ('modal', 'cell', 'table', and 'custom' are also available)
        enableEditing: true,
        getRowId: (row) => row.id,
        muiToolbarAlertBannerProps: isLoadingUsersError
            ? {
                color: 'error',
                children: 'Error loading data',
            }
            : undefined,
        muiTableContainerProps: {
            sx: {
                minHeight: '500px',
            },
        },
        onCreatingRowCancel: () => setValidationErrors({}),
        onCreatingRowSave: handleCreateRow,
        onEditingRowCancel: () => setValidationErrors({}),
        onEditingRowSave: handleSaveRow,
        renderRowActions: ({ row, table }) => (
            <Box sx={{ display: 'flex', gap: '1rem' }}>
                <Tooltip title="Edit">
                    <IconButton onClick={() => table.setEditingRow(row)}>
                        <EditIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                    <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            </Box>
        ),
        renderTopToolbarCustomActions: ({ table }) => (
            <Button
                variant="contained"
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
                Crear nuevo Item
            </Button>
        ),
        state: {
            isLoading: isLoadingUsers,
            isSaving: isCreatingUser || isUpdatingUser || isDeletingUser,
            showAlertBanner: isLoadingUsersError,
            showProgressBars: isFetchingUsers,
        },
    });

    return (
        <Box sx={{ width: '100%', margin: '0 auto', justifyContent: 'center', alignItems: 'center', paddingBottom: '2rem' }}>
            <Box sx={{ display: 'flex', justifyContent: 'left', marginBottom: '1rem' }}>


                <Tooltip title="" sx={{ mb: '2rem' }}>
                    <Button
                        id="aprobarButton"
                        startIcon={<ArrowBackIcon/>}
                        style={{ backgroundColor: '#5B5B5B' }}
                        variant="contained"
                        onClick={() => {

                            navigate(`/AvPrograma/`);

                        }}
                    >
                        Modificar Programa
                    </Button>
                </Tooltip>
            </Box>
            <Box sx={{ width: '95%', margin: '0 auto', justifyContent: 'center', alignItems: 'center' }}>
                <MaterialReactTable table={table} />
            </Box>
        </Box>
    );
};

//CREATE hook (post new user to api)
function useCreateRow() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (fieldData) => {
            console.log('fieldData:', fieldData);
            const response = await axios.post(`${BASE_URL}/items`, fieldData);
            return response.data;
        },
        onSuccess: () => {
            console.log('onSuccess');
            queryClient.invalidateQueries(['fields']); // Invalidar consultas para volver a obtener datos
        },
    });
}

//READ hook (get users from api)
function useGetRows(contract_id) {

    return useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            console.log('contract_id:', contract_id);

            const response = await axios.get(`${BASE_URL}/getItems/${contract_id}`);
            var rowsResponse = response.data;
            if (!rowsResponse) {
                rowsResponse = [];
            }
            if (!Array.isArray(rowsResponse)) {
                console.log('no es array:');
                rowsResponse = [rowsResponse];
            }
            return rowsResponse;
        },
        refetchOnWindowFocus: false,
    });
}

//UPDATE hook (put user in api)
function useUpdateRow() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (field) => {
        const response = await axios.put(`${BASE_URL}/updateItem`, field);
        return response.data;
      },
      onMutate: async (newFieldInfo) => {
        const previousFields = queryClient.getQueryData(['users']);
        queryClient.setQueryData(['users'], (prevFields) =>
          prevFields?.map((prevField) =>
            prevField.id === newFieldInfo.id ? newFieldInfo : prevField,
          ),
        );
        return { previousFields };
      },
      onError: (error, newFieldInfo, context) => {
        queryClient.setQueryData(['users'], context.previousFields);
      },
      onSettled: () => {
        queryClient.invalidateQueries(['users']);
      },
    });
}

//DELETE hook (delete user in api)
function useDeleteRow() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async ({ row }) => {
        console.log('row:', row);
        await axios.delete(`${BASE_URL}/items`, {
          data: { row }
        });
      },
  
      onMutate: (deletedField) => {
        queryClient.setQueryData(['users'], (prevFields) =>
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
        queryClient.invalidateQueries(['users']);
      },
    });
}

const queryClient = new QueryClient();

const ExampleWithProviders = ({ contract_id }) => (

    <QueryClientProvider client={queryClient}>
        <Example contract_id={contract_id} />
    </QueryClientProvider>
);

export default ExampleWithProviders;

const validateRequired = (value) => !!value.length;
const validateEmail = (email) =>
    !!email.length &&
    email
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        );

function validateRow(user) {
    return {
        item: !validateRequired(user.item) ? 'Item is Required' : '',
        unidad: !validateRequired(user.unidad) ? 'Unidad is Required' : '',
        description: !validateRequired(user.description) ? 'Descripción is Required' : '',
    };
}
