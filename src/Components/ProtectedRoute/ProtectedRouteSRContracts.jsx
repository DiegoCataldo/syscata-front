import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/authContext'

const ProtectedRouteSRContracts = ({ children }) => {
  const { currentUser } = useContext(AuthContext)

  const role = currentUser?.role_id;
//la diferencia con protectedroute es que aca no se valida el rol, solo si esta logueado, si no lo esta lo redirige al login, en cambio en protectedroute se valida el rol
  if (!currentUser  ) {
    return <Navigate to="/login" />
  }

  

  

  return children
}

export default ProtectedRouteSRContracts
