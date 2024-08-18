import { useEffect, useMemo, useState } from 'react';
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


const Example = ({ dataColumns, contract_id, items }) => {
    const [validationErrors, setValidationErrors] = useState({});
    const navigate = useNavigate();

    //const itemsDropdown = items.map((item) => item.item);

     //este es el dropdown que se muestra al momento de crear o editar una row, este se modfica segun esta editando o creando una row (ver useEffect)
     const [itemsDropdown, setItemsDropdown] = useState([]);
     //y este es el dropdown original que siempre va a mostrar las categorias que no esten en la base de datos ya creadas
     const [itemsDropdownBD, setItemsDropdownBD] = useState([]);

    //estas variables son para guardar valores temporales principalmente para la funcion handleItem
    const [rowValuesTemp, setRowValuesTemp] = useState({});


    const columns = useMemo(() => {

        const safeFields = dataColumns || [];
        const safeValidationErrors = validationErrors || {};
        return safeFields
            .map((field) => {
                return {
                    // necesitamos un accessorKey único para cada columna


                    accessorKey: field.name,
                    header: field.name,

                    ...(field.name === 'description' && {
                        header: 'Descripción',
                        accessorKey: field.name,
                    }),
                    ...(field.name === 'unidad' && {
                        header: 'Unidad',
                        accessorKey: field.name,
                    }),



                    muiTableHeadCellProps: {
                        align: 'left',
                    },
                    muiTableBodyCellProps: {
                        align: 'center',
                    },
                    muiTableFooterCellProps: {
                        align: 'center',
                    },


                    muiEditTextFieldProps: ({ cell, row, table }) => ({
                        id: field.name,
                        required: true,
                        error: !!safeValidationErrors[field.name],
                        helperText: safeValidationErrors[field.name],

                        ...(field.name === 'item' && {
                            value: rowValuesTemp[field.name] || '',
                            onChange: (e) => handleItem(e, field, row, table),

                        }),
                        ...(field.name === 'description' && {
                            value: rowValuesTemp[field.name] || '',

                        }),
                        ...(field.name === 'unidad' && {
                            value: rowValuesTemp[field.name] || '',

                        }),

                        ...(field.name !== 'item' && field.name !== 'description' && field.name !== 'unidad' && {
                            type: 'number',
                            inputProps: {
                                step: '0.01',
                                pattern: "[0-9]*\\.?[0-9]+",
                                onKeyPress: (event) => {
                                    if (event.key === ',' || event.key === '-' || event.key === '+' || event.key === 'e') {
                                        event.preventDefault();
                                    }
                                },
                            },
                        }),

                    }),


                    ...(field.name === 'item' && {
                        editVariant: 'select',
                        editSelectOptions: itemsDropdown,
                    }),
                    ...(field.name === 'description'|| field.name === 'unidad' && {
                        editVariant: 'select',
                        editSelectOptions: [rowValuesTemp[field.name]],
                    }),



                };
            });
    }, [dataColumns, validationErrors, itemsDropdown, rowValuesTemp]);


    const handleItem = (event, field, row, table) => {
        const newValue = event.target.value;
        // Actualiza el estado de item en la fila actual
        setRowValuesTemp(prevValues => ({
            ...prevValues,
            [field.name]: newValue,
        }));

        const item = items.find((item) => item.item === newValue);
        console.log(item)
        const description = item.description
        const unidad = item.unidad
 
        // Actualiza el estado de description y unidad en la fila actual
        setRowValuesTemp(prevValues => ({
            ...prevValues,
            description: description,
            unidad: unidad,
        }));


    };

    //call CREATE hook
    const { mutateAsync: createRow, isPending: isCreatingUser } =
        useCreateRow();
    //call READ hook

    const {
        data: fetchedRows = [],
        isError: isLoadingUsersError,
        isFetching: isFetchingUsers,
        isLoading: isLoadingUsers,
    } = useGetRows(contract_id, items);



    useEffect(() => {
        //esto es para que al momento de crear una row  el usuario solo pueda seleccionar la opcion de la categoria que no este creada aun en la base de datos
        //y al editar solo podra seleccionar la opcion del cargo editado
        const itemsDropdown = items?.map((item) => item.item) || [];
        const fetchedItems = fetchedRows?.rows?.map((row) => row.item) || [];
        const filteredItemsDropdown = itemsDropdown.filter((item) => !fetchedItems.includes(item));

        setItemsDropdown(filteredItemsDropdown);
        setItemsDropdownBD(filteredItemsDropdown);
    }, [contract_id, items]);
    
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
        const newData = Object.entries(values).reduce((acc, [key, value]) => {
            if (key !== 'item' && key !== 'description' && key !== 'unidad') {
                const item = items.find((item) => item.item === values.item);
                const itemId = item ? item.id : null;
                acc.push({
                    contract_id: contract_id,
                    item_id: itemId,
                    item: values.item,
                    value: value,
                    date: key,
                });
            }
            return acc;
        }, []);

        console.log('newData:', newData);
        await createRow(newData);
        toast.success('Programa de Item creado exitosamente');
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

        //por cada columna que no es "item" se crea un nuevo objeto con los valores de la fila, esto ya que en la bd cada date es un registro
        const newData = Object.entries(values).reduce((acc, [key, value]) => {
            if (key !== 'item' && key !== 'description' && key !== 'unidad') {
                //busco la data de del item
                const item = items.find((item) => item.item === values.item);
                //si existe el item, obtengo el id
                const itemId = item ? item.id : null;
                console.log('values:', values);

                //busco el id del valuePrograma (el objeto que estoy creando o editando)
                const valuePrograma = fetchedRows.valuesPrograma.find(
                    (valuePrograma) => valuePrograma.item_id === itemId && valuePrograma.date === key,
                );
                console.log('valuePrograma:', valuePrograma);

                acc.push({
                    contract_id: contract_id,
                    id: valuePrograma.id,
                    item_id: itemId,
                    item: values.item,
                    value: value,
                    date: key,
                });
            }
            return acc;
        }, []);

        console.log('newData:', newData);
        await updateRow(newData);
        toast.success('Item actualizado exitosamente');
        table.setEditingRow(null); //exit editing mode
    };

    //DELETE action
    const openDeleteConfirmModal = (row) => {
        if (window.confirm('Are you sure you want to delete this user?')) {

            const values = row.original;
            console.log('values:', values);
            console.log('items:', items);

            const newData = Object.entries(values).reduce((acc, [key, value]) => {
                if (key !== 'item' && key !== 'description' && key !== 'unidad' && key !== 'id' && key !== 'contract_id' && key !== 'item_id' && key !== 'item' && key !== 'created_at' && key !== 'updated_at') {
                    //busco la data de del item
                    const item = items.find((item) => item.item === values.item);
                    //si existe el item, obtengo el id
                    console.log('item:', item);
                    const itemId = item ? item.id : null;
                    console.log('itemId:', itemId);

                    console.log('fetchedRows:', fetchedRows);
                    console.log('key:', key);

                    //busco el id del valuePrograma (el objeto que estoy creando o editando)
                    const valuePrograma = fetchedRows.valuesPrograma.find(
                        (valuePrograma) => valuePrograma.item_id === itemId && valuePrograma.date === key,
                    );

                    console.log('valuePrograma:', valuePrograma);

                    acc.push({
                        contract_id: contract_id,
                        id: valuePrograma.id,
                        item_id: itemId,
                        item: values.item,
                        value: value,
                        date: key,
                    });
                }
                return acc;
            }, []);



            deleteRow({ data: newData });
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
                        //se setea el dropdown solo del item seleccionado para que no pueda editar el item
                        setItemsDropdown([row.original.item]);
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
                    setItemsDropdown(itemsDropdownBD);
                    table.setCreatingRow(true); //simplest way to open the create row modal with no default values
                    //or you can pass in a row object to set default values with the `createRow` helper function
                    // table.setCreatingRow(
                    //   createRow(table, {
                    //     //optionally pass in default values for the new row, useful for nested data or other complex scenarios
                    //   }),
                    // );
                }}
            >
                Agregar Programa de Item
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


                <Tooltip title="Aprobar Daily Report" sx={{ mb: '2rem' }}>
                    <Button
                        id="aprobarButton"
                        startIcon={<ArrowForwardIcon />}
                        style={{ backgroundColor: '#5B5B5B' }}
                        variant="contained"
                        onClick={() => {
                            navigate(`/AvItems/${contract_id}`);
                        }}>
                        Modificar Items
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
            const response = await axios.post(`${BASE_URL}/avDailyPrograma`, fieldData);
            return response.data;
        },
        onSuccess: () => {
            console.log('onSuccess');
            queryClient.invalidateQueries(['fields']); // Invalidar consultas para volver a obtener datos
        },
    });
}


