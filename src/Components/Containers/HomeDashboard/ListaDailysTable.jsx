import { useMemo, useState, useEffect, useRef, React } from 'react';
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
    Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
    MRT_EditActionButtons,
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import EditIcon from '@mui/icons-material/Edit';


const DailysTable = ({ dailys, page, rowsPerPage, totalCount, handleChangePage, handleChangeRowsPerPage }) => {
    const navigate = useNavigate();
    const [sorting, setSorting] = useState([]);


    const handleEdit = (row) => {
        const daily_id = row.original.id;
        navigate(`/VisVerDaily/${daily_id}`);
        /*
        if (state_id === 1) { // si el estado es a la espera contratista
            navigate(`/EECCDailys/edit/${id}/${contract_id}`);
        } else if (state_id === 2 || state_id === 3) { // si el estado es a la espera aprocion CODELCO o en revisión
            navigate(`/EECCdailyEnviado/${id}/${contract_id}/${state_id}`);
        } else if (state_id === 4) {
            //reenviar a una pagina donde se vea el daily con su data para imprimfir, etc y/o un dashboard
        }¨
        */
    }
    const columns = useMemo(
        () => [

            {
                accessorKey: 'dateformated',
                header: 'Fecha',
                enableEditing: false,

                muiEditTextFieldProps: {
                    required: false,
                },
            },
            {
                accessorKey: 'state_name',
                header: 'Estado',
                enableEditing: false,
                muiEditTextFieldProps: {
                    required: false,
                },
            },
            {
                header: 'Revisión',
                accessorKey: 'revision',
                enableEditing: false,
                muiEditTextFieldProps: {
                    required: false,
                },
            },
            {
                accessorKey: 'revisado_pyc',
                header: 'Revisado por P&C',
                enableEditing: false,
                muiEditTextFieldProps: {
                    required: false,
                },
            },
            {
                accessorKey: 'revisado_cc',
                header: 'Revisado por Construcción',
                enableEditing: false,
                muiEditTextFieldProps: {
                    required: false,
                },
            },
            {
                accessorKey: 'revisado_rrll',
                header: 'Revisado por RRLL',
                enableEditing: false,
                muiEditTextFieldProps: {
                    required: false,
                },
            },
            {
                accessorKey: 'revisado_otro',
                header: 'Revisado por otra área',
                enableEditing: false,
                muiEditTextFieldProps: {
                    required: false,
                },
            },

        ],
        [],
    );

// Función para formatear la fecha y hora
const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString('es-ES', options);
};

    const rowVirtualizerInstanceRef = useRef(null);

    const table = useMaterialReactTable({
        columns,
        data: dailys,
        enablePagination: true,
        enableEditing: true,
        enableExpandAll : false,
        muiDetailPanelProps: () => ({
            sx: (theme) => ({
                backgroundColor:
                    theme.palette.mode === 'dark'
                        ? 'rgba(255,210,244,0.1)'
                        : 'rgba(0,0,0,0.1)',
            }),
        }),
        //custom expand button rotation
        muiExpandButtonProps: ({ row, table }) => ({
            onClick: () => table.setExpanded({ [row.id]: !row.getIsExpanded() }), //only 1 detail panel open at a time
            sx: {
                transform: row.getIsExpanded() ? 'rotate(180deg)' : 'rotate(-90deg)',
                transition: 'transform 0.2s',
            },
        }),
        //conditionally render detail panel
        renderDetailPanel: ({ row }) =>
            row.original.daily_acciones ? (
                <Box
                    sx={{
                        display: 'grid',
                        margin: 'auto',
                        width: '80%',
                    }}
                >
                    <Typography sx={{ fontSize: '16px', fontWeight: 'bold', margin: 'auto', marginBottom: '30px', borderBottom: '1px solid black' }} >Acciones</Typography>
                    <Box sx={{ display: 'grid', gap: '1rem' }}>
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr' , gap: '1rem' }}>
                        <Typography sx={{ fontSize: '14px', fontWeight: 'bold', margin: 'auto', borderBottom: '1px solid black' }} >#</Typography>
                            <Typography sx={{ fontSize: '14px', fontWeight: 'bold', margin: 'auto', borderBottom: '1px solid black' }} >Fecha</Typography>
                            <Typography sx={{ fontSize: '14px', fontWeight: 'bold',  margin: 'auto', borderBottom: '1px solid black' }} >Revisión</Typography>
                            <Typography sx={{ fontSize: '14px', fontWeight: 'bold', margin: 'auto', borderBottom: '1px solid black' }} >Accion</Typography>
                            <Typography sx={{ fontSize: '14px', fontWeight: 'bold',  margin: 'auto',borderBottom: '1px solid black' }} >Usuario</Typography>
                            <Typography sx={{ fontSize: '14px', fontWeight: 'bold', margin: 'auto', borderBottom: '1px solid black' }} >Rol Usuario</Typography>

                        </Box>
                        {row.original.daily_acciones.map((accion, index) => (
                            <Box key={index} sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr', gap: '1rem', borderBottom: '1px solid #89898978' }}>
                                <Typography sx={{ fontSize: '14px', margin: 'auto'}} >{index}</Typography>
                                <Typography sx={{ fontSize: '14px', margin: 'auto'}} >{formatDateTime(accion.created_at)}</Typography>
                                <Typography sx={{ fontSize: '14px', margin: 'auto'}}>{accion.revision}</Typography>
                                <Typography sx={{ fontSize: '14px', margin: 'auto'}}>{accion.accion}</Typography>
                                <Typography sx={{  fontSize: '14px',margin: 'auto'}}>{accion.user_name}</Typography>
                                <Typography sx={{ fontSize: '14px', margin: 'auto'}}>{accion.role_name}</Typography>
                                
                                

                            </Box>
                        ))}
                    </Box>


                </Box>
            ) : null,

        displayColumnDefOptions: {
            'mrt-row-actions': {
                size: 70,
            },
            'mrt-row-expand': {
                size: 70,
            },
        },
        rowVirtualizerInstanceRef, //optional
        rowVirtualizerOptions: { overscan: 5 }, //optionally customize the row virtualizer
        columnVirtualizerOptions: { overscan: 2 }, //optionally customize the column virtualizer
        enableRowVirtualization: true,
        onSortingChange: setSorting,
        getRowId: (row) => row.id,
        muiTableContainerProps: { sx: { minHeight: '100px', maxHeight: '400px' } },
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
                padding: '3px', // Adjust the padding to change the density
            },
        },
        muiTableHeadCellProps: {
            sx: {
                align: 'center',
                textAlign: 'center',
                border: '0.01px solid rgba(81, 81, 81, .08)',
                padding: '4px', // Adjust the padding to change the density


            },
        },

        renderRowActions: ({ row, table }) => (
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '150px' }}>
                <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '8px' }}>
                    <Tooltip title="Visualizar" sx={{}}>

                        <IconButton onClick={() => handleEdit(row)}>
                            <EditIcon sx={{ color: '#39383f' }} />
                        </IconButton>
                    </Tooltip>

                </Box>
            </div>
        ),

    });

    return (
        <Box sx={{ width: '100%', margin: '0 auto', justifyContent: 'center', alignItems: 'center', paddingBottom: '2rem' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
            </Box>
            <Box sx={{ width: '95%', margin: '0 auto', justifyContent: 'center', alignItems: 'center' }}>
                <MaterialReactTable table={table}  />
            </Box>
        </Box>
    );




};

export default DailysTable;
