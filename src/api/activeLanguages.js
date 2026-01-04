import api from '@/lib/api'

export function fetchActiveLanguages() {
  return api.get('/active-languages')
}
