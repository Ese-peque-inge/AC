"use client"

import { createContext, useState, useContext, useEffect } from "react"
import authService from "../services/authService"

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Cargar usuario al iniciar
    const currentUser = authService.getCurrentUser()
    setUser(currentUser)
    setLoading(false)
  }, [])

  const login = async (username, password) => {
    const result = await authService.login(username, password)
    if (result.success) {
      setUser(result.usuario)
    }
    return result
  }

  const registroAlumno = async (data) => {
    const result = await authService.registroAlumno(data)
    if (result.success) {
      setUser(result.usuario)
    }
    return result
  }

  const registroInstructor = async (data) => {
    const result = await authService.registroInstructor(data)
    if (result.success) {
      setUser(result.usuario)
    }
    return result
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  const value = {
    user,
    loading,
    login,
    registroAlumno,
    registroInstructor,
    logout,
    isAuthenticated: authService.isAuthenticated(),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider")
  }
  return context
}
