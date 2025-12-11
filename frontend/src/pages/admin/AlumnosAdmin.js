"use client"

import { useState, useEffect } from "react"
import alumnoService from "../../services/alumnoService"

const AlumnosAdmin = () => {
  const [alumnos, setAlumnos] = useState([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState("")
  const [modalEditar, setModalEditar] = useState(false)
  const [alumnoEditar, setAlumnoEditar] = useState(null)
  const [formData, setFormData] = useState({})
  const [error, setError] = useState("")

  useEffect(() => {
    cargarAlumnos()
  }, [])

  const cargarAlumnos = async () => {
    setLoading(true)
    const result = await alumnoService.getAlumnos(busqueda)
    if (result.success) {
      setAlumnos(result.data)
    }
    setLoading(false)
  }

  const handleBuscar = () => {
    cargarAlumnos()
  }

  const handleEditar = (alumno) => {
    setAlumnoEditar(alumno)
    setFormData({
      username: alumno.username || "",
      email: alumno.email || "",
      nombre_completo: alumno.nombre_completo,
      telefono: alumno.telefono || "",
      direccion: alumno.direccion || "",
      tipo_documento: alumno.tipo_documento || "",
      numero_documento: alumno.numero_documento || "",
    })
    setModalEditar(true)
    setError("")
  }

  const handleGuardar = async () => {
    if (!alumnoEditar) return

    const result = await alumnoService.patchAlumno(alumnoEditar.id, formData)
    if (result.success) {
      setModalEditar(false)
      cargarAlumnos()
    } else {
      setError("Error al actualizar alumno")
    }
  }

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este alumno?")) return

    const result = await alumnoService.deleteAlumno(id)
    if (result.success) {
      cargarAlumnos()
    } else {
      alert("Error al eliminar alumno")
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  if (loading) {
    return <div className="loading-state">Cargando alumnos...</div>
  }

  return (
    <div>
      <div className="admin-header">
        <h1 className="admin-title">Gestión de Alumnos</h1>
        <p className="admin-subtitle">Administra los alumnos registrados en el sistema</p>
      </div>

      <div className="admin-actions">
        <div className="search-box">
          <input
            type="text"
            className="search-input"
            placeholder="Buscar alumnos por nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleBuscar()}
          />
        </div>
        <button className="btn btn-primary" onClick={handleBuscar}>
          Buscar
        </button>
      </div>

      {alumnos.length === 0 ? (
        <div className="empty-state">
          <p>No se encontraron alumnos</p>
        </div>
      ) : (
        <div className="items-list">
          {alumnos.map((alumno) => (
            <div key={alumno.id} className="item-row">
              <div className="item-info">
                <div className="item-name">
                  #{alumno.id} - {alumno.nombre_completo}
                </div>
                <div className="item-details">
                  Email: {alumno.email} | Usuario: {alumno.username}
                  {alumno.telefono && ` | Tel: ${alumno.telefono}`}
                </div>
              </div>
              <div className="item-actions">
                <button className="btn btn-outline btn-small" onClick={() => handleEditar(alumno)}>
                  Editar
                </button>
                <button className="btn btn-danger btn-small" onClick={() => handleEliminar(alumno.id)}>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Editar */}
      {modalEditar && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">Editar Alumno</h2>
              <button className="modal-close" onClick={() => setModalEditar(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              {error && <div className="error-text">{error}</div>}

              <div className="form-group">
                <label className="form-label">Usuario</label>
                <input
                  type="text"
                  name="username"
                  className="form-input"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleChange}
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
                />
              </div>

              <div className="form-group">
                <label className="form-label">Teléfono</label>
                <input
                  type="tel"
                  name="telefono"
                  className="form-input"
                  value={formData.telefono}
                  onChange={handleChange}
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
                />
              </div>

              {alumnoEditar?.fecha_registro && (
                <div className="form-group">
                  <label className="form-label">Fecha de Registro</label>
                  <input
                    type="text"
                    className="form-input"
                    value={new Date(alumnoEditar.fecha_registro).toLocaleDateString("es-MX")}
                    disabled
                    style={{ backgroundColor: "#f5f5f5", cursor: "not-allowed" }}
                  />
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModalEditar(false)}>
                Cancelar
              </button>
              <button className="btn btn-primary" onClick={handleGuardar}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AlumnosAdmin
