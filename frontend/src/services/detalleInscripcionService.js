import api from "../config/api"

const detalleInscripcionService = {
  // Obtener todos los detalles
  getDetalles: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters).toString()
      const url = params ? `/detalle-inscripciones/?${params}` : "/detalle-inscripciones/"
      const response = await api.get(url)
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.response?.data }
    }
  },

  // Obtener un detalle
  getDetalle: async (id) => {
    try {
      const response = await api.get(`/detalle-inscripciones/${id}/`)
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.response?.data }
    }
  },

  // Crear detalle
  createDetalle: async (data) => {
    try {
      const response = await api.post("/detalle-inscripciones/", data)
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.response?.data }
    }
  },

  // Actualizar detalle
  updateDetalle: async (id, data) => {
    try {
      const response = await api.put(`/detalle-inscripciones/${id}/`, data)
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.response?.data }
    }
  },

  // Eliminar detalle
  deleteDetalle: async (id) => {
    try {
      await api.delete(`/detalle-inscripciones/${id}/`)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.response?.data }
    }
  },
}

export default detalleInscripcionService
