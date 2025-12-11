"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import "./AuthPage.css"

const RegistroPage = () => {
  const [tipoCuenta, setTipoCuenta] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    nombre_completo: "",
    // Campos de alumno
    telefono: "",
    direccion: "",
    tipo_documento: "",
    numero_documento: "",
    // Campos de instructor
    especialidad: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { registroAlumno, registroInstructor } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const dataToSend = {
      ...formData,
      rol: tipoCuenta.toLowerCase(), // "alumno" o "instructor"
    }

    let result
    if (tipoCuenta === "Alumno") {
      result = await registroAlumno(dataToSend)
    } else if (tipoCuenta === "Instructor") {
      result = await registroInstructor(dataToSend)
    }

    if (result?.success) {
      // Redirigir según el rol
      if (tipoCuenta === "Instructor") {
        navigate("/instructor")
      } else {
        navigate("/alumno")
      }
    } else {
      const errorMsg =
        typeof result?.error === "object"
          ? Object.values(result.error).flat().join(", ")
          : result?.error || "Error al registrar"
      setError(errorMsg)
    }

    setLoading(false)
  }

  if (!tipoCuenta) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-header">
            <h1 className="auth-title">Crear Cuenta</h1>
            <p className="auth-subtitle">Selecciona el tipo de cuenta que deseas crear</p>
          </div>

          <div className="tipo-cuenta-selector">
            <div className="tipo-cuenta-card" onClick={() => setTipoCuenta("Alumno")}>
              <div className="tipo-cuenta-icon">🎓</div>
              <div className="tipo-cuenta-label">Alumno</div>
            </div>

            <div className="tipo-cuenta-card" onClick={() => setTipoCuenta("Instructor")}>
              <div className="tipo-cuenta-icon">👨‍🏫</div>
              <div className="tipo-cuenta-label">Instructor</div>
            </div>
          </div>

          <div className="auth-footer">
            <p>
              ¿Ya tienes cuenta?{" "}
              <Link to="/login" className="auth-link">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1 className="auth-title">Registro de {tipoCuenta}</h1>
          <p className="auth-subtitle">Completa tus datos para crear tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label className="form-label">Correo Electrónico</label>
            <input
              type="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="tu@email.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Nombre de Usuario</label>
            <input
              type="text"
              name="username"
              className="form-input"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="usuario123"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Nombre Completo</label>
            <input
              type="text"
              name="nombre_completo"
              className="form-input"
              value={formData.nombre_completo}
              onChange={handleChange}
              required
              placeholder="Juan Pérez"
            />
          </div>

          {tipoCuenta === "Alumno" && (
            <>
              <div className="form-group">
                <label className="form-label">Teléfono</label>
                <input
                  type="tel"
                  name="telefono"
                  className="form-input"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="1234567890"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Dirección</label>
                <input
                  type="text"
                  name="direccion"
                  className="form-input"
                  value={formData.direccion}
                  onChange={handleChange}
                  placeholder="Calle 123, Colonia..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tipo de Documento</label>
                <select
                  name="tipo_documento"
                  className="form-select"
                  value={formData.tipo_documento}
                  onChange={handleChange}
                >
                  <option value="">Seleccionar...</option>
                  <option value="DNI">DNI</option>
                  <option value="Pasaporte">Pasaporte</option>
                  <option value="Cédula">Cédula</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Número de Documento</label>
                <input
                  type="text"
                  name="numero_documento"
                  className="form-input"
                  value={formData.numero_documento}
                  onChange={handleChange}
                  placeholder="12345678"
                />
              </div>
            </>
          )}

          {tipoCuenta === "Instructor" && (
            <div className="form-group">
              <label className="form-label">Especialidad</label>
              <select
                name="especialidad"
                className="form-select"
                value={formData.especialidad}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar...</option>
                <option value="Teclado">Teclado</option>
                <option value="Guitarra">Guitarra</option>
                <option value="Bateria">Batería</option>
                <option value="Violin">Violín</option>
              </select>
            </div>
          )}

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Registrando..." : "Crear Cuenta"}
          </button>

          <button
            type="button"
            className="auth-button"
            style={{ backgroundColor: "#6b7280" }}
            onClick={() => setTipoCuenta("")}
          >
            Volver
          </button>
        </form>

        <div className="auth-footer">
          <p>
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="auth-link">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegistroPage
