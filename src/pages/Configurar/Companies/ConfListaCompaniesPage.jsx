import React, { useEffect, useState , useContext}  from 'react';
import DailysTable from '../../../Components/Containers/Configurar/Companies/ConfListaCompaniesTable';
import { Box, Button } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../../helpers/config';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../Components/context/authContext'

const ContractsPage = () => {
    const {currentUser } = useContext(AuthContext);
    const [companies, setCompanies] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const  contract_id = currentUser.contract_id;


    useEffect(() => {
        fetchDailys(page + 1, rowsPerPage);
    }, [page, rowsPerPage]);
    

    const fetchDailys = async (page, rowsPerPage) => {
        try {
            const response = await axios.get(`${BASE_URL}/companies`);
            const companies = response.data;

            setCompanies(companies);
            setTotalCount(response.data.total);
        } catch (error) {
            console.error('Error al obtener las empresas:', error);
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
         sx={{ width: '95%', margin: '0 auto', mt: 4}}>
        <div>
            <h2>Gestionar Empresas</h2>
            <Box display="flex" justifyContent="flex-end" mb={2}>

            </Box>
            <DailysTable 
                companies={companies}
                page={page}
                rowsPerPage={rowsPerPage}
                totalCount={totalCount}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}            />
        </div>
        </Box>
    );
};

export default ContractsPage;
