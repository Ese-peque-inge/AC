"use client"

import { useState } from "react"
import Navbar from "../../components/Navbar"
import AlumnosAdmin from "./AlumnosAdmin"
import InstructoresAdmin from "./InstructoresAdmin"
import CursosAdmin from "./CursosAdmin"
import InscripcionesAdmin from "./InscripcionesAdmin"
import "./AdminDashboard.css"

const AdminDashboard = () => {
  const [menuActivo, setMenuActivo] = useState("alumnos")

  return (
    <div className="admin-dashboard">
      <Navbar />

      <div className="admin-sidebar">
        <ul className="admin-menu">
          <li
            className={`admin-menu-item ${menuActivo === "alumnos" ? "active" : ""}`}
            onClick={() => setMenuActivo("alumnos")}
          >
            <span>👨‍🎓</span>
            <span>Alumnos</span>
          </li>
          <li
            className={`admin-menu-item ${menuActivo === "instructores" ? "active" : ""}`}
            onClick={() => setMenuActivo("instructores")}
          >
            <span>👨‍🏫</span>
            <span>Instructores</span>
          </li>
          <li
            className={`admin-menu-item ${menuActivo === "cursos" ? "active" : ""}`}
            onClick={() => setMenuActivo("cursos")}
          >
            <span>📚</span>
            <span>Cursos</span>
          </li>
          <li
            className={`admin-menu-item ${menuActivo === "inscripciones" ? "active" : ""}`}
            onClick={() => setMenuActivo("inscripciones")}
          >
            <span>📝</span>
            <span>Inscripciones</span>
          </li>
        </ul>
      </div>

      <div className="admin-content">
        {menuActivo === "alumnos" && <AlumnosAdmin />}
        {menuActivo === "instructores" && <InstructoresAdmin />}
        {menuActivo === "cursos" && <CursosAdmin />}
        {menuActivo === "inscripciones" && <InscripcionesAdmin />}
      </div>
    </div>
  )
}

export default AdminDashboard
