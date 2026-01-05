import api from '@/lib/api'

export function forgotPassword(email) {
  return api.post('/forgot-password', email)
}
