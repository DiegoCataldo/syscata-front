import React, { useEffect, useState, useMemo } from 'react';
import { Grid, TextField, Button, Box, FormControl, InputLabel, Select, MenuItem, OutlinedInput, Chip, Checkbox, FormControlLabel, IconButton, Tooltip, Modal } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';



import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import axios from 'axios';
import { BASE_URL } from '../../../helpers/config';



const TablePersonal = ({ data }) => {


    const columns = useMemo(
        () => [
            {
                accessorKey: 'categoria',
                header: 'Categoría',
            },
            {
                accessorKey: 'hh_trabajadas',
                header: 'HH Trabajadas',
            },
            {
                accessorKey: 'dot_trabajando',
                header: 'Dotación Trabajando',
            },
            {
                accessorKey: 'dot_descanso',
                header: 'Dotación en Descanso',
            },
            {
                accessorKey: 'dot_total',
                header: 'Dotación Total',
            }
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
        initialState: { expanded: false }, //expand all rows by default
        paginateExpandedRows: false, //When rows are expanded, do not count sub-rows as number of rows on the page towards pagination
    });

    return <MaterialReactTable table={table} />;
}

const TableMaquinas = ({ data }) => {


    const columns = useMemo(
        () => [
            {
                accessorKey: 'categoria',
                header: 'Categoría',
            },
            {
                accessorKey: 'HMoperativas',
                header: 'HM Operativas',
            },
            {
                accessorKey: 'HMnoOperativas',
                header: 'HM No Operativas',
            },
            {
                accessorKey: 'HMmantenimiento',
                header: 'HM Mantención Programada',
            },
            {
                accessorKey: 'HMenPanne',
                header: 'HM en Panne',
            },
            {
                accessorKey: 'HMtotales',
                header: 'HM Totales',
            }


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
        initialState: { expanded: false }, //expand all rows by default
        paginateExpandedRows: false, //When rows are expanded, do not count sub-rows as number of rows on the page towards pagination
    });

    return <MaterialReactTable table={table} />;
}

const TableAvances = ({ data }) => {


    const columns = useMemo(
        () => [
            {
                accessorKey: 'categoria',
                header: 'Categoría',
            },
          
            {
                accessorKey: 'cantidad',
                header: 'cantidad',
            }

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
        initialState: { expanded: false }, //expand all rows by default
        paginateExpandedRows: false, //When rows are expanded, do not count sub-rows as number of rows on the page towards pagination
    });

    return <MaterialReactTable table={table} />;
}

