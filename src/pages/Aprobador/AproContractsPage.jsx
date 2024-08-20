import React, { useEffect, useState }  from 'react';
import ContractTable from '../../Components/Containers/Aprobador/AproContractsTable';
import { Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../helpers/config';
import { toast } from 'react-toastify';

const ContractsPage = () => {
    const [contracts, setContracts] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        fetchContracts(page + 1, rowsPerPage);
    }, [page, rowsPerPage]);
    const fetchContracts = async (page, rowsPerPage) => {
        try {
            const response = await axios.get(`${BASE_URL}/contracts?page=${page}&per_page=${rowsPerPage}`);
            setContracts(response.data.data);
            setTotalCount(response.data.total);
        } catch (error) {
            console.error('Error al obtener los contratos:', error);
        }
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
         sx={{ width: '95%', margin: '0 auto', mt: 4}}
       >
        <div>
            <h2>Seleccionar Contratos</h2>
            <Box display="flex" justifyContent="flex-end" mb={2}>
               
            </Box>
            <ContractTable 
                contracts={contracts}
                page={page}
                rowsPerPage={rowsPerPage}
                totalCount={totalCount}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </div>
        </Box>
    );
};

export default ContractsPage;
