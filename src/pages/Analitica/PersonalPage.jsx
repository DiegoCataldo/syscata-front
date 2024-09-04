import React, { useEffect, useState, useContext }  from 'react';
import ContractTable from '../../Components/Containers/SelectRol/SRContractsTable';
import { Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../helpers/config';
import { toast } from 'react-toastify';
import { AuthContext } from '../../Components/context/authContext'


const AnaliticaPage = () => {

    return (

        <div style={{ width: '100%', height: '100vh', overflow: 'hidden', position: 'relative' }}>
        <iframe 
            title="Análisis Dotación" 
            src="https://app.powerbi.com/view?r=eyJrIjoiY2M5YmZkOWQtZWZiNy00Zjc2LTkzMDItZmNjNzZiMTNjOTFmIiwidCI6ImNhNTU0YmRmLWQxYzgtNGJjNy04ZTdmLTAzMWJjOWU2ZDAzZiIsImMiOjR9&navContentPaneEnabled=false&filterPaneEnabled=false" 
            frameBorder="0" 
            allowFullScreen={true} 
            style={{ 
                width: '100%', 
                height: '100%', 
                border: 'none', 
              /*  transform: 'scale(1.3) translate(-11%, 0%)', 
                transformOrigin: 'top left', 
                position: 'absolute', 
                top: '0', 
                left: '0' */
            }}
        ></iframe>
    </div>
    )
}

export default AnaliticaPage;