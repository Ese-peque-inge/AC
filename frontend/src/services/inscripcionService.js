import api from "../config/api"

const inscripcionService = {
  // Obtener todas las inscripciones
  getInscripciones: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters).toString()
      const url = params ? `/inscripciones/?${params}` : "/inscripciones/"
      const response = await api.get(url)
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.response?.data }
    }
  },

  // Obtener una inscripción
  getInscripcion: async (id) => {
    try {
      const response = await api.get(`/inscripciones/${id}/`)
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.response?.data }
    }
  },

  // Crear inscripción
  createInscripcion: async (data) => {
    try {
      const response = await api.post("/inscripciones/", data)
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.response?.data }
    }
  },

  // Actualizar inscripción
  updateInscripcion: async (id, data) => {
    try {
      const response = await api.put(`/inscripciones/${id}/`, data)
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.response?.data }
    }
  },

  // Eliminar inscripción
  deleteInscripcion: async (id) => {
    try {
      await api.delete(`/inscripciones/${id}/`)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.response?.data }
    }
  },
}

export default inscripcionService
