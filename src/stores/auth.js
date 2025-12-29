import { defineStore } from 'pinia'
import api from '@/lib/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loaded: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
  },

  actions: {
    async fetchUser() {
      try {
        const { data } = await api.get('/auth-check')
        this.user = data
      } catch {
        this.user = null
        localStorage.removeItem('token')
      } finally {
        this.loaded = true
      }
    },

    logout() {
      this.user = null
      this.loaded = true
      localStorage.removeItem('token')
    },
  },
})
