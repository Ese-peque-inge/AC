"use client"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "./Navbar.css"

const Navbar = ({ showAuthButtons = false }) => {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <div
            className="navbar-logo-img"
            style={{
              background: "linear-gradient(135deg, #2563eb, #7c3aed)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "1.5rem",
              fontWeight: "bold",
            }}
          >
            🎵
          </div>
          <span className="navbar-logo-text">Academia de Música</span>
        </Link>

        <ul className="navbar-menu">
          {!isAuthenticated && showAuthButtons && (
            <>
              <li>
                <button
                  onClick={() => scrollToSection("cursos")}
                  className="navbar-link"
                  style={{ background: "none", border: "none", cursor: "pointer" }}
                >
                  Cursos
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("sobre-nosotros")}
                  className="navbar-link"
                  style={{ background: "none", border: "none", cursor: "pointer" }}
                >
                  Sobre Nosotros
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("testimonios")}
                  className="navbar-link"
                  style={{ background: "none", border: "none", cursor: "pointer" }}
                >
                  Testimonios
                </button>
              </li>
              <li>
                <Link to="/login" className="navbar-button">
                  Iniciar Sesión
                </Link>
              </li>
            </>
          )}

          {isAuthenticated && (
            <>
              <li>
                <span style={{ color: "var(--text-secondary)" }}>
                  {user?.email} ({user?.rol})
                </span>
              </li>
              <li>
                <button onClick={handleLogout} className="navbar-button outline">
                  Cerrar Sesión
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
