import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import PrivateRoute from "./components/PrivateRoute"

// Páginas públicas
import LandingPage from "./pages/public/LandingPage"
import LoginPage from "./pages/auth/LoginPage"
import RegistroPage from "./pages/auth/RegistroPage"

// Dashboards
import AdminDashboard from "./pages/admin/AdminDashboard"
import InstructorDashboard from "./pages/instructor/InstructorDashboard"
import AlumnoDashboard from "./pages/alumno/AlumnoDashboard"

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegistroPage />} />

          {/* Rutas protegidas - Administrador */}
          <Route
            path="/admin/*"
            element={
              <PrivateRoute requiredRole="Administrador">
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          {/* Rutas protegidas - Instructor */}
          <Route
            path="/instructor/*"
            element={
              <PrivateRoute requiredRole="Instructor">
                <InstructorDashboard />
              </PrivateRoute>
            }
          />

          {/* Rutas protegidas - Alumno */}
          <Route
            path="/alumno/*"
            element={
              <PrivateRoute requiredRole="Alumno">
                <AlumnoDashboard />
              </PrivateRoute>
            }
          />

          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
