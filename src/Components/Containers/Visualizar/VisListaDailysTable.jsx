import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TablePagination } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const DailysTable = ({ dailys, page, rowsPerPage, totalCount, handleChangePage, handleChangeRowsPerPage }) => {
    const navigate = useNavigate();

    const handleEdit = (id, state_id, contract_id) => {
    
            navigate(`/VisVerDaily/${id}/${contract_id}`);
  
    };


    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Fecha</TableCell>
                        <TableCell>Estado</TableCell>
                        <TableCell>Revisión</TableCell>

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
                                <TableCell>{daily.revision}</TableCell>
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
