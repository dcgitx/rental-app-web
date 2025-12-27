import { defineStore } from 'pinia'
import api from '@/lib/api'

const TTL = 1000 * 60 * 60 * 6 // 6 hours

export const useLocationStore = defineStore('location', {
  state: () => ({
    lat: null,
    lng: null,
    source: null,
    loaded: false,
    fetchedAt: null,
  }),

  actions: {
    async fetch() {
      if (this.loaded && this.fetchedAt && Date.now() - this.fetchedAt < TTL) {
        return
      }

      const response = await api.get('/get-location')

      this.lat = response.data.lat
      this.lng = response.data.lng
      this.source = response.data.source
      this.loaded = true
      this.fetchedAt = Date.now()
    },
  },

  persist: true,
})
