import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    Accept: 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const locale = localStorage.getItem('locale')
  if (locale) {
    config.headers['Accept-Language'] = locale
  }
  return config
})

export default api
