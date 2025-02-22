import React, { useEffect, useState , useContext}  from 'react';
import DailysTable from '../../Components/Containers/Revisor/RevListaDailysTable';
import { Box, Button } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../helpers/config';
import { toast } from 'react-toastify';
import { AuthContext } from '../../Components/context/authContext'

const ContractsPage = () => {
    const {currentUser } = useContext(AuthContext);
    const [dailys, setDailys] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const  contract_id = currentUser.contract_id;


    useEffect(() => {
        fetchDailys(page + 1, rowsPerPage);
    }, [page, rowsPerPage]);
    

    const fetchDailys = async (page, rowsPerPage) => {
        try {
            const response = await axios.get(`${BASE_URL}/Dailys?contract_id=${contract_id}&page=${page}&per_page=${rowsPerPage}`);
            const dailys = response.data;
            const filteredDailys = dailys.filter(daily => daily.state_id === 2 || daily.state_id === 3);

            setDailys(filteredDailys);
            setTotalCount(response.data.total);
        } catch (error) {
            console.error('Error al obtener los Dailys:', error);
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
            <h2>Revisar Daily Report</h2>
            <Box display="flex" justifyContent="flex-end" mb={2}>

            </Box>
            <DailysTable 
                dailys={dailys}
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
