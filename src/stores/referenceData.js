import { defineStore } from 'pinia'
import api from '@/lib/api'

export const useReferenceDataStore = defineStore('referenceData', {
  state: () => ({
    categories: [],
    itemConditions: [],
    loaded: false,
  }),

  actions: {
    async loadCategories() {
      if (this.categories.length) return

      const { data } = await api.get('/item-categories')
      this.categories = data
    },

    async loadItemConditions() {
      if (this.itemConditions.length) return

      const { data } = await api.get('/item-conditions')
      this.itemConditions = data
    },

    async preload() {
      if (this.loaded) return

      await Promise.all([this.loadCategories(), this.loadItemConditions()])

      this.loaded = true
    },
  },
})
