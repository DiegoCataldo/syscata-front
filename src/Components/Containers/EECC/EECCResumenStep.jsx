import React, { useEffect, useState, useMemo } from 'react';

import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import axios from 'axios';
import { BASE_URL } from '../../../helpers/config';



const TableP = ({ data }) => {


    const columns = useMemo(
        //column definitions...
        () => [
            {
                accessorKey: 'firstName',
                header: 'First Name',
            },
            {
                accessorKey: 'lastName',
                header: 'Last Name',
            },

            {
                accessorKey: 'address',
                header: 'Address',
            },
            {
                accessorKey: 'city',
                header: 'City',
            },

            {
                accessorKey: 'state',
                enableColumnOrdering: false,
                header: 'State',
            },
        ],
        [],
        //end
    );

    const table = useMaterialReactTable({
        columns,
        data: data,
        enableExpandAll: false, //hide expand all double arrow in column header
        enableExpanding: true,
        filterFromLeafRows: true, //apply filtering to all rows instead of just parent rows
        getSubRows: (row) => row.subRows, //default
        initialState: { expanded: true }, //expand all rows by default
        paginateExpandedRows: false, //When rows are expanded, do not count sub-rows as number of rows on the page towards pagination
    });

    return <MaterialReactTable table={table} />;
}


const TableResumen = ({ data, idDaily }) => {


    const [steps, setSteps] = useState([]);
    const [rows, setRows] = useState([]);

    useEffect(() => {
        fetchStepsAndFields();
        // console.log('rows', rows);

    }, [idDaily]);


    //READ hook (get fields from api)
    const fetchStepsAndFields = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/Dailys/${idDaily}/dailyStructure`)
            const stepsOrdenados = response.data.steps.map((step) => {
                return {
                    ...step,
                    fields: step.fields.sort((a, b) => a.step - b.step)
                };
            });
            var rowsResponse = response.data.values;
            console.log('rowsResponse', rowsResponse);

            setSteps(stepsOrdenados);
            setRows(rowsResponse);
            console.log('rows', rows);
        } catch (error) {
            console.error('Error al obtener pasos y campos:', error);
        }
    }

    const data3 = [
        {
            firstName: 'Dylan',
            lastName: 'Murray',
            address: '261 Erdman Ford',
            city: 'East Daphne',
            state: 'Kentucky',
            subRows: [
                {
                    firstName: 'Ervin',
                    lastName: 'Reinger',
                    address: '566 Brakus Inlet',
                    city: 'South Linda',
                    state: 'West Virginia',
                    subRows: [
                        {
                            firstName: 'Jordane',
                            lastName: 'Homenick',
                            address: '1234 Brakus Inlet',
                            city: 'South Linda',
                            state: 'West Virginia',
                        },
                        {
                            firstName: 'Jordan',
                            lastName: 'Clarkson',
                            address: '4882 Palm Rd',
                            city: 'San Francisco',
                            state: 'California',
                        },
                    ],
                },
                {
                    firstName: 'Brittany',
                    lastName: 'McCullough',
                    address: '722 Emie Stream',
                    city: 'Lincoln',
                    state: 'Nebraska',
                },
            ],
        },
        {
            firstName: 'Raquel',
            lastName: 'Kohler',
            address: '769 Dominic Grove',
            city: 'Columbus',
            state: 'Ohio',
            subRows: [
                {
                    firstName: 'Branson',
                    lastName: 'Frami',
                    address: '32188 Larkin Turnpike',
                    city: 'Charleston',
                    state: 'South Carolina',
                },
            ],
        },
    ];

    return (
        <TableP data={data3} />
    );


};

export default TableResumen;
