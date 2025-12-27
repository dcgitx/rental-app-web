import api from '@/lib/api'

export function fetchFaqs() {
  return api.get('/faqs')
}
