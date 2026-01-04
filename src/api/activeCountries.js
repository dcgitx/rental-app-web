import api from '@/lib/api'

export function fetchActiveCountries() {
  return api.get('/active-countries')
}
