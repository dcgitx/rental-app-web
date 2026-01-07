import api from '@/lib/api'

export function startIdentityVerification() {
  return api.post('/stripe/identify')
}
