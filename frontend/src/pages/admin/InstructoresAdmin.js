"use client"

import { useState, useEffect } from "react"
import instructorService from "../../services/instructorService"

const InstructoresAdmin = () => {
  const [instructores, setInstructores] = useState([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState("")
  const [modalEditar, setModalEditar] = useState(false)
  const [instructorEditar, setInstructorEditar] = useState(null)
  const [formData, setFormData] = useState({})
  const [error, setError] = useState("")

  useEffect(() => {
    cargarInstructores()
  }, [])

  const cargarInstructores = async () => {
    setLoading(true)
    const result = await instructorService.getInstructores(busqueda)
    if (result.success) {
      setInstructores(result.data)
    }
    setLoading(false)
  }

  const handleBuscar = () => {
    cargarInstructores()
  }

  const handleEditar = (instructor) => {
    setInstructorEditar(instructor)
    setFormData({
      username: instructor.username || "",
      nombre_completo: instructor.nombre_completo,
      especialidad: instructor.especialidad,
      estado: instructor.estado,
    })
    setModalEditar(true)
    setError("")
  }

  const handleGuardar = async () => {
    if (!instructorEditar) return

    const result = await instructorService.patchInstructor(instructorEditar.id, formData)
    if (result.success) {
      setModalEditar(false)
      cargarInstructores()
    } else {
      setError("Error al actualizar instructor")
    }
  }

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este instructor?")) return

    const result = await instructorService.deleteInstructor(id)
    if (result.success) {
      cargarInstructores()
    } else {
      alert("Error al eliminar instructor")
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  if (loading) {
    return <div className="loading-state">Cargando instructores...</div>
  }

  return (
    <div>
      <div className="admin-header">
        <h1 className="admin-title">Gestión de Instructores</h1>
        <p className="admin-subtitle">Administra los instructores del sistema</p>
      </div>

      <div className="admin-actions">
        <div className="search-box">
          <input
            type="text"
            className="search-input"
            placeholder="Buscar instructores por nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleBuscar()}
          />
        </div>
        <button className="btn btn-primary" onClick={handleBuscar}>
          Buscar
        </button>
      </div>

      {instructores.length === 0 ? (
        <div className="empty-state">
          <p>No se encontraron instructores</p>
        </div>
      ) : (
        <div className="items-list">
          {instructores.map((instructor) => (
            <div key={instructor.id} className="item-row">
              <div className="item-info">
                <div className="item-name">
                  #{instructor.id} - {instructor.nombre_completo}
                </div>
                <div className="item-details">
                  Especialidad: {instructor.especialidad} | Estado: {instructor.estado}
                  {" | Email: "}
                  {instructor.email}
                </div>
              </div>
              <div className="item-actions">
                <button className="btn btn-outline btn-small" onClick={() => handleEditar(instructor)}>
                  Editar
                </button>
                <button className="btn btn-danger btn-small" onClick={() => handleEliminar(instructor.id)}>
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
              <h2 className="modal-title">Editar Instructor</h2>
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
                <label className="form-label">Especialidad</label>
                <select
                  name="especialidad"
                  className="form-select"
                  value={formData.especialidad}
                  onChange={handleChange}
                >
                  <option value="">Seleccionar...</option>
                  <option value="Teclado">Teclado</option>
                  <option value="Guitarra">Guitarra</option>
                  <option value="Bateria">Batería</option>
                  <option value="Violin">Violín</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Estado</label>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <button
                    type="button"
                    className={`btn ${formData.estado === "Activo" ? "btn-primary" : "btn-outline"}`}
                    onClick={() => setFormData({ ...formData, estado: "Activo" })}
                    style={{ flex: 1 }}
                  >
                    Activo
                  </button>
                  <button
                    type="button"
                    className={`btn ${formData.estado === "Inactivo" ? "btn-danger" : "btn-outline"}`}
                    onClick={() => setFormData({ ...formData, estado: "Inactivo" })}
                    style={{ flex: 1 }}
                  >
                    Inactivo
                  </button>
                </div>
              </div>

              {instructorEditar?.fecha_ingreso && (
                <div className="form-group">
                  <label className="form-label">Fecha de Ingreso</label>
                  <input
                    type="text"
                    className="form-input"
                    value={new Date(instructorEditar.fecha_ingreso).toLocaleDateString("es-MX")}
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

export default InstructoresAdmin
