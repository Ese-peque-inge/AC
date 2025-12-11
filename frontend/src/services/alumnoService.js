import api from "../config/api"

const alumnoService = {
  // Obtener todos los alumnos
  getAlumnos: async (busqueda = "") => {
    try {
      const url = busqueda ? `/alumnos/?search=${busqueda}` : "/alumnos/"
      const response = await api.get(url)
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.response?.data }
    }
  },

  // Obtener un alumno
  getAlumno: async (id) => {
    try {
      const response = await api.get(`/alumnos/${id}/`)
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.response?.data }
    }
  },

  // Crear un alumno
  createAlumno: async (data) => {
    try {
      const response = await api.post("/alumnos/", data)
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.response?.data }
    }
  },

  // Actualizar alumno
  updateAlumno: async (id, data) => {
    try {
      const response = await api.put(`/alumnos/${id}/`, data)
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.response?.data }
    }
  },

  // Actualizar parcial
  patchAlumno: async (id, data) => {
    try {
      const response = await api.patch(`/alumnos/${id}/`, data)
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.response?.data }
    }
  },

  // Eliminar alumno
  deleteAlumno: async (id) => {
    try {
      await api.delete(`/alumnos/${id}/`)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.response?.data }
    }
  },
}

export default alumnoService
