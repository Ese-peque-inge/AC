"use client"

import { useState, useEffect } from "react"
import Navbar from "../../components/Navbar"
import { useAuth } from "../../context/AuthContext"
import adminCursoService from "../../services/adminCursoService"
import inscripcionService from "../../services/inscripcionService"
import "./AlumnoDashboard.css"

const AlumnoDashboard = () => {
  const [tabActiva, setTabActiva] = useState("cursos")
  const [cursos, setCursos] = useState([])
  const [inscripciones, setInscripciones] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (tabActiva === "cursos") {
      cargarCursos()
    } else {
      cargarInscripciones()
    }
  }, [tabActiva])

  const cargarCursos = async () => {
    setLoading(true)
    const result = await adminCursoService.getCursos()
    if (result.success) {
      // Filtrar solo cursos activos
      const cursosActivos = result.data.filter((c) => c.estado_curso === "Activo")
      setCursos(cursosActivos)
    }
    setLoading(false)
  }

  const cargarInscripciones = async () => {
    setLoading(true)
    const result = await inscripcionService.getMisInscripciones()
    if (result.success) {
      setInscripciones(result.data)
    }
    setLoading(false)
  }

  const iconoCategoria = (categoria) => {
    const iconos = {
      Teclado: "🎹",
      Guitarra: "🎸",
      Bateria: "🥁",
      Violin: "🎻",
    }
    return iconos[categoria] || "🎵"
  }

  const calcularProgreso = (curso) => {
    return ((curso.inscritos_actuales / curso.cupo_maximo) * 100).toFixed(0)
  }

  const getEstadoBadge = (curso) => {
    const progreso = (curso.inscritos_actuales / curso.cupo_maximo) * 100
    if (progreso >= 100) return { class: "badge-danger", text: "Lleno" }
    if (progreso >= 90) return { class: "badge-warning", text: "Casi lleno" }
    return { class: "badge-success", text: "Disponible" }
  }

  const getEstadoInscripcionBadge = (estado) => {
    const badges = {
      Activa: { class: "badge-success", text: "Activa" },
      Cancelada: { class: "badge-danger", text: "Cancelada" },
      Finalizada: { class: "badge-info", text: "Finalizada" },
    }
    return badges[estado] || { class: "badge-info", text: estado }
  }

  if (loading) {
    return (
      <div className="alumno-dashboard">
        <Navbar />
        <div className="loading-state">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="alumno-dashboard">
      <Navbar />

      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-welcome">Bienvenido, {user?.nombre_usuario}</h1>
          <p className="dashboard-subtitle">Explora los cursos disponibles y gestiona tus inscripciones</p>
        </div>

        <div className="tabs-container">
          <div className="tabs">
            <div className={`tab ${tabActiva === "cursos" ? "active" : ""}`} onClick={() => setTabActiva("cursos")}>
              Cursos Disponibles
            </div>
            <div
              className={`tab ${tabActiva === "inscripciones" ? "active" : ""}`}
              onClick={() => setTabActiva("inscripciones")}
            >
              Mis Inscripciones
            </div>
          </div>
        </div>

        {tabActiva === "cursos" && (
          <div className="cursos-section">
            <h2 className="section-title">Cursos Disponibles</h2>

            {cursos.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📚</div>
                <h3>No hay cursos disponibles</h3>
                <p>Por el momento no hay cursos activos en el sistema</p>
              </div>
            ) : (
              <div className="cursos-grid">
                {cursos.map((curso) => {
                  const progreso = calcularProgreso(curso)
                  const estadoBadge = getEstadoBadge(curso)
                  const cuposDisponibles = curso.cupo_maximo - curso.inscritos_actuales

                  return (
                    <div key={curso.id} className="curso-card">
                      <div className="curso-header">
                        <div className="curso-icono">{iconoCategoria(curso.categoria)}</div>
                        <h3 className="curso-nombre">{curso.nombre_curso}</h3>
                        <div className="curso-nivel">{curso.nivel}</div>
                      </div>

                      <div className="curso-body">
                        <div className="curso-info-grid">
                          <div className="info-item">
                            <span className="info-label">Duración</span>
                            <span className="info-value">{curso.duracion_semanas} semanas</span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">Estado</span>
                            <span className={`badge ${estadoBadge.class}`}>{estadoBadge.text}</span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">Inicio</span>
                            <span className="info-value">
                              {new Date(curso.fecha_inicio).toLocaleDateString("es-MX")}
                            </span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">Fin</span>
                            <span className="info-value">{new Date(curso.fecha_fin).toLocaleDateString("es-MX")}</span>
                          </div>
                        </div>

                        <div className="curso-progress">
                          <div className="progress-header">
                            <span style={{ color: "var(--text-secondary)", fontWeight: 500 }}>Cupos ocupados</span>
                            <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                              {curso.inscritos_actuales} / {curso.cupo_maximo}
                            </span>
                          </div>
                          <div className="progress-bar-container">
                            <div className="progress-bar" style={{ width: `${progreso}%` }} />
                          </div>
                        </div>

                        <div className="curso-actions">
                          <button className="btn btn-primary" disabled={cuposDisponibles <= 0}>
                            {cuposDisponibles <= 0 ? "Cupo Lleno" : "Ingresar al Curso"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {tabActiva === "inscripciones" && (
          <div className="cursos-section">
            <h2 className="section-title">Mis Inscripciones</h2>

            {inscripciones.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📝</div>
                <h3>No tienes inscripciones</h3>
                <p>Aún no te has inscrito a ningún curso</p>
              </div>
            ) : (
              <div className="inscripciones-list">
                {inscripciones.map((inscripcion) => {
                  const estadoBadge = getEstadoInscripcionBadge(inscripcion.estado_inscripcion)

                  return (
                    <div key={inscripcion.id} className="inscripcion-card">
                      <div className="inscripcion-header">
                        <div>
                          <h3 className="inscripcion-title">{inscripcion.curso_data?.nombre_curso}</h3>
                          <span className={`badge ${estadoBadge.class}`}>{estadoBadge.text}</span>
                        </div>
                        <div style={{ fontSize: "2rem" }}>{iconoCategoria(inscripcion.curso_data?.categoria)}</div>
                      </div>

                      <div className="inscripcion-info">
                        <div className="info-item">
                          <span className="info-label">Instructor</span>
                          <span className="info-value">{inscripcion.instructor_data?.nombre_completo}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Nivel</span>
                          <span className="info-value">{inscripcion.curso_data?.nivel}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Duración</span>
                          <span className="info-value">{inscripcion.curso_data?.duracion_semanas} semanas</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Fecha de inscripción</span>
                          <span className="info-value">
                            {new Date(inscripcion.fecha_inscripcion).toLocaleDateString("es-MX")}
                          </span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Método de pago</span>
                          <span className="info-value">{inscripcion.metodo_pago}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Total pagado</span>
                          <span className="info-value" style={{ color: "var(--primary-color)" }}>
                            ${Number.parseFloat(inscripcion.total_pago).toLocaleString("es-MX")}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AlumnoDashboard
