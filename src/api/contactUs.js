import api from '@/lib/api'

export function submitContact(payload) {
  return api.post('/contact-us', payload)
}