const TablasResumen = ({ data, idDaily, contract_id }) => {


    const [steps, setSteps] = useState([]);
    const [rows, setRows] = useState([]);
    const [dataResumenPersonal, setDataResumenPersonal] = useState([]);
    const [dataResumenMaquinas, setDataResumenMaquinas] = useState([]);
    const [dataResumenAvances, setDataResumenAvances] = useState([]);

    useEffect(() => {
        fetchStepsAndFields();
        // console.log('rows', rows);

    }, [idDaily]);


    const calcularDataPersonal = (dataPersonal, keysArray) => {

        //keyarrays son las hojas en este caso uso la 0 para la hoja personal
        //defino los nombres de las fields
        const CategoriaName = `Categoría-${keysArray[0]}`;
        const HHtrabajadasName = `HH Trabajadas-${keysArray[0]}`;
        const areaName = `Área de Trabajo-${keysArray[0]}`;
        const estadoName = `Estado Personal-${keysArray[0]}`;


        //sumo todas las HH trabajadas
        const sumHHTTotal = dataPersonal.reduce((sum, row) => {
            const hhTrabajadas = parseFloat(row[HHtrabajadasName]) || 0;
            return sum + hhTrabajadas;
        }, 0);

        //sumo la dotacion total trabajando
        const sumDotTrabTotal = dataPersonal.reduce((count, row) => {
            const estado = row[estadoName];
            if (estado === "Trabajando") {
                return count + 1;
            }
            return count;
        }, 0);

        const sumDotDescTotal = dataPersonal.reduce((count, row) => {
            const estado = row[estadoName];
            if (estado === "Descanso") {
                return count + 1;
            }
            return count;
        }, 0);

        const sumDotTotal = dataPersonal.reduce((count, row) => {
            return count + 1;
        }, 0);


        // Agrupo por la field categoria y sumo las HH trabajadas
        const groupedCategoria = dataPersonal.reduce((acc, row) => {
            const categoria = row[CategoriaName];
            const hhTrabajadas = parseFloat(row[HHtrabajadasName]) || 0;
            const dotTrabajando = row[estadoName] === "Trabajando" ? 1 : 0;
            const dotDescanso = row[estadoName] === "Descanso" ? 1 : 0;
            const dotTotal = 1;
            //defino la estructura de la data
            if (!acc[categoria]) {
                acc[categoria] = { categoria, hh_trabajadas: 0, dot_trabajando: 0, dot_descanso: 0, dot_total: 0, subRows: [] };
            }

            acc[categoria].hh_trabajadas += hhTrabajadas;
            acc[categoria].dot_trabajando += dotTrabajando;
            acc[categoria].dot_descanso += dotDescanso;
            acc[categoria].dot_total += dotTotal;
            acc[categoria].subRows.push(row);
            return acc;
        }, {});

        // por cada field categoria agrupo por area y sumo las HH trabajadas
        const subRows = Object.values(groupedCategoria).map(categoria => {
            // Agrupar subRows por área y sumar HH Trabajadas
            const groupedArea = categoria.subRows.reduce((acc, row) => {
                const area = row[areaName];
                const hhTrabajadas = parseFloat(row[HHtrabajadasName]) || 0;
                const dotTrabajando = row[estadoName] === "Trabajando" ? 1 : 0;
                const dotDescanso = row[estadoName] === "Descanso" ? 1 : 0;
                const dotTotal = 1;

                if (!acc[area]) {

                    acc[area] = { categoria: area, hh_trabajadas: 0, dot_trabajando: 0, dot_descanso: 0, dot_total: 0 };
                }

                acc[area].hh_trabajadas += hhTrabajadas;
                acc[area].dot_trabajando += dotTrabajando;
                acc[area].dot_descanso += dotDescanso;
                acc[area].dot_total += dotTotal;

                return acc;
            }, {});

            const subRowsByArea = Object.values(groupedArea);

            return {
                categoria: categoria.categoria,
                hh_trabajadas: categoria.hh_trabajadas,
                dot_trabajando: categoria.dot_trabajando,
                dot_descanso: categoria.dot_descanso,
                dot_total: categoria.dot_total,
                subRows: subRowsByArea
            };
        });

        const dataPersonalVar = [
            {
                categoria: 'Total',
                hh_trabajadas: sumHHTTotal,
                dot_trabajando: sumDotTrabTotal,
                dot_descanso: sumDotDescTotal,
                dot_total: sumDotTotal,
                subRows: subRows
            }
        ];

        return dataPersonalVar;



    }

    const calcularDataMaquinas = (dataMaq, keysArray) => {

        const HHoperativasName = `Horas Operativas-${keysArray[1]}`;
        const HHnoOperativasName = `Horas No Operativas-${keysArray[1]}`;
        const HHmantenimientoName = `Horas Mantención Programada-${keysArray[1]}`;
        const HHenPanneName = `Horas Equipo en Panne-${keysArray[1]}`;

        //defino los nombres de las fields
        const areaName = `Área de Trabajo-${keysArray[1]}`;
        const equipoName = `Tipo de Equipo-${keysArray[1]}`;

        //sumo todas las HH trabajadas de cada hm
        const sumTotalOper = dataMaq.reduce((sum, row) => {
            const hm = parseFloat(row[HHoperativasName]) || 0;
            return sum + hm;
        }, 0);

        const sumTotalNoOper = dataMaq.reduce((sum, row) => {
            const hm = parseFloat(row[HHnoOperativasName]) || 0;
            return sum + hm;
        }, 0);

        const sumTotalMant = dataMaq.reduce((sum, row) => {
            const hm = parseFloat(row[HHmantenimientoName]) || 0;
            return sum + hm;
        }, 0);

        const sumTotalPanne = dataMaq.reduce((sum, row) => {
            const hm = parseFloat(row[HHenPanneName]) || 0;
            return sum + hm;
        }, 0);

        // Agrupo por area y sumo las HH trabajadas
        const groupedArea = dataMaq.reduce((acc, row) => {
            const area = row[areaName];
            const HMoperativas = parseFloat(row[HHoperativasName]) || 0;
            const HMnoOperativas = parseFloat(row[HHnoOperativasName]) || 0;
            const HMmantenimiento = parseFloat(row[HHmantenimientoName]) || 0;
            const HMenPanne = parseFloat(row[HHenPanneName]) || 0;
            const HMtotales = HMoperativas + HMnoOperativas + HMmantenimiento + HMenPanne;

            if (!acc[area]) {
                acc[area] = { categoria: area, HMoperativas: 0, HMnoOperativas: 0, HMmantenimiento: 0, HMenPanne: 0, HMtotales: 0, subRows: [] };
            }

            acc[area].HMoperativas += HMoperativas;
            acc[area].HMnoOperativas += HMnoOperativas;
            acc[area].HMmantenimiento += HMmantenimiento;
            acc[area].HMenPanne += HMenPanne;
            acc[area].HMtotales += HMtotales;

            acc[area].subRows.push(row);
            return acc;
        }, {});

        // por cada field area agrupo por equipo y sumo las HH trabajadas
        const subRows = Object.values(groupedArea).map(area => {
            // Agrupar subRows por área y sumar HH Trabajadas
            const groupedEquipo = area.subRows.reduce((acc, row) => {
                const equipo = row[equipoName];
                const HMoperativas = parseFloat(row[HHoperativasName]) || 0;
                const HMnoOperativas = parseFloat(row[HHnoOperativasName]) || 0;
                const HMmantenimiento = parseFloat(row[HHmantenimientoName]) || 0;
                const HMenPanne = parseFloat(row[HHenPanneName]) || 0;
                const HMtotales = HMoperativas + HMnoOperativas + HMmantenimiento + HMenPanne;


                if (!acc[equipo]) {
                    acc[equipo] = { categoria: equipo, HMoperativas: 0, HMnoOperativas: 0, HMmantenimiento: 0, HMenPanne: 0, HMtotales: 0, };
                }

                acc[equipo].HMoperativas += HMoperativas;
                acc[equipo].HMnoOperativas += HMnoOperativas;
                acc[equipo].HMmantenimiento += HMmantenimiento;
                acc[equipo].HMenPanne += HMenPanne;
                acc[equipo].HMtotales += HMtotales;

                return acc;
            }, {});

            const subRowsByEquipo = Object.values(groupedEquipo);

            return {
                categoria: area.categoria,
                HMoperativas: area.HMoperativas,
                HMnoOperativas: area.HMnoOperativas,
                HMmantenimiento: area.HMmantenimiento,
                HMenPanne: area.HMenPanne,
                HMtotales: area.HMtotales,
                subRows: subRowsByEquipo
            };
        });

        const data = [
            {
                categoria: 'Total',
                HMoperativas: sumTotalOper,
                HMnoOperativas: sumTotalNoOper,
                HMmantenimiento: sumTotalMant,
                HMenPanne: sumTotalPanne,
                HMtotales: sumTotalOper + sumTotalNoOper + sumTotalMant + sumTotalPanne,
                subRows: subRows
            }
        ];

        return data;



    }
    const calcularDataAvances = (dataAvances, keysArray) => {

        const CantidadName = `Cantidad-${keysArray[3]}`;


        //defino los nombres de las fields
        const unidadName = `Unidad-${keysArray[3]}`;
        const itemName = `Item-${keysArray[3]}`;

        //sumo todas las cantidades
        const sumTotalCantidad = dataAvances.reduce((sum, row) => {
            const hm = parseFloat(row[CantidadName]) || 0;
            return sum + hm;
        }, 0);

        // Agrupo por Unidad y sumo la cantidad
        const groupedUnidad = dataAvances.reduce((acc, row) => {
            const unidad = row[unidadName];
            const cantidad = parseFloat(row[CantidadName]) || 0;
            if (!acc[unidad]) {
                acc[unidad] = { categoria: unidad, cantidad: 0,  subRows: [] };
            }
            acc[unidad].cantidad += cantidad;
            acc[unidad].subRows.push(row);
            return acc;
        }, {});


        
        // por cada field area agrupo por equipo y sumo las HH trabajadas
        const subRows = Object.values(groupedUnidad).map(unidad => {
            // Agrupar subRows por área y sumar HH Trabajadas
            const groupedItem = unidad.subRows.reduce((acc, row) => {
                const item = row[itemName];
                const cantidad = parseFloat(row[CantidadName]) || 0;
                if (!acc[item]) {
                    acc[item] = { categoria: item, cantidad: 0};
                }
                acc[item].cantidad += cantidad;
                return acc;
            }, {});

            const subRowsByItem = Object.values(groupedItem);

            return {
                categoria: unidad.categoria,
                cantidad: unidad.cantidad,
                subRows: subRowsByItem
            };
        });


       
/*
        const data = [
            {
                categoria: 'Total',
                HMoperativas: sumTotalOper,
                HMnoOperativas: sumTotalNoOper,
                HMmantenimiento: sumTotalMant,
                HMenPanne: sumTotalPanne,
                HMtotales: sumTotalOper + sumTotalNoOper + sumTotalMant + sumTotalPanne,
                subRows: subRows
            }
        ]; */

        return subRows;



    }

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
            // console.log('rowsResponse', rowsResponse);

            setSteps(stepsOrdenados);
            setRows(rowsResponse);

            //obtengo el idsheet de cada hoja
            const keysArray = Object.keys(rowsResponse).map(key => Number(key));
            //obtengo la data de las hojas personal, maquinas e interfaz
            const dataPersonal = rowsResponse[keysArray[0]];
            const dataMaquinas = rowsResponse[keysArray[1]];
            const dataInterf = rowsResponse[keysArray[2]];
            const dataAvances = rowsResponse[keysArray[3]];

            //estructuro la data de la hoja personal
            const dataPersonalVar = calcularDataPersonal(dataPersonal, keysArray);
            //estructuro la data de la hoja maquinas
            const dataMaquinasVar = calcularDataMaquinas(dataMaquinas, keysArray);
              //estructuro la data de la hoja maquinas
              const dataAvancesVar = calcularDataAvances(dataAvances, keysArray);

            setDataResumenPersonal(dataPersonalVar);
            setDataResumenMaquinas(dataMaquinasVar);
            setDataResumenAvances(dataAvancesVar);
            //console.log('dataPersonalVar', dataPersonalVar);
            console.log('dataMaquinasVar', dataMaquinasVar);





        } catch (error) {
            console.error('Error al obtener pasos y campos:', error);
        }
    }






    return (
        <Box
        sx={{ width: '100%', margin: '0 auto', justifyContent: 'center', alignItems: 'center', paddingBottom: '2rem' }}
    >

        <Box sx={{ width: '95%', margin: '0 auto', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h3>Resumen Personal</h3>
                <TablePersonal data={dataResumenPersonal} />
            </div>
            <div style={{ textAlign: 'center' , marginBottom: '4rem' }}>
                <h3>Resumen Maquinarias</h3>
                <TableMaquinas data={dataResumenMaquinas} />
            </div>
            <div style={{ textAlign: 'center' }}>
                    <h3>Resumen Avances</h3>
                    <TableAvances data={dataResumenAvances} />
                </div>
        </Box>
    </Box>
    );


};

export default TablasResumen;
