import { defineStore } from 'pinia'
import api from '@/lib/api'

export const useUserDataStore = defineStore('userData', {
  state: () => ({
    addresses: [],
    loadingAddresses: false,
    loaded: false,
  }),

  actions: {
    async fetchAddresses() {
      if (this.loaded) return

      this.loadingAddresses = true
      try {
        const { data } = await api.get('/user-addresses')
        this.addresses = data
        this.loaded = true
      } finally {
        this.loadingAddresses = false
      }
    },

    reset() {
      this.addresses = []
      this.loaded = false
    },
  },
})
