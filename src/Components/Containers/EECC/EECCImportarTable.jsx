import { useMemo, useState } from 'react';
import {
    MRT_EditActionButtons,
    MaterialReactTable,
    // createRow,
    useMaterialReactTable,
} from 'material-react-table';
import {
    Box,
    Button,
    TextField,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Tooltip,
    Typography,
    Modal,
    Chip,
    Checkbox
} from '@mui/material';
import {
    QueryClient,
    QueryClientProvider,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ListIcon from '@mui/icons-material/List';
import SaveIcon from '@mui/icons-material/Save';
import { BASE_URL } from '../../../helpers/config';
import axios from 'axios';
import { toast } from 'react-toastify';
import FeaturedPlayListIcon from '@mui/icons-material/FeaturedPlayList';
import { render } from 'react-dom';
import { set } from 'react-hook-form';
import CancelIcon from '@mui/icons-material/Cancel';
import { useNavigate } from 'react-router-dom';
import ExcelJS from 'exceljs';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import { se } from 'date-fns/locale';
import _ from 'lodash';





//list of field types
const ListTypes = [
    'text',
    'integer',
    'list',
    'hour',
    'date'
];
//list of True/False
const ListRequired = [
    'Si', 'No'
];


const Table = ({ handleCreateField, handleSaveField, openDeleteConfirmModal, fields, idSheet, idDaily, contract_id, items, GuardarCambios, handleImportar, handleDescargarTemplate, dataTemp, validationErrors, handleChangeRow, data, validationErrorsTemp, handleCancelEditRow }) => {



    const columns = useMemo(() => {
        const safeFields = fields || [];
        const safeValidationErrors = validationErrorsTemp || {};
        return [
            {
                accessorKey: 'validation',
                header: 'Validación',
                enableEditing: false,
                muiTableHeadCellProps: {
                    align: 'left',
                },
                muiTableBodyCellProps: {
                    align: 'center',
                },
                muiTableFooterCellProps: {
                    align: 'center',
                },
                Cell: ({ row }) => {
                    const hasError = safeValidationErrors[`validation-${row.id}`] ? true : false;
                    return hasError ? (
                        <ErrorIcon color="error" />
                    ) : (
                        <CheckCircleIcon color="primary" />
                    );
                },
            },
            ...safeFields
                .filter((field) => field.name !== 'id')
                .map((field) => {
                    const newfieldname = `${field.name}-${idSheet}`;
                    return {
                        accessorKey: field.name,
                        header: field.name,
                        ...(field.name === 'Comentarios EECC' && { size: 300 }),
                        ...(field.name === 'Comentarios Codelco' && { enableEditing: false, size: 300 }),
                        muiTableHeadCellProps: {
                            align: 'left',
                        },
                        muiTableBodyCellProps: {
                            align: 'center',
                        },
                        muiTableFooterCellProps: {
                            align: 'center',
                        },
                        muiEditTextFieldProps: ({ cell, row, table }) => ({
                            id: `${field.name}-${row.id}`,
                            required: true,
                            error: !!safeValidationErrors[`${field.name}-${row.id}`],
                            helperText: safeValidationErrors[`${field.name}-${row.id}`],
                            ...(field.field_type === 'integer' && { type: 'number' }),
                            ...(field.field_type === 'date' && { type: 'date' }),
                            ...(field.field_type === 'hour' && { type: 'time' }),
                            onChange: (e) => handleChangeRow(e, field, row, table),
                            ...((field.name === 'HH Trabajadas') && data.sheet === 'Personal' && {
                                type: 'number',
                                inputProps: {
                                    step: '1',
                                    pattern: "[0-9]*\\.?[0-9]+",
                                    onKeyPress: (event) => {
                                        if (event.key === '.' || event.key === '+' || event.key === 'e') {
                                            event.preventDefault();
                                        }
                                    },
                                },
                            }),

                        }),
                        ...(field.field_type === 'list' && {
                            editVariant: 'select',
                            editSelectOptions: field.dropdown_lists,
                        }),


                    };
                }),
        ];
    }, [fields, validationErrors, idSheet, validationErrorsTemp]);


    const table = useMaterialReactTable({
        columns,
        data: dataTemp,
        createDisplayMode: 'row', //default ('row', and 'custom' are also available)
        editDisplayMode: 'row', //default ('row', 'cell', 'table', and 'custom' are also available)
        enableEditing: true,
        initialState: { columnVisibility: { id: false } },
        getRowId: (row) => row.id,
        onCreatingRowCancel: handleCancelEditRow,
        onCreatingRowSave: handleCreateField,
        onEditingRowCancel: handleCancelEditRow,
        onEditingRowSave: handleSaveField,
        //optionally customize modal content

        //optionally customize modal content
        renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
            <>
                <DialogTitle variant="h3">Edit Field</DialogTitle>
                <DialogContent
                    sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                >
                </DialogContent>
                <DialogActions>
                    <MRT_EditActionButtons variant="text" table={table} row={row} />
                </DialogActions>
            </>
        ),
        // row.original.name != 'Item' esto es ya que el item deberia modificarse solo desde la seccion programa
        renderRowActions: ({ row, table }) => (

            <Box sx={{ display: 'flex', gap: '1rem' }}>
                {row.original.is_standard !== 'Si' && (
                    <Tooltip title="Edit">
                        <IconButton onClick={() => table.setEditingRow(row)}>
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                )}

                {row.original.is_standard !== 'Si' && (
                    <Tooltip title="Delete">
                        <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>

        ),
        renderTopToolbarCustomActions: ({ table }) => (
            <Box sx={{ display: 'flex', gap: '1rem' }}>
                <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleImportar}
                    style={{ display: 'none' }}
                    id="importar-excel"
                />
                <label htmlFor="importar-excel">
                    <Button
                        variant="contained"
                        color="secondary"
                        component="span"
                        startIcon={<FeaturedPlayListIcon />}
                    >
                        Importar Excel
                    </Button>
                </label>

                <Button variant="contained" color="secondary" onClick={handleDescargarTemplate} startIcon={<FeaturedPlayListIcon />}>
                    Descargar Template
                </Button>
                <Button style={{ backgroundColor: '#01579b' }} variant="contained" startIcon={<FeaturedPlayListIcon />}
                    onClick={GuardarCambios} >
                    Guardar Cambios
                </Button>

            </Box>
        ),
        /*  state: { 
            isLoading: isLoadingFields,
            isSaving: isCreatingField || isUpdatingField || isDeletingField,
            showAlertBanner: isLoadingFieldsError,
            showProgressBars: isFetchingFields,
          }, */
    });

    return (
        <>
            <MaterialReactTable table={table} />


        </>
    );
}

const queryClient = new QueryClient();

const TableEstructure = ({ data, idDaily, contract_id, items }) => {
    const navigate = useNavigate();

    const [dataTemp, setDataTemp] = useState([]); //estos son los valores del archivo excel
    const [validationErrors, setValidationErrors] = useState({}); //este son los errores provenientes del archivo excel
    const [validationErrorsTemp, setValidationErrorsTemp] = useState({}); //estos son los errores que se pueden ir modificando en la tabla (principalmente si es que elige un correcto para que no le siga marcando error)

    const [loading, setLoading] = useState(false);


    if (!data || !data.fields) return null;
    let fields = data.fields.sort((a, b) => a.step - b.step);

    //busco los items para la hoja de avances
    const idSheet = data.idSheet;
    if (!fields.some(field => field.name === 'id')) {
        fields.push({ name: "id" });
    }

    const handleChangeRow = (event, field, row, table) => {

        const fieldname = `${field.name}-${row.id}`;
        const newValue = event.target.value;
        // Crear una copia profunda de validationErrors
        let newValidationErrors = JSON.parse(JSON.stringify(validationErrorsTemp));
        if (validationErrorsTemp[fieldname]) {
            delete newValidationErrors[fieldname];
        }

        let filteredValidationErrors = Object.fromEntries(
            Object.entries(newValidationErrors).filter(([key, value]) => key.endsWith(`-${row.id}`))
        );


        if (Object.keys(filteredValidationErrors).every((key) => key === `validation-${row.id}`)) {
            toast.success('Se han corregido todos los errores de la fila');
            delete newValidationErrors[`validation-${row.id}`];
        }


        setValidationErrorsTemp(newValidationErrors);
        return;


    };

    const handleCreateField = async ({ values, table }) => {
        const newValidationErrors = validateField(values);
        if (Object.values(newValidationErrors).some((error) => error)) {
            setValidationErrors(newValidationErrors);
            return;
        }
        //setValidationErrors({});

        const stepValueAsInteger = parseInt(values.step, 10);
        // Generar un ID temporal para el nuevo campo
        const newField = {
            ...values,
            step: stepValueAsInteger,
            id: (Math.random() + 1).toString(36).substring(7),
        };
        // Crear una copia profunda de steps para evitar mutaciones directas
        const newSteps = [...steps];
        // Asegurarse de que el objeto en el currentStep exista y tenga un arreglo de fields
        if (newSteps[currentStep] && Array.isArray(newSteps[currentStep].fields)) {
            newSteps[currentStep].fields = [...newSteps[currentStep].fields, newField];
        } else {
            // Si no existe, inicializarlo con el nuevo campo
            newSteps[currentStep].fields = [{ ...newField }];;
        }
        setSteps(newSteps); // Actualizar el estado global
        table.setCreatingRow(null); // Exit creating mode
    };

    const handleSaveField = async ({ values, table, row }) => {

        let newValidationErrors = validationErrorsTemp;

        let filteredValidationErrors = Object.fromEntries(
            Object.entries(newValidationErrors).filter(([key, value]) => key.endsWith(`-${row.id}`))
        );

        if (Object.keys(filteredValidationErrors).length !== 0) {
            toast.error('No se puede guardar, aun existen errores en la fila');
            return;
        } else {
            setValidationErrors(newValidationErrors);
        }

        let newDataTemp = _.cloneDeep(dataTemp);
        newDataTemp[row.id] = values;
        // Remove the validation parameter
        delete newDataTemp[row.id].validation;
        setDataTemp(newDataTemp);


        table.setEditingRow(null); // Exit editing mode
    };

    const handleCancelEditRow = (data) => {
        const row = data.row;
        const table = data.table;
        // Crear una copia profunda de validationErrors
        let newValidationErrors = JSON.parse(JSON.stringify(validationErrors));

        let filteredValidationErrors = Object.fromEntries(
            Object.entries(newValidationErrors).filter(([key, value]) => key.endsWith(`-${row.id}`))
        );
        newValidationErrors = { ...newValidationErrors, ...filteredValidationErrors };
        setValidationErrorsTemp(newValidationErrors);



        table.setEditingRow(null); // Exit editing mode
    };

    const handleImportar = async (event) => {
        setLoading(true); // Iniciar el estado de carga
        const file = event.target.files[0];
        const reader = new FileReader();
        //estas son las columnas que deberia tener el archivo excel
        const headersCorrectas = Object.values(fields)
            .map(field => field.name)
            .filter(name => name !== 'id');

        reader.onload = async (e) => {
            const buffer = e.target.result;
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(buffer);

            //leo la primera hoja
            const worksheet = workbook.worksheets[0];

            // Convierte la hoja a un array de objetos
            const jsonData = [];
            const headers = [];
            //seteo los headers
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber === 1) {
                    row.eachCell((cell, colNumber) => {
                        headers.push(cell.value);
                    });
                }
            });
            //verifico que los headers sean correctos
            if (headersCorrectas.length !== headers.length || !headersCorrectas.every((value, index) => value === headers[index])) {
                toast.error('Los encabezados no son los correctos, asegurarse de utilizar template.');
                setLoading(false); // Detener el estado de carga si no hay archivo
                return;
            }
            //seteo los datos
            worksheet.eachRow((row, rowNumber) => {

                const rowValues = row.values;
                jsonData.push(rowValues);

            });

            //verificar que los datos correspondan a alguna opcion de los dropdown_list en caso de ser list
            const transformedData = transformData(jsonData);
            const validationErrorsVar = validateData(transformedData, fields);
            //let newValidationErrors = _.cloneDeep(validationErrors);

            const valor1 = _.cloneDeep(validateData(transformedData, fields));
            const valor2 = _.cloneDeep(validateData(transformedData, fields));
            setValidationErrors(valor1);
            setValidationErrorsTemp(valor2);

            setDataTemp(transformedData);

            // Restablecer el valor del input de archivo
            event.target.value = null;
        };

        reader.readAsArrayBuffer(file);
        event.target.value = null;
        setLoading(false);

        return;
    };

    const validateData = (rows, fields) => {
        const errors = {};
        //Validación para hoja Personal
        if (data.sheet == 'Personal') {

            // Validación para Género
            const generoField = fields.find(field => field.name === 'Género');
            const generoValues = generoField ? generoField.dropdown_lists.map(item => item.value) : [];

            // Validación para Cargo
            const cargoField = fields.find(field => field.name === 'Cargo');
            const cargoValues = cargoField ? cargoField.dropdown_lists.map(item => item.value) : [];

            // Validación para Categoría
            const categoriaField = fields.find(field => field.name === 'Categoría');
            const categoriaValues = categoriaField ? categoriaField.dropdown_lists.map(item => item.value) : [];

            //Validación para Jornada
            const jornadaField = fields.find(field => field.name === 'Jornada');
            const jornadaValues = jornadaField ? jornadaField.dropdown_lists.map(item => item.value) : [];

            //Validación para Turno
            const turnoField = fields.find(field => field.name === 'Turno');
            const turnoValues = turnoField ? turnoField.dropdown_lists.map(item => item.value) : [];

            //Validación para Estado Personal
            const estadoPersonalField = fields.find(field => field.name === 'Estado Personal');
            const estadoPersonalValues = estadoPersonalField ? estadoPersonalField.dropdown_lists.map(item => item.value) : [];

            //Validación para Área de Trabajo
            const areaTrabajoField = fields.find(field => field.name === 'Área de Trabajo');
            const areaTrabajoValues = areaTrabajoField ? areaTrabajoField.dropdown_lists.map(item => item.value) : [];

            rows.forEach((row, rowIndex) => {
                if (row['Género'] && !generoValues.includes(row['Género'])) {
                    errors[`Género-${rowIndex}`] = `Valor erroneo Género`;
                    errors[`validation-${rowIndex}`] = 'error';
                }
                if (row['Cargo'] && !cargoValues.includes(row['Cargo'])) {
                    errors[`Cargo-${rowIndex}`] = `Valor erroneo Cargo`;
                    errors[`validation-${rowIndex}`] = 'error';
                }
                if (row['Categoría'] && !categoriaValues.includes(row['Categoría'])) {
                    errors[`Categoría-${rowIndex}`] = `Valor erroneo Categoría`;
                    errors[`validation-${rowIndex}`] = 'error';
                }
                if (row['Jornada'] && !jornadaValues.includes(row['Jornada'])) {
                    errors[`Jornada-${rowIndex}`] = `Valor erroneo Jornada`;
                    errors[`validation-${rowIndex}`] = 'error';
                }
                if (row['Turno'] && !turnoValues.includes(row['Turno'])) {
                    errors[`Turno-${rowIndex}`] = `Valor erroneo Turno`;
                    errors[`validation-${rowIndex}`] = 'error';
                }
                if (row['Estado Personal'] && !estadoPersonalValues.includes(row['Estado Personal'])) {
                    errors[`Estado Personal-${rowIndex}`] = `Valor erroneo Estado Personal`;
                    errors[`validation-${rowIndex}`] = 'error';
                }
                if (row['Área de Trabajo'] && !areaTrabajoValues.includes(row['Área de Trabajo'])) {
                    errors[`Área de Trabajo-${rowIndex}`] = `Valor erroneo Área de Trabajo`;
                    errors[`validation-${rowIndex}`] = 'error';
                }
                if (row['HH Trabajadas']) {
                    if (row['HH Trabajadas'] === '' || row['HH Trabajadas'] === null || row['HH Trabajadas'] === undefined) {
                        return;
                    } else {
                        // Convertir el valor a número
                        const numberValue = Number(row['HH Trabajadas']);
                        if (!Number.isInteger(numberValue)) {
                            errors[`HH Trabajadas-${rowIndex}`] = `Valor erroneo HH Trabajadas`;
                            errors[`validation-${rowIndex}`] = 'error';
                        }
                    }

                }
            });



        }
        return errors;

    };

    const transformData = (jsonData) => {
        const [headers, ...rows] = jsonData;
        return rows.map((row) => {
            const rowData = {};
            headers.forEach((header, index) => {
                rowData[header] = row[index];
            });
            return rowData;
        });
    };
    const handleDescargarTemplate = async ({ values, table, row }) => {
        // Crear un nuevo libro de trabajo y una hoja de trabajo
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Template');
        // Agregar encabezados, quitando todo lo que venga después de "-"
        const headers = Object.values(fields)
            .map(field => field.name)
            .filter(name => name !== 'id');

        worksheet.addRow(headers);



        // Generar el archivo Excel y descargarlo
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'export.xlsx');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    };

    const GuardarCambios = async () => {

// veo si quedan errores en la tabla
if (Object.keys(validationErrorsTemp).length !== 0) {
    toast.error('No se puede guardar, aun existen errores en la Tabla');
    return;
}

        //transfmar nombres de fields de la row a nombres de fields de la tabla
        //toda esta transformaciom es para guardar en la tabla bbdd de valuesRow
        let transformedValues = [];
        let transformedValuesObj = {};
        dataTemp.map((values, index) => {

            // Ensure transformedValues[index] is initialized as an object
            if (!transformedValues[index]) {
                transformedValues[index] = {};
            }

            fields.map((field) => {
                var step = field.step;
                var name = `col_${step}`;
                transformedValues[index][name] = values[field.name];

            });
            transformedValues[index]['daily_id'] = idDaily;
            transformedValues[index]['daily_sheet_id'] = idSheet;
             transformedValuesObj[index] = Object.assign({}, transformedValues[index]);

        })
        try {
            const response = await axios.put(`${BASE_URL}/importDataDaily/${idDaily}`, transformedValues);
            toast.success('Se han guardado los cambios correctamente');
            navigate(`/EECCDailys/edit/${idDaily}`);

        } catch (error) {
            console.error('error:', error);
            toast.error('Error al guardar los cambios');
            return;
        }
      

  


    }



    const openDeleteConfirmModal = (row) => {
        if (window.confirm('Are you sure you want to delete this Field?')) {
            const newSteps = [...steps];

            newSteps[currentStep].fields = steps[currentStep].fields.filter((field) => field.id !== row.original.id);

            setSteps(newSteps); // Update local state
        }
    };



    return (
        <QueryClientProvider client={queryClient}>
            <Table
                fields={fields} idSheet={idSheet} idDaily={idDaily} contract_id={contract_id} items={items} dataTemp={dataTemp} validationErrors={validationErrors} handleChangeRow={handleChangeRow} data={data} validationErrorsTemp={validationErrorsTemp} handleCancelEditRow={handleCancelEditRow}
                handleCreateField={handleCreateField}
                handleSaveField={handleSaveField}
                openDeleteConfirmModal={openDeleteConfirmModal}
                GuardarCambios={GuardarCambios}
                handleImportar={handleImportar}
                handleDescargarTemplate={handleDescargarTemplate} />
            <Backdrop style={{ zIndex: 1300 }} open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </QueryClientProvider>);


};



export default TableEstructure;

const validateRequired = (value) => !!value.length;
const validateEmail = (email) =>
    !!email.length &&
    email
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        );
function validateField(Field) {
    return {
        name: !validateRequired(Field.name) ? ' Name is Required' : '',
        description: !validateRequired(Field.description) ? 'description is Required' : '',
        field_type: !validateRequired(Field.field_type) ? 'field_type is Required' : '',
        //step: !validateRequired(Field.step) ? 'step is Required' : '',  //para el step hay que crear una validación especial ya que al ser numero no me tira el length
    };
}


