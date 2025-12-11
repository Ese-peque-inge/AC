"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../../components/Navbar"
import cursoService from "../../services/cursoService"
import { useAuth } from "../../context/AuthContext"
import "./LandingPage.css"

const LandingPage = () => {
  const [cursosPorCategoria, setCursosPorCategoria] = useState({})
  const [categoriaActiva, setCategoriaActiva] = useState("Guitarra")
  const [loading, setLoading] = useState(true)
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    cargarCursos()
  }, [])

  const cargarCursos = async () => {
    setLoading(true)
    const result = await cursoService.getCursosPorCategoria()
    if (result.success) {
      setCursosPorCategoria(result.data)
    }
    setLoading(false)
  }

  const handleRegistroCurso = () => {
    if (isAuthenticated) {
      navigate("/alumno")
    } else {
      navigate("/login")
    }
  }

  const categorias = ["Teclado", "Guitarra", "Bateria", "Violin"]
  const cursosActuales = cursosPorCategoria[categoriaActiva] || []

  const iconoCategoria = (categoria) => {
    const iconos = {
      Teclado: "🎹",
      Guitarra: "🎸",
      Bateria: "🥁",
      Violin: "🎻",
    }
    return iconos[categoria] || "🎵"
  }

  return (
    <div className="landing-page">
      <Navbar showAuthButtons={true} />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Descubre tu Pasión por la Música</h1>
          <p className="hero-subtitle">
            Aprende a tocar tu instrumento favorito con instructores profesionales en nuestra academia. Cursos para
            todos los niveles.
          </p>
          <button
            className="hero-button"
            onClick={() => document.getElementById("cursos")?.scrollIntoView({ behavior: "smooth" })}
          >
            Explorar Cursos
          </button>
        </div>
      </section>

      {/* Cursos Section */}
      <section id="cursos" className="section">
        <h2 className="section-title">Nuestros Cursos</h2>
        <p className="section-subtitle">Elige el instrumento que más te apasione y comienza tu viaje musical</p>

        <div className="cursos-tabs">
          {categorias.map((categoria) => (
            <button
              key={categoria}
              className={`curso-tab ${categoriaActiva === categoria ? "active" : ""}`}
              onClick={() => setCategoriaActiva(categoria)}
            >
              {iconoCategoria(categoria)} {categoria}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-container">
            <p>Cargando cursos...</p>
          </div>
        ) : cursosActuales.length > 0 ? (
          <div className="cursos-grid">
            {cursosActuales.map((curso) => (
              <div key={curso.id} className="curso-card">
                <div className="curso-imagen">
                  {curso.imagen ? (
                    <img src={curso.imagen || "/placeholder.svg"} alt={curso.nombre_curso} />
                  ) : (
                    iconoCategoria(curso.categoria)
                  )}
                </div>
                <div className="curso-content">
                  <h3 className="curso-nombre">{curso.nombre_curso}</h3>

                  <div className="curso-info">
                    <div className="curso-info-item">
                      <span>📚</span>
                      <span>Nivel: {curso.nivel}</span>
                    </div>
                    <div className="curso-info-item">
                      <span>⏱️</span>
                      <span>Duración: {curso.duracion_semanas} semanas</span>
                    </div>
                    <div className="curso-info-item">
                      <span>📅</span>
                      <span>Inicio: {new Date(curso.fecha_inicio).toLocaleDateString("es-MX")}</span>
                    </div>
                    <div className="curso-info-item">
                      <span>📅</span>
                      <span>Fin: {new Date(curso.fecha_fin).toLocaleDateString("es-MX")}</span>
                    </div>
                  </div>

                  <div className="curso-precio">${Number.parseFloat(curso.costo).toLocaleString("es-MX")}</div>

                  <div className="curso-cupos">
                    <span>Cupo máximo: {curso.cupo_maximo}</span>
                    <span>Disponibles: {curso.cupo_maximo - curso.inscritos_actuales}</span>
                  </div>

                  <button
                    className="curso-button"
                    onClick={handleRegistroCurso}
                    disabled={curso.inscritos_actuales >= curso.cupo_maximo}
                  >
                    {curso.inscritos_actuales >= curso.cupo_maximo ? "Cupo Lleno" : "Registrarse"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-container">
            <p>No hay cursos disponibles en esta categoría por el momento.</p>
          </div>
        )}
      </section>

      {/* Sobre Nosotros Section */}
      <section id="sobre-nosotros" className="section" style={{ backgroundColor: "var(--background-secondary)" }}>
        <h2 className="section-title">Sobre Nosotros</h2>
        <p className="section-subtitle">Conoce más sobre nuestra academia y por qué somos tu mejor elección</p>

        <div className="sobre-nosotros-content">
          <div className="sobre-texto">
            <p className="sobre-descripcion">
              Somos una academia de música con más de 10 años de experiencia formando músicos de todos los niveles.
              Nuestro equipo de instructores profesionales se dedica a brindar educación musical de calidad en un
              ambiente inspirador y motivador. Creemos que la música es un lenguaje universal que enriquece la vida de
              las personas.
            </p>

            <div className="puntos-clave">
              <div className="punto-clave">
                <div className="punto-icono">👨‍🏫</div>
                <div className="punto-texto">
                  <h3>Instructores Certificados</h3>
                  <p>
                    Profesionales con amplia experiencia en enseñanza musical y trayectoria en el mundo de la música.
                  </p>
                </div>
              </div>

              <div className="punto-clave">
                <div className="punto-icono">🎯</div>
                <div className="punto-texto">
                  <h3>Método Personalizado</h3>
                  <p>
                    Adaptamos nuestro método de enseñanza a las necesidades y ritmo de aprendizaje de cada estudiante.
                  </p>
                </div>
              </div>

              <div className="punto-clave">
                <div className="punto-icono">🏆</div>
                <div className="punto-texto">
                  <h3>Instalaciones de Primera</h3>
                  <p>
                    Contamos con aulas equipadas con instrumentos de calidad y tecnología moderna para tu aprendizaje.
                  </p>
                </div>
              </div>

              <div className="punto-clave">
                <div className="punto-icono">🌟</div>
                <div className="punto-texto">
                  <h3>Resultados Comprobados</h3>
                  <p>Miles de alumnos satisfechos que han cumplido sus metas musicales con nosotros.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="sobre-imagen">
            <div className="logo-academia">🎵</div>
          </div>
        </div>
      </section>

      {/* Testimonios Section */}
      <section id="testimonios" className="section">
        <h2 className="section-title">Testimonios</h2>
        <p className="section-subtitle">Lo que dicen nuestros alumnos sobre su experiencia</p>

        <div className="testimonios-grid">
          <div className="testimonio-card">
            <div className="testimonio-header">
              <div className="testimonio-avatar">AM</div>
              <div className="testimonio-info">
                <h3>Ana María López</h3>
                <p>Estudiante desde hace 2 años</p>
              </div>
            </div>
            <p className="testimonio-texto">
              "Siempre quise aprender a tocar la guitarra y finalmente lo logré gracias a los excelentes instructores de
              la academia. El ambiente es muy amigable y las clases son muy didácticas. Totalmente recomendado!"
            </p>
            <div className="testimonio-curso">🎸 Guitarra Intermedio</div>
          </div>

          <div className="testimonio-card">
            <div className="testimonio-header">
              <div className="testimonio-avatar">CR</div>
              <div className="testimonio-info">
                <h3>Carlos Rodríguez</h3>
                <p>Estudiante desde hace 1 año</p>
              </div>
            </div>
            <p className="testimonio-texto">
              "Como músico profesional, buscaba perfeccionar mi técnica en el piano. Los instructores aquí son de primer
              nivel y me han ayudado a alcanzar un nuevo nivel en mi carrera musical. La metodología es excepcional."
            </p>
            <div className="testimonio-curso">🎹 Piano Avanzado</div>
          </div>

          <div className="testimonio-card">
            <div className="testimonio-header">
              <div className="testimonio-avatar">MG</div>
              <div className="testimonio-info">
                <h3>María González</h3>
                <p>Estudiante desde hace 6 meses</p>
              </div>
            </div>
            <p className="testimonio-texto">
              "Mis hijos están tomando clases de violín y batería, y no podría estar más feliz con su progreso. Los
              maestros son pacientes, profesionales y realmente se preocupan por el desarrollo de cada alumno."
            </p>
            <div className="testimonio-curso">🎻 Violín - 🥁 Batería</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: "#1f2937",
          color: "white",
          padding: "3rem 2rem",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Academia de Música</h3>
          <p style={{ color: "#9ca3af", marginBottom: "2rem" }}>Transformando vidas a través de la educación musical</p>
          <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>
            © 2025 Academia de Música. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
