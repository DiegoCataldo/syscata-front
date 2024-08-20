import React, { useEffect, useState, useContext }  from 'react';
import ContractTable from '../../Components/Containers/SelectRol/SRContractsTable';
import { Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../helpers/config';
import { toast } from 'react-toastify';
import { AuthContext } from '../../Components/context/authContext'

const ContractsPage = () => {
    const [contracts, setContracts] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [contractsUsers, setContractsUsers] = useState([]);
    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
        fetchContracts(page + 1, rowsPerPage);
    }, [page, rowsPerPage]);

    const fetchContracts = async (page, rowsPerPage) => {
        try {
            
            const response = await axios.get(`${BASE_URL}/contracts?page=${page}&per_page=${rowsPerPage}`);
            const allcontracts = response.data.data;
            const resContractsUsers = await axios.get(`${BASE_URL}/getContractsUser`);
            //si es super admin, mostrar todos los contratos
            const is_super_admin = currentUser.is_super_admin;
            if (is_super_admin === "Si") {
                setContracts(allcontracts);
            } else {
                //si no es super admin, mostrar solo los contratos que tiene asignados
                const filteredContracts = allcontracts.filter(contract =>
                    resContractsUsers.data.some(userContract => 
                        userContract.user_id === currentUser.id && userContract.contract_id === contract.id
                    )
                );
                setContracts(filteredContracts);
            }

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
         sx={{ width: '95%', margin: '0 auto', mt: 4}}
       >
        <div>
            <h2>Seleccionar Contrato</h2>
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
