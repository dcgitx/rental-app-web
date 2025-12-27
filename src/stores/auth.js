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
      try {
        const { data } = await api.get('/auth-check')
        this.user = data
        sessionStorage.setItem('auth:user', JSON.stringify(data))
      } catch {
        this.user = null
        sessionStorage.removeItem('auth:user')
      } finally {
        this.loaded = true
      }
    },

    async logout() {
      await api.post('/logout')

      this.user = null
      this.loaded = true
      sessionStorage.removeItem('auth:user')
    },
  },
})
