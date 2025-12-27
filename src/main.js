import './assets/main.css'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { i18n } from '@/i18n'
import { useLocationStore } from './stores/locationStore'

import App from './App.vue'
import router from './router'

function detectBrowserLocale() {
  return (navigator.language || 'en').split('-')[0]
}

if (!localStorage.getItem('locale')) {
  localStorage.setItem('locale', detectBrowserLocale())
}

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.use(i18n)

const locationStore = useLocationStore(pinia)
locationStore.fetch()

app.mount('#app')

// Detect system dark mode
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')

function updateDarkMode(e) {
  if (e.matches) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// Set initial
updateDarkMode(prefersDark)

// Watch for changes
prefersDark.addEventListener('change', updateDarkMode)
