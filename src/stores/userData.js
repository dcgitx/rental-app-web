import { defineStore } from 'pinia'
import { fetchUserAddresses } from '@/api/userAddresses'

export const useUserDataStore = defineStore('userData', {
  state: () => ({
    addresses: [],
    loadingAddresses: false,
    loaded: false,
  }),

  actions: {
    async fetchAddresses() {
      if (this.loaded) return
      await this._loadAddresses()
    },

    async refreshAddresses() {
      await this._loadAddresses(true)
    },

    async _loadAddresses(force = false) {
      if (this.loadingAddresses) return

      this.loadingAddresses = true

      try {
        const { data } = await fetchUserAddresses()
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
