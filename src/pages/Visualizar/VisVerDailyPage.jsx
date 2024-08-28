import React, { useEffect, useState, useContext, useRef, useMemo } from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Typography from '@mui/material/Typography';
import { Link, useParams } from 'react-router-dom';
import { Grid, TextField, Button, Box, FormControl, InputLabel, Select, MenuItem, OutlinedInput, Chip, Checkbox, FormControlLabel, IconButton, Tooltip } from '@mui/material';
import TableEECC from '../../Components/Containers/Visualizar/VisVerDailyTable'
import TableResumen from '../../Components/Containers/Visualizar/VisverDailyResumen'
import TableComentarios from '../../Components/Containers/Visualizar/VisVerCommentsTable'
import { AuthContext } from '../../Components/context/authContext'
import axios from 'axios';
import { BASE_URL } from '../../helpers/config';
import { set } from 'date-fns';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useMaterialReactTable } from 'material-react-table';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import moment from 'moment-timezone';
import FileDownloadIcon from '@mui/icons-material/FileDownload';







// const steps = ['Select campaign settings', 'Create an ad group', 'Create an ad'];

const IngresarDaily = ({ onSubmit, users, companies }) => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});
  const [steps, setSteps] = useState([]);
  const { accessToken, currentUser } = useContext(AuthContext);
  const [fields, setFields] = useState([]);
  const [dailyInfo, setDailyInfo] = useState({});
  const [dataRows, setDataRows] = useState([]);
  const [dataComentarios, setDataComentarios] = useState([]);
  const [acciones, setAcciones] = useState([]);
  

  const contract_id = currentUser.contract_id;


  const { daily_id } = useParams()

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  useEffect(() => {
    // console.log('entro al useEffect');
    fetchStepsAndFields();
    //console.log('fields:', fields);
  }, [daily_id]);

  const fetchStepsAndFields = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/Dailys/${daily_id}/dailyStructure`);
      
      const stepsOrdenados = response.data.steps.map((step) => {
        return {
          ...step,
          fields: step.fields.sort((a, b) => a.step - b.step)
        };
      });

      //le agrego un paso de resumen al final
      const FinalizarStep = {
        idSheet: 'resumen',
        sheet: 'Resumen',
      };
      let updatedStepsOrdenados = [...stepsOrdenados, FinalizarStep];

      //le agrego un paso de comentarios al final
      const ComentariosStep = {
        idSheet: 'comentarios',
        sheet: 'Comentarios',
      };
      updatedStepsOrdenados = [...updatedStepsOrdenados, ComentariosStep];

      setSteps(updatedStepsOrdenados);
      //console.log('steps:', updatedStepsOrdenados);

      var rowsResponse = response.data.values_SinIdSheet
      setDataRows(rowsResponse);

      //reseteo las fields, para despues volver a setearlas ya que como se utiliza ...prevFields, se acumulan
      setFields([]);
      //console.log('fields:', fields);

      if (updatedStepsOrdenados.length > 0) {
        updatedStepsOrdenados.forEach((step, index) => {
          if (step.fields) {
            let sortedFields = step.fields.sort((a, b) => a.step - b.step);
            if (!sortedFields.some(field => field.name === 'id')) {
              sortedFields.push({ name: "id" });
            }
            setFields(prevFields => Array.isArray(prevFields) ? [...prevFields, ...sortedFields] : sortedFields);
          }
        });
      }

      const comentarios = response.data.comentarios;
      setDataComentarios(comentarios);

      const responseDaily = await axios.get(`${BASE_URL}/getDaily/${daily_id}`)
      var Daily_info = responseDaily.data;

      setDailyInfo(Daily_info);

      const responseAcciones = await axios.get(`${BASE_URL}/dailyAcciones/${daily_id}`);
      //console.log('responseAcciones:', responseAcciones.data);
      setAcciones(responseAcciones.data);



    } catch (error) {
      console.error('Error al obtener pasos y campos:', error);
    }
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? activeStep + 0
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {

    setActiveStep(step);
  };

  const formContent = (step) => {
    if (steps.length === 0) {
      return <h2>Cargando...</h2>
    }

    if (steps[step].idSheet === 'resumen') {
      return <TableResumen data={steps} idDaily={daily_id} contract_id={contract_id} />;
    } else if (steps[step].idSheet === 'comentarios') {
      return <TableComentarios data={steps} idDaily={daily_id} contract_id={contract_id} />;

    } else {
      return <TableEECC data={steps[step]} idDaily={daily_id} contract_id={contract_id} />;
    }

  };

  const formatDate = (date) => {
    const timeZone = 'America/Santiago'; // Zona horaria de Chile
    return moment.tz(date, timeZone).format('DD/MM/YYYY');
  };

  const formatDateTime = (date) => {
    const timeZone = 'America/Santiago'; // Zona horaria de Chile
    return moment.tz(date, timeZone).format('DD/MM/YYYY HH:mm');
  };


  const handleExportPDF = (tables) => {

    const doc = new jsPDF();

    const datedaily = dailyInfo.date ? formatDate(dailyInfo.date) : '';


    // Agregar un título principal
    doc.setFontSize(18);
    doc.text(`Daily Report: ${datedaily}`, 14, 20);

    tables.forEach((table, index) => {

      let tableData = table.getPrePaginationRowModel().rows.map((row) => Object.values(row.original));
      // Eliminar el primer parámetro de tableData (que es un id, que no es parte de los datos de la tabla)
      tableData = tableData.map(row => row.slice(1));
      const tableHeaders = table.getAllColumns().map((c) => c.columnDef.header);

      // Agregar un título para cada tabla
      doc.setFontSize(14);
      // Agregar un título para cada tabla
      if (index === 0) {
        doc.text('Tabla Personal', 14, 30 + (index * 10));
      } else if (index === 1) {
        doc.text('Tabla Maquinarias', 14, 30 + (index * 10));
      } else if (index === 2) {
        doc.text('Tabla Interferencias', 14, 30 + (index * 10));
      } else if (index === 3) {
        doc.text('Tabla Avances', 14, 30 + (index * 10));
      } else if (index === 4) {
        //en caso que sea tabla comentarios creo un nuevo array con los datos que quiero mostrar
        let dataComentariosVar = dataComentarios.map((row) => {
          return {
            revision: row.revision,
            user_name: row.user_name,
            role_name: row.role_name,
            comentario_codelco: row.comentario_codelco,
            comentario_eecc: row.comentario_eecc,
          };
        });
        tableData = dataComentariosVar.map((row) => Object.values(row));
        doc.text('Tabla Comentarios', 14, 30 + (index * 10));
      }

      autoTable(doc, {
        head: [tableHeaders],
        body: tableData,
        startY: 40 + (index * 10),
      });

      if (index < tables.length - 1) {
        doc.addPage();
      }
    });

    // crear hoja de acciones
    doc.addPage();
    doc.setFontSize(14);
    doc.text('Acciones', 14, 20);
   
    const tableHeadersAcciones= ['Fecha', 'Revisión', 'Acción', 'Usuario',  'Rol Usuario'];


    const tableDataAcciones = acciones.map(item => [
      formatDateTime(item.created_at),
      item.revision,
      item.accion,
      item.user_name,
      item.role_name
    ]);
    console.log('tableDataAcciones:', tableDataAcciones);

    autoTable(doc, {
      head: [tableHeadersAcciones],
      body: tableDataAcciones,
      startY: 40 ,
    });

    doc.save('multiple-tables.pdf');

  };

  /// Comienza Crear Tablas para exportar a PDF

  const getTablePersonal = (steps, dataRows, fields) => {
    const StepPersonal = useMemo(() => steps.filter(step => step.sheet === 'Personal'), [steps]);
    const idSheetPersonal = StepPersonal[0] ? StepPersonal[0].idSheet : '';
    const dataPersonal = useMemo(() => dataRows[idSheetPersonal] || [], [dataRows, idSheetPersonal]);
    const columnsPersonal = useMemo(() => {
      const filteredFields = fields.filter(field => field.daily_sheet_id === idSheetPersonal);
      return filteredFields.length > 0 ? filteredFields.map(field => ({
        header: field.name,
        accessor: `${field.name}-${idSheetPersonal}`,
        accesorFn: `${field.name}-${idSheetPersonal}`,
        id: field.name,
      })) : [];
    }, [fields, idSheetPersonal]);
    const tablePersonal = useMaterialReactTable({ data: dataPersonal, columns: columnsPersonal });

    return tablePersonal;
  };
  const tablePersonal = getTablePersonal(steps, dataRows, fields);

  const getTableMaquinarias = (steps, dataRows, fields) => {
    const StepMaquinarias = useMemo(() => steps.filter(step => step.sheet === 'Maquinarias'), [steps]);
    const idSheetMaquinarias = StepMaquinarias[0] ? StepMaquinarias[0].idSheet : '';
    const dataMaquinarias = useMemo(() => dataRows[idSheetMaquinarias] || [], [dataRows, idSheetMaquinarias]);
    const columnsMaquinarias = useMemo(() => {
      const filteredFields = fields.filter(field => field.daily_sheet_id === idSheetMaquinarias);
      return filteredFields.length > 0 ? filteredFields.map(field => ({
        header: field.name,
        accessor: `${field.name}-${idSheetMaquinarias}`,
        id: field.name,
      })) : [];
    }, [fields, idSheetMaquinarias]);
    const tableMaquinarias = useMaterialReactTable({ data: dataMaquinarias, columns: columnsMaquinarias });

    return tableMaquinarias;
  };
  const tableMaquinarias = getTableMaquinarias(steps, dataRows, fields);

  const getTableInterferencias = (steps, dataRows, fields) => {
    const stepInterferencias = useMemo(() => steps.filter(step => step.sheet === 'Interferencias'), [steps]);
    const idSheetInterferencias = stepInterferencias[0] ? stepInterferencias[0].idSheet : '';
    const dataInterferencias = useMemo(() => dataRows[idSheetInterferencias] || [], [dataRows, idSheetInterferencias]);
    const columnsInterferencias = useMemo(() => {
      const filteredFields = fields.filter(field => field.daily_sheet_id === idSheetInterferencias);
      return filteredFields.length > 0 ? filteredFields.map(field => ({
        header: field.name,
        accessor: `${field.name}-${idSheetInterferencias}`,
        id: field.name,
      })) : [];
    }, [fields, idSheetInterferencias]);
    const tableInterferencias = useMaterialReactTable({ data: dataInterferencias, columns: columnsInterferencias });

    return tableInterferencias;
  };
  const tableInterferencias = getTableInterferencias(steps, dataRows, fields);

  const getTableAvances = (steps, dataRows, fields) => {
    const stepAvances = useMemo(() => steps.filter(step => step.sheet === 'Avances'), [steps]);
    const idSheetAvances = stepAvances[0] ? stepAvances[0].idSheet : '';
    const dataAvances = useMemo(() => dataRows[idSheetAvances] || [], [dataRows, idSheetAvances]);
    const columnsAvances = useMemo(() => {
      const filteredFields = fields.filter(field => field.daily_sheet_id === idSheetAvances);
      return filteredFields.length > 0 ? filteredFields.map(field => ({
        header: field.name,
        accessor: `${field.name}-${idSheetAvances}`,
        id: field.name,
      })) : [];
    }, [fields, idSheetAvances]);
    const tableAvances = useMaterialReactTable({ data: dataAvances, columns: columnsAvances });

    return tableAvances;
  };
  const tableAvances = getTableAvances(steps, dataRows, fields);

  const dataComentariosTable = useMemo(() => dataComentarios || [], [dataComentarios]);
  const columnsComentarios = useMemo(() => [
    { header: 'Revision', accessor: 'revision', id: 'Revision' },
    { header: 'Nombre Revisor', accessor: 'user_name', id: 'Nombre Revisor' },
    { header: 'Rol Revisor', accessor: 'role_name', id: 'Rol Revisor' },
    { header: 'Comentario Codelco', accessor: 'comentario_codelco', id: 'Comentario Codelco' },
    { header: 'Respuesta EECC', accessor: 'comentario_eecc', id: 'Respuesta EECC' },
  ]
    , [dataComentarios]);
  const tableComentarios = useMaterialReactTable({ data: dataComentariosTable, columns: columnsComentarios });

  //// TERMINA CREAR TABLAS

  const datedaily = dailyInfo.date ? formatDate(dailyInfo.date) : '';

  return (
    <Box sx={{ width: '90%', margin: '0 auto', mt: '1rem' }}>
      <h2 style={{ textAlign: 'center' }}>Visualizar Daily: {datedaily}</h2>
      <Box component="form" sx={{ width: '95%', margin: '0 auto', mt: '2rem' }}>

        <Tooltip title="Exportar Daily Report" sx={{ m: '0.5rem' }}>
          <Button
            id="aprobarButton"
            startIcon={<FileDownloadIcon />}
            style={{ backgroundColor: 'rgb(0 125 151)' }}
            variant="contained"
            onClick={() => {

              handleExportPDF([tablePersonal, tableMaquinarias, tableInterferencias, tableAvances, tableComentarios]);

            }}
          >
            Exportar Daily Report
          </Button>
        </Tooltip>

        <Box sx={{ width: '100%', mt: '1.5rem' }}>
          <Stepper nonLinear activeStep={activeStep} >
            {steps.map((label, index) => (
              <Step key={label.idSheet} completed={completed[index]}>
                <StepButton color="inherit" onClick={handleStep(index)}>
                  {label.sheet}
                </StepButton>
              </Step>
            ))}
          </Stepper>
          <div>
            <React.Fragment>
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Button
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />
                <Button onClick={handleNext} disabled={isLastStep()} sx={{ mr: 1 }}>
                  Next
                </Button>

              </Box>
              <Grid item xs={12} sx={{ padding: '20px' }}>
                {formContent(activeStep)}
              </Grid>

            </React.Fragment>

          </div>
        </Box>
      </Box>
    </Box>
  );
}

export default IngresarDaily;