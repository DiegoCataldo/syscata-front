import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { BASE_URL } from '../../helpers/config'
import useValidation from '../custom/useValidation'
import Spinner from '../layouts/Spinner'
import { AuthContext } from '../context/authContext'
import './Login.css'
import { Container, Typography, TextField, Button, Paper, Box } from '@mui/material'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState(null)
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const { accessToken, setAccessToken, setCurrentUser, currentUser } = useContext(AuthContext)

    useEffect(() => {
        if (accessToken && currentUser?.role_id != null ) navigate('/homeDTS')
    }, [accessToken])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrors(null)
        setLoading(true)
        const data = { email, password }

        try {
            const response = await axios.post(`${BASE_URL}/user/login`, data)
            if (response.data.error) {
                setLoading(false)
                toast.error(response.data.error)
            } else {
                localStorage.setItem('currentToken', JSON.stringify(response.data.currentToken))
                localStorage.setItem('currentUser', JSON.stringify(response.data.user))
                setAccessToken(response.data.currentToken)
                setCurrentUser(response.data.user)
                setLoading(false)
                setEmail('')
                setPassword('')
                toast.success(response.data.message)
                navigate('/SRContracts')
            }
        } catch (error) {
            setLoading(false)
            if (error?.response?.status === 422) {
                setErrors(error.response.data.errors)
            }
            console.log(error)
        }
    }

    return (
        <Container maxWidth="xs">
            <Paper elevation={3} sx={{ padding: 2, marginTop: 8 }}>
                <Box sx={{ textAlign: 'center', marginBottom: 2 }}>
                    <Typography variant="h5" component="h1">
                        Iniciar sesión
                    </Typography>
                </Box>
                <form onSubmit={handleSubmit}>
                    <TextField
                        margin="normal"
                        fullWidth
                        id="email"
                        label="Correo electrónico"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {useValidation(errors, 'email')}
                    <TextField
                        margin="normal"
                        fullWidth
                        id="password"
                        label="Contraseña"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {useValidation(errors, 'password')}
                    {
                        loading ?
                            <Spinner />
                            :
                            <div className="wrap">
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    Iniciar sesión
                                </Button>
                            </div>
                    }
                </form>
            </Paper>
        </Container>
    );
}
