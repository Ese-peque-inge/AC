import api from "../config/api"

const authService = {
  // Login
  login: async (username, password) => {
    try {
      const response = await api.post("/auth/login/", { username, password })
      const { tokens, usuario } = response.data

      // Guardar tokens y usuario en localStorage
      localStorage.setItem("access_token", tokens.access)
      localStorage.setItem("refresh_token", tokens.refresh)
      localStorage.setItem("user", JSON.stringify(usuario))

      return { success: true, usuario }
    } catch (error) {
      const message = error.response?.data?.error || "Error al iniciar sesión"
      return { success: false, error: message }
    }
  },

  // Registro de alumno
  registroAlumno: async (data) => {
    try {
      const response = await api.post("/auth/registro/alumno/", data)
      const { tokens, usuario } = response.data

      // Guardar tokens y usuario en localStorage
      localStorage.setItem("access_token", tokens.access)
      localStorage.setItem("refresh_token", tokens.refresh)
      localStorage.setItem("user", JSON.stringify(usuario))

      return { success: true, usuario }
    } catch (error) {
      const message = error.response?.data || "Error al registrar alumno"
      return { success: false, error: message }
    }
  },

  // Registro de instructor
  registroInstructor: async (data) => {
    try {
      const response = await api.post("/auth/registro/instructor/", data)
      const { tokens, usuario } = response.data

      // Guardar tokens y usuario en localStorage
      localStorage.setItem("access_token", tokens.access)
      localStorage.setItem("refresh_token", tokens.refresh)
      localStorage.setItem("user", JSON.stringify(usuario))

      return { success: true, usuario }
    } catch (error) {
      const message = error.response?.data || "Error al registrar instructor"
      return { success: false, error: message }
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("user")
  },

  // Obtener usuario actual
  getCurrentUser: () => {
    const userStr = localStorage.getItem("user")
    if (userStr) {
      return JSON.parse(userStr)
    }
    return null
  },

  // Verificar si está autenticado
  isAuthenticated: () => {
    return !!localStorage.getItem("access_token")
  },

  // Obtener perfil
  getPerfil: async () => {
    try {
      const response = await api.get("/auth/perfil/")
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.response?.data }
    }
  },
}

export default authService
