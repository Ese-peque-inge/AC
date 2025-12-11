"use client"

import { useState, useEffect } from "react"
import adminCursoService from "../../services/adminCursoService"

const CursosAdmin = () => {
  const [cursos, setCursos] = useState([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState("")
  const [nivelFiltro, setNivelFiltro] = useState("")
  const [modalEditar, setModalEditar] = useState(false)
  const [modalCrear, setModalCrear] = useState(false)
  const [cursoEditar, setCursoEditar] = useState(null)
  const [formData, setFormData] = useState({})
  const [error, setError] = useState("")

  const niveles = ["Basico", "Intermedio", "Avanzado"]
  const iconoNivel = (nivel) => {
    const iconos = {
      Basico: "🎵",
      Intermedio: "🎶",
      Avanzado: "🎼",
    }
    return iconos[nivel] || "🎵"
  }

  useEffect(() => {
    cargarCursos()
  }, [])

  const cargarCursos = async () => {
    setLoading(true)
    const result = await adminCursoService.getCursos(busqueda, nivelFiltro)
    if (result.success) {
      setCursos(result.data)
    }
    setLoading(false)
  }

  const handleBuscar = () => {
    cargarCursos()
  }

  const handleCrear = () => {
    setFormData({
      nombre_curso: "",
      nivel: "Basico",
      duracion_semanas: "",
      costo: "",
      estado_curso: "Activo",
      fecha_inicio: "",
      fecha_fin: "",
      cupo_maximo: "",
    })
    setModalCrear(true)
    setError("")
  }

  const handleEditar = (curso) => {
    setCursoEditar(curso)
    setFormData({
      nombre_curso: curso.nombre_curso,
      nivel: curso.nivel,
      duracion_semanas: curso.duracion_semanas,
      costo: curso.costo,
      estado_curso: curso.estado_curso,
      fecha_inicio: curso.fecha_inicio,
      fecha_fin: curso.fecha_fin,
      cupo_maximo: curso.cupo_maximo,
      inscritos_actuales: curso.inscritos_actuales,
    })
    setModalEditar(true)
    setError("")
  }

  const handleGuardarCrear = async () => {
    const result = await adminCursoService.createCurso(formData)
    if (result.success) {
      setModalCrear(false)
      cargarCursos()
    } else {
      setError("Error al crear curso")
    }
  }

  const handleGuardarEditar = async () => {
    if (!cursoEditar) return

    const result = await adminCursoService.updateCurso(cursoEditar.id, formData)
    if (result.success) {
      setModalEditar(false)
      cargarCursos()
    } else {
      setError("Error al actualizar curso")
    }
  }

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este curso?")) return

    const result = await adminCursoService.deleteCurso(id)
    if (result.success) {
      cargarCursos()
    } else {
      alert("Error al eliminar curso")
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  if (loading) {
    return <div className="loading-state">Cargando cursos...</div>
  }

  return (
    <div>
      <div className="admin-header">
        <h1 className="admin-title">Gestión de Cursos</h1>
        <p className="admin-subtitle">Administra los cursos disponibles</p>
      </div>

      <div className="admin-actions">
        <div className="search-box">
          <input
            type="text"
            className="search-input"
            placeholder="Buscar cursos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleBuscar()}
          />
        </div>
        <select
          className="form-select"
          value={nivelFiltro}
          onChange={(e) => setNivelFiltro(e.target.value)}
          style={{ width: "auto" }}
        >
          <option value="">Todos los niveles</option>
          {niveles.map((niv) => (
            <option key={niv} value={niv}>
              {niv}
            </option>
          ))}
        </select>
        <button className="btn btn-primary" onClick={handleBuscar}>
          Buscar
        </button>
        <button className="btn btn-primary" onClick={handleCrear}>
          + Crear Curso
        </button>
      </div>

      {cursos.length === 0 ? (
        <div className="empty-state">
          <p>No se encontraron cursos</p>
        </div>
      ) : (
        <div className="cards-grid">
          {cursos.map((curso) => (
            <div key={curso.id} className="card">
              <div className="card-image">{iconoNivel(curso.nivel)}</div>
              <div className="card-content">
                <h3 className="card-title">{curso.nombre_curso}</h3>
                <div style={{ marginBottom: "0.5rem", color: "var(--text-secondary)" }}>
                  <div>Nivel: {curso.nivel}</div>
                  <div>Duración: {curso.duracion_semanas} semanas</div>
                  <div>Costo: ${Number.parseFloat(curso.costo).toLocaleString("es-MX")}</div>
                  <div>
                    Cupos: {curso.inscritos_actuales}/{curso.cupo_maximo}
                  </div>
                  <div>Estado: {curso.estado_curso}</div>
                </div>
                <div className="card-actions">
                  <button className="btn btn-outline btn-small" onClick={() => handleEditar(curso)} style={{ flex: 1 }}>
                    Editar
                  </button>
                  <button
                    className="btn btn-danger btn-small"
                    onClick={() => handleEliminar(curso.id)}
                    style={{ flex: 1 }}
                  >
                    Eliminar
                  </button>
                </div>
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
              <h2 className="modal-title">Crear Curso</h2>
              <button className="modal-close" onClick={() => setModalCrear(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              {error && <div className="error-text">{error}</div>}

              <div className="form-group">
                <label className="form-label">Nombre del Curso</label>
                <input
                  type="text"
                  name="nombre_curso"
                  className="form-input"
                  value={formData.nombre_curso}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Nivel</label>
                <select name="nivel" className="form-select" value={formData.nivel} onChange={handleChange} required>
                  {niveles.map((niv) => (
                    <option key={niv} value={niv}>
                      {niv}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Duración (semanas)</label>
                <input
                  type="number"
                  name="duracion_semanas"
                  className="form-input"
                  value={formData.duracion_semanas}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Costo</label>
                <input
                  type="number"
                  step="0.01"
                  name="costo"
                  className="form-input"
                  value={formData.costo}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Fecha de Inicio</label>
                <input
                  type="date"
                  name="fecha_inicio"
                  className="form-input"
                  value={formData.fecha_inicio}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Fecha de Fin</label>
                <input
                  type="date"
                  name="fecha_fin"
                  className="form-input"
                  value={formData.fecha_fin}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Cupo Máximo</label>
                <input
                  type="number"
                  name="cupo_maximo"
                  className="form-input"
                  value={formData.cupo_maximo}
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
                Crear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar */}
      {modalEditar && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">Editar Curso</h2>
              <button className="modal-close" onClick={() => setModalEditar(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              {error && <div className="error-text">{error}</div>}

              <div className="form-group">
                <label className="form-label">Nombre del Curso</label>
                <input
                  type="text"
                  name="nombre_curso"
                  className="form-input"
                  value={formData.nombre_curso}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Nivel</label>
                <select name="nivel" className="form-select" value={formData.nivel} onChange={handleChange}>
                  {niveles.map((niv) => (
                    <option key={niv} value={niv}>
                      {niv}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Duración (semanas)</label>
                <input
                  type="number"
                  name="duracion_semanas"
                  className="form-input"
                  value={formData.duracion_semanas}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Costo</label>
                <input
                  type="number"
                  step="0.01"
                  name="costo"
                  className="form-input"
                  value={formData.costo}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Estado del Curso</label>
                <select
                  name="estado_curso"
                  className="form-select"
                  value={formData.estado_curso}
                  onChange={handleChange}
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                  <option value="Finalizado">Finalizado</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Fecha de Inicio</label>
                <input
                  type="date"
                  name="fecha_inicio"
                  className="form-input"
                  value={formData.fecha_inicio}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Fecha de Fin</label>
                <input
                  type="date"
                  name="fecha_fin"
                  className="form-input"
                  value={formData.fecha_fin}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Cupo Máximo</label>
                <input
                  type="number"
                  name="cupo_maximo"
                  className="form-input"
                  value={formData.cupo_maximo}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Inscritos Actuales</label>
                <input
                  type="number"
                  name="inscritos_actuales"
                  className="form-input"
                  value={formData.inscritos_actuales}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModalEditar(false)}>
                Cancelar
              </button>
              <button className="btn btn-primary" onClick={handleGuardarEditar}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CursosAdmin
