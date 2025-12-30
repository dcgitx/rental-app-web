import { defineStore } from 'pinia'
import api from '@/lib/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(sessionStorage.getItem('auth:user')),
    loaded: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
  },

  actions: {
    async fetchUser() {
      const token = localStorage.getItem('token')

      // no token, no API call
      if (!token) {
        this.user = null
        this.loaded = true
        sessionStorage.removeItem('auth:user')
        return
      }

      this.loaded = true

      try {
        const { data } = await api.get('/auth/me')
        this.user = data
        sessionStorage.setItem('auth:user', JSON.stringify(data))
      } catch {
        this.user = null
        localStorage.removeItem('token')
        sessionStorage.removeItem('auth:user')
      }
    },

    logout() {
      this.user = null
      this.loaded = true
      localStorage.removeItem('token')
      sessionStorage.removeItem('auth:user')
    },
  },
})
