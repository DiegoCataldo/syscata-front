import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TablePagination } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../helpers/config';
import { toast } from 'react-toastify';
import axios from 'axios';

const ContractTable = ({ contracts, page, rowsPerPage, totalCount, handleChangePage, handleChangeRowsPerPage }) => {
    console.log('contratos', contracts)
    const navigate = useNavigate();
    
    const handleEdit = (id) => {
        navigate(`/contracts/edit/${id}`);
    };


    const handleDelete = async (id) => {
        try {
            await axios.delete(`${BASE_URL}/contracts/${id}`);
            toast.success('Contrato eliminado exitosamente');
            navigate(`/contracts`);
        } catch (error) {
            toast.error('Error al eliminar el contrato. Intente más tarde.');
            console.error('Error al eliminar el contrato:', error);
            
        }
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
                        <TableCell>API</TableCell>
                        <TableCell>Empresa contratista</TableCell>
                        <TableCell>Rut Empresa contratista</TableCell>
                        {/* <TableCell>Encargados Codelco(Daily)</TableCell> */}
                        <TableCell>Encargado Contratista(Daily)</TableCell>
                        <TableCell>Visualizador</TableCell>
                        <TableCell>Administrador de terreno</TableCell>
                        {/* <TableCell>Acciones</TableCell> */}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {contracts.map((contract) => (
                        <TableRow key={contract.id}>
                            <TableCell>{contract.nombre_contrato}</TableCell>
                            <TableCell>{contract.NSAP}</TableCell> 
                            <TableCell>{contract.DEN}</TableCell> 
                            <TableCell>{contract.proyecto}</TableCell> 
                            <TableCell>{contract.API}</TableCell> 
                            <TableCell>{contract.empresa_contratista}</TableCell> 
                            <TableCell>{contract.rut_contratista}</TableCell> 
                            <TableCell>
                            {contract.encargadoContratista.map((encargado, index) => (
                                <span key={index}>
                                    {encargado.name}
                                    {index !== contract.encargadoContratista.length - 1 && ', '}
                                </span>
                            ))}
                        </TableCell>
                            <TableCell>
                            {contract.visualizador.map((item, index) => (
                                <span key={index}>
                                    {item.name}
                                    {index !== contract.visualizador.length - 1 && ', '}
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
                                <Button variant="contained" onClick={() => handleEdit(contract.id)} color="primary">Editar</Button>
                                <Button variant="contained" onClick={() => handleDelete(contract.id)} color="primary">Eliminar</Button>
                                
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
