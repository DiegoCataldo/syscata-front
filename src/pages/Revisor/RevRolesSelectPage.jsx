import React, { useEffect, useState } from 'react';
import ContractTable from '../../Components/Containers/Revisor/RevContractsTable';
import axios from 'axios';
import { BASE_URL } from '../../helpers/config';
import { toast } from 'react-toastify';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TablePagination } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';


const RevRolesSelect = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const navigate = useNavigate(); // Definir navigate usando useNavigate
    const { contract_id } = useParams(); //idContract



    const dataRoles = [
        { id: 3, name: 'Revisor PyC' },
        { id: 4, name: 'Revisor CC' },
        { id: 5, name: 'Revisor Otro' },
        { id: 6, name: 'Revisor RRLL' },
 
    ];


    const handleEdit = (id) => {
        navigate(`/RevListaDailys/${id}/${contract_id}`);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Box
            // onSubmit=""
            sx={{ width: '95%', margin: '0 auto', mt: 4 }}
        >
            <div>
                <h2>Seleccionar Contratos</h2>
                <Box display="flex" justifyContent="flex-end" mb={2}>

                </Box>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Rol</TableCell>
                                <TableCell>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {dataRoles.map((roles) => (
                                <TableRow key={roles.id}>
                                    <TableCell>{roles.name}</TableCell>                
                                    <TableCell>
                                        <Button variant="contained" onClick={() => handleEdit(roles.id)} color="primary">IR</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={totalCount}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage="Filas por página"
                        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`}
                    />
                </TableContainer>
            </div>
        </Box>
    );
};

export default RevRolesSelect;
