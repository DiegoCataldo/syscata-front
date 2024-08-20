import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TablePagination } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ContractTable = ({ contracts, page, rowsPerPage, totalCount, handleChangePage, handleChangeRowsPerPage, onDeleteContract }) => {
    const navigate = useNavigate();

    const handleEdit = (id) => {
        navigate(`/EECCDailys/${id}`);
    };

    const handleDelete = async (id) => {
        await onDeleteContract(id);
    };

    return (
        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
                <TableRow>
                    <TableCell>Nombre contrato</TableCell>
                    <TableCell>N SAP</TableCell>
                    <TableCell>DEN</TableCell>
                    <TableCell>Proyecto</TableCell>
                    <TableCell>Empresa contratista</TableCell>
                    <TableCell>Aprobador Codelco(Daily)</TableCell>
                    <TableCell>Encargado Contratista(Daily)</TableCell>
                    <TableCell>Administrador de terreno</TableCell>
                    <TableCell>Acciones</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {contracts.map((contract) => (
                    <TableRow key={contract.id}>
                        <TableCell>{contract.nombre_contrato}</TableCell>
                        <TableCell>{contract.NSAP}</TableCell>
                        <TableCell>{contract.DEN}</TableCell>
                        <TableCell>{contract.proyecto}</TableCell>
                        <TableCell>{contract.empresa_contratista}</TableCell>
                         <TableCell>
                            {contract.aprobadorCodelco.map((encargado, index) => (
                                <span key={index}>
                                    {encargado.name}
                                    {index !== contract.aprobadorCodelco.length - 1 && ', '}
                                </span>
                            ))}
                        </TableCell>
                        <TableCell>
                            {contract.encargadoContratista.map((encargado, index) => (
                                <span key={index}>
                                    {encargado.name}
                                    {index !== contract.encargadoContratista.length - 1 && ', '}
                                </span>
                            ))}
                        </TableCell>
                        <TableCell>
                            {contract.adminTerreno.map((item, index) => (
                                <span key={index}>
                                    {item.name}
                                    {index !== contract.adminTerreno.length - 1 && ', '}
                                </span>
                            ))}
                        </TableCell>
                        <TableCell>
                            <Button variant="contained" onClick={() => handleEdit(contract.id)} color="primary">IR</Button>
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
    );
};

export default ContractTable;
