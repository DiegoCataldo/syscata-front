import { useMemo, useState, useEffect } from 'react';
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
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { set } from 'react-hook-form';


const Example = ({  contract_id, listaCargos, listaMaq }) => {
    const [validationErrors, setValidationErrors] = useState({});
    const navigate = useNavigate();

    const DropdownMaq = listaMaq?.map((item) => item.value) || [];
    const DropdownCargos = listaCargos?.map((item) => item.value) || [];



    const [editSelectOptions, setEditSelectOptions] = useState('defaultOption');


    const columns = useMemo(
        () => [
          {
            accessorKey: 'id',
            header: 'Id',
            enableEditing: false,
            size: 80,
          },
          {
            accessorKey: 'cargo',
            header: 'Cargo',
            editVariant: 'select',
            editSelectOptions: DropdownCargos,
            muiEditTextFieldProps: {
              select: true,
              error: !!validationErrors?.state,
              helperText: validationErrors?.state,
            },
          },

          {
            accessorKey: 'maquinaria',
            header: 'Maquinaria',
            editVariant: 'select',
            editSelectOptions: DropdownMaq,
            muiEditTextFieldProps: {
              select: true,
              error: !!validationErrors?.state,
              helperText: validationErrors?.state,
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
        //por cada columna que no es "item" se crea un nuevo objeto con los valores de la fila, esto ya que en la bd cada date es un registro
        values.contract_id = contract_id;

        await createRow(values);
        toast.success('Programa de Item creado exitosamente');
        table.setCreatingRow(null); //exit creating mode
    };

    //UPDATE action
    const handleSaveRow = async ({ values, table, row }) => {
        console.log('values:', values);
        const newValidationErrors = validateRow(values);
        if (Object.values(newValidationErrors).some((error) => error)) {
            setValidationErrors(newValidationErrors);
            return;
        }
        setValidationErrors({});
        values.contract_id = contract_id;

        

        await updateRow(values);
        toast.success('Item actualizado exitosamente');
        table.setEditingRow(null); //exit editing mode
    };

    //DELETE action
    const openDeleteConfirmModal = (row) => {
        if (window.confirm('Are you sure you want to delete this user?')) {

          
            deleteRow({ data: row });
        }
    };

    const table = useMaterialReactTable({
        columns,
        data: fetchedRows.rows ? fetchedRows.rows : [],
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
                    <IconButton onClick={() => {
                        //quito cualquier fila que se pueda estar creando o editando
                        table.setEditingRow(null);
                        table.setCreatingRow(null);
                        //se setea el dropdown solo del item seleccionado para que no pueda editar la categoria
                    
                        table.setEditingRow(row);
                    }}>
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
                    //quito cualquier fila que se pueda estar creando o editando
                    table.setEditingRow(null);
                    table.setCreatingRow(null);
                    //seteo de nuevo a los items dropdown originales
                    table.setCreatingRow(true); //simplest way to open the create row modal with no default values
                    //or you can pass in a row object to set default values with the `createRow` helper function
                    // table.setCreatingRow(
                    //   createRow(table, {
                    //     //optionally pass in default values for the new row, useful for nested data or other complex scenarios
                    //   }),
                    // );
                }}
            >
                Agregar nueva Relación
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
            <Box sx={{ display: 'flex', justifyContent: 'right', marginBottom: '1rem' }}>
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
            const response = await axios.post(`${BASE_URL}/createDailyRelCargoMaq`, fieldData);
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
            const response = await axios.get(`${BASE_URL}/getDailyRelCargoMaq/${contract_id}`);
            var rowsResponse = response.data;
            if (!rowsResponse) {
                rowsResponse = [];
            }
            if (!Array.isArray(rowsResponse)) {
                console.log('no es array:');
                rowsResponse = [rowsResponse];
            }
            console.log('rowsResponse:', rowsResponse);



            const rows = Object.values(rowsResponse);
            console.log('rows:', rows);
            return {
                
                rows: rows
            };
        },


        refetchOnWindowFocus: false,
    });
}

//UPDATE hook (put user in api)
function useUpdateRow() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (field) => {
            const response = await axios.put(`${BASE_URL}/updateDailyRelCargoMaq`, field);
            return response.data;
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
        mutationFn: async ({ data }) => {
            console.log('data:', data);
            await axios.delete(`${BASE_URL}/deleteDailyRelCargoMaq`, {data });
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

const ExampleWithProviders = ({ contract_id, listaCargos, listaMaq }) => (



    <QueryClientProvider client={queryClient}>
        <Example  contract_id={contract_id} listaCargos={listaCargos} listaMaq={listaMaq} />
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

function validateUser(user) {
    return {
        firstName: !validateRequired(user.firstName)
            ? 'First Name is Required'
            : '',
        lastName: !validateRequired(user.lastName) ? 'Last Name is Required' : '',
        email: !validateEmail(user.email) ? 'Incorrect Email Format' : '',
    };
}

function validateRow(row) {
    console.log('row:', row);
    return {
        cargo: !validateRequired(row.cargo) ? 'Cargo is Required' : '',
        maquinaria: !validateRequired(row.maquinaria) ? 'Maquinaria is Required' : '',
    };
}
