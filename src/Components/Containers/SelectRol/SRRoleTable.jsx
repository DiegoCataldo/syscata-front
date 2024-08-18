import React, { useEffect, useState, useContext } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TablePagination } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';



const ContractTable = ({ roles, page, rowsPerPage, totalCount, handleChangePage, handleChangeRowsPerPage, onDeleteContract }) => {
    const {currentUser,  setCurrentUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleEdit = (role_id, role_name) => {
        let user = { ...currentUser, role_id: role_id, role_name: role_name };
        
        localStorage.setItem('currentUser', JSON.stringify(user));
        setCurrentUser(user);



        navigate(`/`);
    };



    return (
        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
                <TableRow>
                    <TableCell>Nombre Rol</TableCell>
                    <TableCell>Acciones</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {roles?.map((rol) => (
                    <TableRow key={rol.id}>
                        <TableCell>{rol.name_completo}</TableCell>
                      
                        <TableCell>
                            <Button variant="contained" onClick={() => handleEdit(rol.id, rol.name_completo )} color="primary">IR</Button>
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
