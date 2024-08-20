import React, { useEffect, useState, useContext } from 'react';
import ContractTable from '../../Components/Containers/SelectRol/SRRoleTable';
import { Box, Button } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../helpers/config';
import { toast } from 'react-toastify';
import { AuthContext } from '../../Components/context/authContext'

const RolePage = () => {
    const [roles, setRoles] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [contractsUsers, setContractsUsers] = useState([]);
    const { currentUser } = useContext(AuthContext);

    const { contract_id } = useParams();

    useEffect(() => {
        fetchContracts();
    }, [contract_id]);

    const fetchContracts = async () => {
        try {

            const resContractsUsers = await axios.get(`${BASE_URL}/getContractsUser`);
            const resRolesData = await axios.get(`${BASE_URL}/roles`);

            const rolesData = resRolesData.data;
            const contractsUsersData = resContractsUsers.data;

            //si es super admin, mostrar todos los contratos
            const is_super_admin = currentUser.is_super_admin;
            if (is_super_admin === "Si") {
                setRoles(rolesData);
            } else {
                //si no es super admin, mostrar solo los rolesData que tiene asignado en resContractUsers.data y que correspondan al contrato seleccionado
                const filteredContractsUsers = contractsUsersData.filter(userContract =>
                    userContract.user_id === currentUser.id && userContract.contract_id == contract_id
                );

                const filteredRoles = rolesData.filter(role =>
                    filteredContractsUsers.some(userContract => userContract.role_id === role.id)
                );

                console.log('filteredRoles', filteredRoles);
                setRoles(filteredRoles);
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
            sx={{ width: '95%', margin: '0 auto', mt: 4 }}
        >
            <div>
                <h2>Seleccionar Rol</h2>
                <Box display="flex" justifyContent="flex-end" mb={2}>

                </Box>
                <ContractTable
                    roles={roles}
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

export default RolePage;
