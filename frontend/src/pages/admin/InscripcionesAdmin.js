"use client"

import { useState, useEffect } from "react"
import inscripcionService from "../../services/inscripcionService"
import alumnoService from "../../services/alumnoService"
import instructorService from "../../services/instructorService"
import adminCursoService from "../../services/adminCursoService"

const InscripcionesAdmin = () => {
  const [inscripciones, setInscripciones] = useState([])
  const [alumnos, setAlumnos] = useState([])
  const [cursos, setCursos] = useState([])
  const [instructores, setInstructores] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalCrear, setModalCrear] = useState(false)
  const [formData, setFormData] = useState({})
  const [error, setError] = useState("")

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    setLoading(true)
    const [inscripcionesRes, alumnosRes, cursosRes, instructoresRes] = await Promise.all([
      inscripcionService.getInscripciones(),
      alumnoService.getAlumnos(),
      adminCursoService.getCursos(),
      instructorService.getInstructoresActivos(),
    ])

    if (inscripcionesRes.success) setInscripciones(inscripcionesRes.data)
    if (alumnosRes.success) setAlumnos(alumnosRes.data)
    if (cursosRes.success) setCursos(cursosRes.data)
    if (instructoresRes.success) setInstructores(instructoresRes.data)

    setLoading(false)
  }

  const handleCrear = () => {
    setFormData({
      alumno: "",
      curso: "",
      instructor: "",
      metodo_pago: "Efectivo",
      estado_inscripcion: "Activa",
      total_pago: "",
    })
    setModalCrear(true)
    setError("")
  }

  const handleGuardarCrear = async () => {
    const result = await inscripcionService.createInscripcion(formData)
    if (result.success) {
      setModalCrear(false)
      cargarDatos()
    } else {
      setError("Error al crear inscripción")
    }
  }

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta inscripción?")) return

    const result = await inscripcionService.deleteInscripcion(id)
    if (result.success) {
      cargarDatos()
    } else {
      alert("Error al eliminar inscripción")
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Auto-calcular total_pago basado en el curso seleccionado
    if (name === "curso" && value) {
      const cursoSeleccionado = cursos.find((c) => c.id === Number.parseInt(value))
      if (cursoSeleccionado) {
        setFormData((prev) => ({
          ...prev,
          total_pago: cursoSeleccionado.costo,
        }))
      }
    }
  }

  if (loading) {
    return <div className="loading-state">Cargando inscripciones...</div>
  }

  return (
    <div>
      <div className="admin-header">
        <h1 className="admin-title">Gestión de Inscripciones</h1>
        <p className="admin-subtitle">Administra las inscripciones de alumnos a cursos</p>
      </div>

      <div className="admin-actions">
        <button className="btn btn-primary" onClick={handleCrear}>
          + Nueva Inscripción
        </button>
      </div>

      {inscripciones.length === 0 ? (
        <div className="empty-state">
          <p>No hay inscripciones registradas</p>
        </div>
      ) : (
        <div className="items-list">
          {inscripciones.map((inscripcion) => (
            <div key={inscripcion.id} className="item-row">
              <div className="item-info">
                <div className="item-name">Inscripción #{inscripcion.id}</div>
                <div className="item-details">
                  Alumno: {inscripcion.alumno_data?.nombre_completo} | Curso: {inscripcion.curso_data?.nombre_curso} |
                  Instructor: {inscripcion.instructor_data?.nombre_completo} | Pago: $
                  {Number.parseFloat(inscripcion.total_pago).toLocaleString("es-MX")} | Estado:{" "}
                  {inscripcion.estado_inscripcion}
                </div>
              </div>
              <div className="item-actions">
                <button className="btn btn-danger btn-small" onClick={() => handleEliminar(inscripcion.id)}>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Crear */}
      {modalCrear && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">Nueva Inscripción</h2>
              <button className="modal-close" onClick={() => setModalCrear(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              {error && <div className="error-text">{error}</div>}

              <div className="form-group">
                <label className="form-label">Alumno</label>
                <select name="alumno" className="form-select" value={formData.alumno} onChange={handleChange} required>
                  <option value="">Seleccionar alumno...</option>
                  {alumnos.map((alumno) => (
                    <option key={alumno.id} value={alumno.id}>
                      {alumno.nombre_completo} ({alumno.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Curso</label>
                <select name="curso" className="form-select" value={formData.curso} onChange={handleChange} required>
                  <option value="">Seleccionar curso...</option>
                  {cursos
                    .filter((c) => c.estado_curso === "Activo")
                    .map((curso) => (
                      <option key={curso.id} value={curso.id}>
                        {curso.nombre_curso} - ${curso.costo}
                      </option>
                    ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Instructor</label>
                <select
                  name="instructor"
                  className="form-select"
                  value={formData.instructor}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar instructor...</option>
                  {instructores.map((instructor) => (
                    <option key={instructor.id} value={instructor.id}>
                      {instructor.nombre_completo} - {instructor.especialidad}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Método de Pago</label>
                <select
                  name="metodo_pago"
                  className="form-select"
                  value={formData.metodo_pago}
                  onChange={handleChange}
                  required
                >
                  <option value="Efectivo">Efectivo</option>
                  <option value="Tarjeta">Tarjeta</option>
                  <option value="Transferencia">Transferencia</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Estado</label>
                <select
                  name="estado_inscripcion"
                  className="form-select"
                  value={formData.estado_inscripcion}
                  onChange={handleChange}
                  required
                >
                  <option value="Activa">Activa</option>
                  <option value="Cancelada">Cancelada</option>
                  <option value="Finalizada">Finalizada</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Total a Pagar</label>
                <input
                  type="number"
                  step="0.01"
                  name="total_pago"
                  className="form-input"
                  value={formData.total_pago}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModalCrear(false)}>
                Cancelar
              </button>
              <button className="btn btn-primary" onClick={handleGuardarCrear}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default InscripcionesAdmin
