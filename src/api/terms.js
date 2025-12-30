import api from '@/lib/api'

export function fetchTerms() {
  return api.get('/terms')
}
