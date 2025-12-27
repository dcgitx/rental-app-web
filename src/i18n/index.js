import { createI18n } from 'vue-i18n'

import en from './en.json'
import fr from './fr.json'
import de from './de.json'
import nl from './nl.json'
import es from './es.json'

export const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('locale') || 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    fr,
    de,
    es,
    nl,
  },
  missingWarn: false,
  fallbackWarn: false,
})
