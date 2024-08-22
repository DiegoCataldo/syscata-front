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
import axios from 'axios';
import { BASE_URL } from '../../../../helpers/config';
import { toast } from 'react-toastify';

const Example = () => {
  const [validationErrors, setValidationErrors] = useState({});

    const rut_verifier_list = [
    { value: '0', label: '0' },
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '5', label: '5' },
    { value: '6', label: '6' },
    { value: '7', label: '7' },
    { value: '8', label: '8' },
    { value: '9', label: '9' },
    { value: 'K', label: 'K' },

    ];

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
        header: 'Nombre',
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.firstName,
          helperText: validationErrors?.firstName,
          //remove any previous validation errors when company focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              firstName: undefined,
            }),
          //optionally add validation checking for onBlur or onChange
        },
      },
      {
        accessorKey: 'rut_number',
        header: 'Comienzo RUT',
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.lastName,
          helperText: validationErrors?.lastName,
          //remove any previous validation errors when company focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              lastName: undefined,
            }),
        },
      },
      {
        accessorKey: 'rut_verifier',
        header: 'RUT Verificador',
        editVariant: 'select',
        editSelectOptions: rut_verifier_list,
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
  const { mutateAsync: createCompany, isPending: isCreatingCompany } =
    useCreateCompany();
  //call READ hook
  const {
    data: fetchedCompanies = [],
    isError: isLoadingCompaniesError,
    isFetching: isFetchingCompanies,
    isLoading: isLoadingCompanies,
  } = useGetCompanies();
  //call UPDATE hook
  const { mutateAsync: updateCompany, isPending: isUpdatingCompany } =
    useUpdateCompany();
  //call DELETE hook
  const { mutateAsync: deleteCompany, isPending: isDeletingCompany } =
    useDeleteCompany();

  //CREATE action
  const handleCreateCompany = async ({ values, table }) => {
    const newValidationErrors = validateCompany(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await createCompany(values);
    table.setCreatingRow(null); //exit creating mode
  };

  //UPDATE action
  const handleSaveCompany = async ({ values, table, row }) => {

    
    console.log(values);
    const newValidationErrors = validateCompany(values);
    
    console.log(newValidationErrors);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await updateCompany(values);
    table.setEditingRow(null); //exit editing mode
  };

  //DELETE action
  const openDeleteConfirmModal = (row) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      deleteCompany({row: row.original.id});
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: fetchedCompanies,
    createDisplayMode: 'row', // ('modal', and 'custom' are also available)
    editDisplayMode: 'row', // ('modal', 'cell', 'table', and 'custom' are also available)
    enableEditing: true,
    getRowId: (row) => row.id,
    muiToolbarAlertBannerProps: isLoadingCompaniesError
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
    onCreatingRowSave: handleCreateCompany,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveCompany,
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
        Create New company
      </Button>
    ),
    state: {
      isLoading: isLoadingCompanies,
      isSaving: isCreatingCompany || isUpdatingCompany || isDeletingCompany,
      showAlertBanner: isLoadingCompaniesError,
      showProgressBars: isFetchingCompanies,
    },
  });

  return <MaterialReactTable table={table} />;
};

//CREATE hook (post new company to api)
function useCreateCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (company) => {
      //send api update request here
    const response =  await axios.post(`${BASE_URL}/companies`, company);
      return response.data;

    },
    //client side optimistic update
    onSuccess: () => {
        console.log('onSuccess');
        queryClient.invalidateQueries(['companies']); // Invalidar consultas para volver a obtener datos
      },
  });
}

//READ hook (get companies from api)
function useGetCompanies() {
  return useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
        const response = await axios.get(`${BASE_URL}/companies`);
        const companies = response.data;
        console.log(companies);
        return companies
    },
    refetchOnWindowFocus: false,
  });
}

//UPDATE hook (put company in api)
function useUpdateCompany() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (field) => {
        const response = await axios.put(`${BASE_URL}/updateCompany/${field.id}`, field);
        return response.data;
      },
      onMutate: async (newFieldInfo) => {
        const previousFields = queryClient.getQueryData(['companies']);
        queryClient.setQueryData(['companies'], (prevFields) =>
          prevFields?.map((prevField) =>
            prevField.id === newFieldInfo.id ? newFieldInfo : prevField,
          ),
        );
        return { previousFields };
      },
      onError: (error, newFieldInfo, context) => {
        queryClient.setQueryData(['companies'], context.previousFields);
      },
      onSettled: () => {
        queryClient.invalidateQueries(['companies']);
      },
      onSuccess: () => {
        queryClient.invalidateQueries(['companies']);
        }
    });
}

//DELETE hook (delete company in api)
function useDeleteCompany() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async ({ row }) => {
        console.log('row:', row);
        await axios.delete(`${BASE_URL}/deleteCompany`, {
          data: { row }
        });
      },
  
      onMutate: (deletedField) => {
        queryClient.setQueryData(['companies'], (prevFields) =>
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
        queryClient.invalidateQueries(['companies']);
      },
    });
}

const queryClient = new QueryClient();

const ExampleWithProviders = () => (
  //Put this with your other react-query providers near root of your app
  <QueryClientProvider client={queryClient}>
    <Example />
  </QueryClientProvider>
);

export default ExampleWithProviders;

const validateRequired = (value) => !!value.length;
const validateNumber = (value) => !isNaN(value);
const validateEmail = (email) =>
  !!email.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );

function validateCompany(company) {
    console.log(company);
  return {
    name: !validateRequired(company.name)
      ? 'name is Required'
      : '',
    rut_number: !validateNumber(company.rut_number) ? 'is Required' : '',
    rut_verifier: !validateNumber(company.rut_verifier) ? 'is Required' : '',
  };
}
