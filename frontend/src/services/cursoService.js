import api from "../config/api"

const cursoService = {
  // Obtener todos los cursos públicos
  getCursosPublicos: async () => {
    try {
      const response = await api.get("/cursos/publicos/")
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.response?.data }
    }
  },

  getCursos: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters).toString()
      const url = params ? `/cursos/?${params}` : "/cursos/"
      const response = await api.get(url)
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.response?.data }
    }
  },

  // Obtener un curso específico
  getCurso: async (id) => {
    try {
      const response = await api.get(`/cursos/${id}/`)
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.response?.data }
    }
  },

  createCurso: async (data) => {
    try {
      const response = await api.post("/cursos/", data)
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.response?.data }
    }
  },

  updateCurso: async (id, data) => {
    try {
      const response = await api.put(`/cursos/${id}/`, data)
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.response?.data }
    }
  },

  deleteCurso: async (id) => {
    try {
      await api.delete(`/cursos/${id}/`)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.response?.data }
    }
  },
}

export default cursoService
