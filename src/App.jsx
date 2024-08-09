import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import axios from 'axios'
import './App.css'
import Home from "./Components/Home"
import Header from "./Components/layouts/Header"
import Register from "./Components/auth/Register"
import { getConfig, BASE_URL } from "./helpers/config"
import { AuthContext } from "./Components/context/authContext"
import { useEffect, useState } from "react"
import Login from "./Components/auth/Login"
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute"
import ContractFormPage from "./pages/Configurar/ContractCUPage"
import ContractsPage from "./pages/Configurar/ContractsPage"
import UserPage from "./pages/Configurar/UsersPage"
import UserFormPage from "./pages/Configurar/UserCUPage"
import ContractFormato from "./pages/Configurar/ContractEstructuraPage"
import EECCDailys from "./pages/EECC/EECCListaDailysPage"
import EECCIngresarDaily from "./pages/EECC/EECCIngresarDailyPage"
import EECCContracts from "./pages/EECC/EECCContractsPage"
import EECCdailyEnviado from "./pages/EECC/EECCDailyEnviado"
import EECCverDaily from "./pages/EECC/EECCVerDailyPage"
import RevContracts from "./pages/Revisor/RevContractsPage"
import RevRolesSelect from "./pages/Revisor/RevRolesSelectPage"
import RevListaDailys  from "./pages/Revisor/RevListaDailysPage"
import RevRevisarDaily  from "./pages/Revisor/RevRevisarDailyPage"
import RevDailyRevisado  from "./pages/Revisor/RevDailyRevisadoPage"
import AproContracts from "./pages/Aprobador/AproContractsPage"
import AproListaDailys from "./pages/Aprobador/AproListaDailysPage"
import AproAprobarDaily  from "./pages/Aprobador/AproAprobarDailyPage"
import AproDailyAproRech  from "./pages/Aprobador/AproDailyAproRechPage"
import VisContracts from "./pages/Visualizar/VisContractsPage"
import VisListaDailys from "./pages/Visualizar/VisListaDailysPage"
import VisVerDaily from "./pages/Visualizar/VisVerDailyPage"
import AvListaContracts from "./pages/Programa/Avance/AvListaContractsPage"
import AvPrograma from "./pages/Programa/Avance/AvProgramaPage"
import AvItems from "./pages/Programa/Avance/AvItemsPage"
import DotListaContracts from "./pages/Programa/DotEquipo/DotListaContractsPage"
import DotPrograma from "./pages/Programa/DotEquipo/DotProgramaPage"

















function App() {
    const [accessToken, setAccessToken] = useState(JSON.parse(localStorage.getItem('currentToken')))
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('currentUser')))

    useEffect(() => {
        const fetchCurrentlyLoggedInUser = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/user`, getConfig(accessToken))
                setCurrentUser(response.data.user)
                localStorage.setItem('currentUser', JSON.stringify(response.data.user))
            } catch (error) {
                if (error?.response?.status === 401) {
                    localStorage.removeItem('currentToken')
                    localStorage.removeItem('currentUser')
                    setCurrentUser(null)
                    setAccessToken('')
                }
                console.log(error)
            }
        }
        if (accessToken) fetchCurrentlyLoggedInUser()
    }, [accessToken])

    return (
        <AuthContext.Provider value={{ accessToken, setAccessToken, currentUser, setCurrentUser }}>
            <BrowserRouter>
                {currentUser && <Header />}
                <Routes>
                    <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<ProtectedRoute><Register /></ProtectedRoute>} />
                    <Route path="/contracts" element={<ProtectedRoute><ContractsPage /></ProtectedRoute>} />
                    <Route path="/contracts/create" element={<ProtectedRoute><ContractFormPage /></ProtectedRoute>} />
                    <Route path="/contracts/formato/:id" element={<ProtectedRoute><ContractFormato /></ProtectedRoute>} />
                    <Route path="/contracts/edit/:id" element={<ProtectedRoute><ContractFormPage /></ProtectedRoute>} />
                    <Route path="/users/create" element={<ProtectedRoute><UserFormPage /></ProtectedRoute>} />
                    <Route path="/users/edit/:id" element={<ProtectedRoute><UserFormPage /></ProtectedRoute>} />
                    <Route path="/users" element={<ProtectedRoute><UserPage /></ProtectedRoute>} />
                    <Route path="/EECCDailys/:id" element={<ProtectedRoute><EECCDailys /></ProtectedRoute>} />
                    <Route path="/EECCDailys/edit/:id/:contract_id" element={<ProtectedRoute><EECCIngresarDaily /></ProtectedRoute>} />  
                    <Route path="/EECCContracts/" element={<ProtectedRoute><EECCContracts/></ProtectedRoute>} />    
                    <Route path="/EECCdailyEnviado/:daily_id/:contract_id/:state_id" element={<ProtectedRoute><EECCdailyEnviado/></ProtectedRoute>} />    
                    <Route path="/EECCverDaily/:daily_id/:contract_id" element={<ProtectedRoute><EECCverDaily/></ProtectedRoute>} />
                    <Route path="/RevContracts/" element={<ProtectedRoute><RevContracts/></ProtectedRoute>} />
                    <Route path="/RevRolesSelect/:contract_id" element={<ProtectedRoute><RevRolesSelect/></ProtectedRoute>} />
                    <Route path="/RevListaDailys/:id_rol/:contract_id" element={<ProtectedRoute><RevListaDailys/></ProtectedRoute>} />
                    <Route path="/RevRevisarDaily/:id/:contract_id/:role_id" element={<ProtectedRoute><RevRevisarDaily/></ProtectedRoute>} />
                    <Route path="/RevDailyRevisado/:daily_id/:contract_id/:state_id/:nombre_area" element={<ProtectedRoute><RevDailyRevisado/></ProtectedRoute>} />    
                    <Route path="/AproContracts/" element={<ProtectedRoute><AproContracts/></ProtectedRoute>} />
                    <Route path="/AproListaDailys/:contract_id" element={<ProtectedRoute><AproListaDailys/></ProtectedRoute>} />
                    <Route path="/AproAprobarDaily/:id/:contract_id" element={<ProtectedRoute><AproAprobarDaily/></ProtectedRoute>} />
                    <Route path="/AproDailyAproRech/:daily_id/:contract_id/:respuesta/" element={<ProtectedRoute><AproDailyAproRech/></ProtectedRoute>} />    
                    <Route path="/VisContracts/" element={<ProtectedRoute><VisContracts/></ProtectedRoute>} />    
                    <Route path="/VisListaDailys/:id" element={<ProtectedRoute><VisListaDailys /></ProtectedRoute>} />
                    <Route path="/VisVerDaily/:daily_id/:contract_id" element={<ProtectedRoute><VisVerDaily/></ProtectedRoute>} />
                    <Route path="/AvListaContracts/" element={<ProtectedRoute><AvListaContracts/></ProtectedRoute>} />   
                    <Route path="/AvPrograma/:contract_id" element={<ProtectedRoute><AvPrograma /></ProtectedRoute>} />
                    <Route path="/AvItems/:contract_id" element={<ProtectedRoute><AvItems /></ProtectedRoute>} />
                    <Route path="/DotListaContracts/" element={<ProtectedRoute><DotListaContracts/></ProtectedRoute>} />   
                    <Route path="/DotPrograma/:contract_id" element={<ProtectedRoute><DotPrograma /></ProtectedRoute>} />

 


                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </BrowserRouter>
        </AuthContext.Provider>
    )
}

export default App
