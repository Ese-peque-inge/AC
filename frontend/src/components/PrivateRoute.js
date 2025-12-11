"use client"
import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const PrivateRoute = ({ children, requiredRole }) => {
  const { user, loading, isAuthenticated } = useAuth()

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div>Cargando...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user?.rol !== requiredRole) {
    // Redirigir al dashboard correspondiente según el rol
    const redirectPath =
      user?.rol === "Administrador" ? "/admin" : user?.rol === "Instructor" ? "/instructor" : "/alumno"
    return <Navigate to={redirectPath} replace />
  }

  return children
}

export default PrivateRoute
