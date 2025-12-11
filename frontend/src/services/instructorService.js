import api from "../config/api"

const instructorService = {
  // Obtener todos los instructores
  getInstructores: async (busqueda = "") => {
    try {
      const url = busqueda ? `/instructores/?search=${busqueda}` : "/instructores/"
      const response = await api.get(url)
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.response?.data }
    }
  },

  // Obtener un instructor
  getInstructor: async (id) => {
    try {
      const response = await api.get(`/instructores/${id}/`)
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.response?.data }
    }
  },

  createInstructor: async (data) => {
    try {
      const response = await api.post("/instructores/", data)
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.response?.data }
    }
  },

  // Actualizar instructor
  updateInstructor: async (id, data) => {
    try {
      const response = await api.put(`/instructores/${id}/`, data)
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.response?.data }
    }
  },

  // Actualizar parcial
  patchInstructor: async (id, data) => {
    try {
      const response = await api.patch(`/instructores/${id}/`, data)
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.response?.data }
    }
  },

  // Eliminar instructor
  deleteInstructor: async (id) => {
    try {
      await api.delete(`/instructores/${id}/`)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.response?.data }
    }
  },
}

export default instructorService
