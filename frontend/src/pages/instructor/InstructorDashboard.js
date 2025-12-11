"use client"

import { useState, useEffect } from "react"
import Navbar from "../../components/Navbar"
import { useAuth } from "../../context/AuthContext"
import adminCursoService from "../../services/adminCursoService"
import "./InstructorDashboard.css"

const InstructorDashboard = () => {
  const [cursos, setCursos] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    cargarCursos()
  }, [])

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
    if (progreso >= 90) return { class: "badge-danger", text: "Casi lleno" }
    if (progreso >= 70) return { class: "badge-warning", text: "Llenándose" }
    return { class: "badge-success", text: "Disponible" }
  }

  if (loading) {
    return (
      <div className="instructor-dashboard">
        <Navbar />
        <div className="loading-state">Cargando cursos...</div>
      </div>
    )
  }

  return (
    <div className="instructor-dashboard">
      <Navbar />

      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-welcome">Bienvenido, {user?.nombre_usuario}</h1>
          <p className="dashboard-subtitle">Aquí puedes ver todos los cursos disponibles en la academia</p>
        </div>

        <div className="cursos-section">
          <div className="section-header">
            <h2 className="section-title">Cursos Disponibles</h2>
          </div>

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
                          <span className="info-value">{new Date(curso.fecha_inicio).toLocaleDateString("es-MX")}</span>
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
                        <button className="btn btn-primary">Ingresar al Curso</button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default InstructorDashboard
