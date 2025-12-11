import api from "../config/api"

const adminCursoService = {
  // Obtener todos los cursos
  getCursos: async (search = "", nivel = "") => {
    try {
      let url = "/cursos/"
      const params = []
      if (search) params.push(`search=${search}`)
      if (nivel) params.push(`nivel=${nivel}`)
      if (params.length > 0) url += `?${params.join("&")}`

      const response = await api.get(url)
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.response?.data }
    }
  },

  // Obtener un curso
  getCurso: async (id) => {
    try {
      const response = await api.get(`/cursos/${id}/`)
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.response?.data }
    }
  },

  // Crear curso
  createCurso: async (data) => {
    try {
      const response = await api.post("/cursos/", data)
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.response?.data }
    }
  },

  // Actualizar curso
  updateCurso: async (id, data) => {
    try {
      const response = await api.put(`/cursos/${id}/`, data)
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.response?.data }
    }
  },

  // Eliminar curso
  deleteCurso: async (id) => {
    try {
      await api.delete(`/cursos/${id}/`)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.response?.data }
    }
  },
}

export default adminCursoService
