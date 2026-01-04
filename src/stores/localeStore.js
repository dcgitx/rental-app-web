import { defineStore } from 'pinia'
import { i18n } from '@/i18n'

export const useLocaleStore = defineStore('locale', {
  state: () => ({
    locale: localStorage.getItem('locale') || 'en',
    available: [], // populated from API
    loaded: false,
  }),

  actions: {
    setLocale(locale) {
      this.locale = locale
      localStorage.setItem('locale', locale)
      i18n.global.locale.value = locale
    },

    hydrateFromLanguages(languages) {
      this.available = languages.map((l) => l.locale)
    },

    syncI18n() {
      i18n.global.locale.value = this.locale
    },
  },
})
