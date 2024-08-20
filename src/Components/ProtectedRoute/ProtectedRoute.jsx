import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/authContext'

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useContext(AuthContext)

  const role = currentUser?.role_id;

  if (!currentUser  ) {
    return <Navigate to="/login" />
  }
  if(!currentUser.role_id){
    return <Navigate to="/SRContracts" />
  }
  

  

  return children
}

export default ProtectedRoute