//READ hook (get users from api)
function useGetRows(contract_id, items) {

    return useQuery({
        queryKey: ['users', items],
        queryFn: async () => {
            const response = await axios.get(`${BASE_URL}/getAvDailyPrograma/${contract_id}`);
            var rowsResponse = response.data;
            console.log('rowsResponse:', rowsResponse);
            if (!rowsResponse) {
                rowsResponse = [];
            }
            if (!Array.isArray(rowsResponse)) {
                console.log('no es array:');
                rowsResponse = [rowsResponse];
            }

            let groupedByItemId = rowsResponse.reduce((acc, item) => {
                if (!acc[item.item_id]) {
                    acc[item.item_id] = {
                        item_id: item.item_id,
                        item: item.item,
                        contract_id: item.contract_id,
                        created_at: item.created_at,
                        updated_at: item.updated_at,

                    };
                }
                acc[item.item_id][item.date] = item.value;
                return acc;
            }, {});


            for (const itemId in groupedByItemId) {
                const item = items.find((item) => item.id === groupedByItemId[itemId].item_id);
                if (item) {
                    groupedByItemId[itemId].description = item.description;
                    groupedByItemId[itemId].unidad = item.unidad;
                }
            }

            const rows = Object.values(groupedByItemId);

            console.log('rows:', rows);

            return {
                valuesPrograma: rowsResponse,
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
            const response = await axios.put(`${BASE_URL}/updateAvDailyPrograma`, field);
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
            await axios.delete(`${BASE_URL}/avDailyPrograma`, {
                data: { data }
            });
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

const ExampleWithProviders = ({ contract_id, datacolumns, items }) => (

    <QueryClientProvider client={queryClient}>
        <Example dataColumns={datacolumns} contract_id={contract_id} items={items} />
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
    return {
        item: !validateRequired(row.item) ? 'Item is Required' : '',
    };
}
