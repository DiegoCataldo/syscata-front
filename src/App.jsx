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
import EECCDailys from "./pages/EECC/EECCDailysPage"
import EECCIngresarDaily from "./pages/EECC/EECCIngresarDailyPage"
import EECCContracts from "./pages/EECC/EECCContractsPage"
import EECCdailyEnviado from "./pages/EECC/EECCDailyEnviado"
import EECCverDaily from "./pages/EECC/EECCVerDailyPage"
import RevContracts from "./pages/Revisor/RevContractsPage"
import RevRolesSelect from "./pages/Revisor/RevRolesSelectPage"
import RevDailys  from "./pages/Revisor/RevDailysPage"
import RevRevisarDaily  from "./pages/Revisor/RevRevisarDailyPage"








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
                    <Route path="/RevDailys/:id_rol/:contract_id" element={<ProtectedRoute><RevDailys/></ProtectedRoute>} />
                    <Route path="/RevRevisarDaily/:id/:contract_id" element={<ProtectedRoute><RevRevisarDaily/></ProtectedRoute>} />




                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </BrowserRouter>
        </AuthContext.Provider>
    )
}

export default App
