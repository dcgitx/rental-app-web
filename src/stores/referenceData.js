import { defineStore } from 'pinia'
import { fetchItemCategories } from '@/api/itemCategories'
import { fetchItemConditions } from '@/api/itemConditions'
import { fetchActiveCountries } from '@/api/activeCountries'
import { fetchActiveLanguages } from '@/api/activeLanguages'

export const useReferenceDataStore = defineStore('referenceData', {
  state: () => ({
    categories: [],
    itemConditions: [],
    activeCountries: [],
    activeLanguages: [],

    categoriesLoaded: false,
    conditionsLoaded: false,
    countriesLoaded: false,
    languagesLoaded: false,
  }),

  actions: {
    async loadCategories() {
      if (this.categoriesLoaded) return

      const { data } = await fetchItemCategories()
      this.categories = data
      this.categoriesLoaded = true
    },

    async loadItemConditions() {
      if (this.conditionsLoaded) return

      const { data } = await fetchItemConditions()
      this.itemConditions = data
      this.conditionsLoaded = true
    },

    async loadActiveCountries() {
      if (this.countriesLoaded) return

      const { data } = await fetchActiveCountries()
      this.activeCountries = data
      this.countriesLoaded = true
    },

    async loadActiveLanguages() {
      if (this.languagesLoaded) return

      const { data } = await fetchActiveLanguages()
      this.activeLanguages = data
      this.languagesLoaded = true
    },

    async preload() {
      await Promise.all([
        this.loadCategories(),
        this.loadItemConditions(),
        this.loadActiveCountries(),
        this.loadActiveLanguages(),
      ])
    },
  },
})
