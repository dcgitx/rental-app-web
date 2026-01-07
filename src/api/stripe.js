import api from '@/lib/api'

export function startIdentityVerification() {
  return api.post('/stripe/identify')
}

export function createConnectedAccount() {
  return api.post('/stripe/connected-account/create')
}

export function showAccountDashboard() {
  return api.post('/stripe/connected-account/show')
}
