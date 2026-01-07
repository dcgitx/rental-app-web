import api from '@/lib/api'

export function forgotPassword(email) {
  return api.post('/forgot-password', email)
}

export function logout() {
  return api.post('/logout')
}
