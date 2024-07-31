import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TablePagination } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const DailysTable = ({ dailys, role_id, page, rowsPerPage, totalCount, handleChangePage, handleChangeRowsPerPage }) => {
    const navigate = useNavigate();

    const handleEdit = (id,  contract_id) => {
            navigate(`/RevRevisarDaily/${id}/${contract_id}/${role_id}`);
    };


    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Fecha</TableCell>
                        <TableCell>Estado</TableCell>
                        <TableCell>Revisado por P&C</TableCell>
                        <TableCell>Revisado por Construcción</TableCell>
                        <TableCell>Revisado por Relaciones Laborales</TableCell>
                        <TableCell>Revisado por Otra área</TableCell>


                    </TableRow>
                </TableHead>
                <TableBody>
                    {dailys.map((daily) => {
                        // Asegúrate de que daily.date es una fecha válida
                        const date = new Date(daily.date);
                        let formattedDate = '';
                        // Verifica si la fecha es válida antes de intentar formatearla
                        if (!isNaN(date)) {
                            formattedDate = date.toLocaleDateString('es-ES', { day: '2-digit',month: '2-digit',year: 'numeric',
                            });
                        } else {// Maneja el caso de una fecha inválida, por ejemplo, asignando un valor predeterminado
                            formattedDate = 'Fecha inválida';
                        }
                        return (
                            <TableRow key={daily.id}>
                                <TableCell>{formattedDate}</TableCell>
                                <TableCell>{daily.state_name}</TableCell>
                                <TableCell>{daily.revisado_pyc}</TableCell>
                                <TableCell>{daily.revisado_cc}</TableCell>
                                <TableCell>{daily.revisado_rrll}</TableCell>
                                <TableCell>{daily.revisado_otro}</TableCell>
                                <TableCell>
                                    <Button variant="contained" onClick={() => handleEdit(daily.id, daily.state_id, daily.contract_id)} color="primary">Ir</Button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
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

export default DailysTable;
