import api from '@/lib/api'

export function fetchUserAddresses() {
  return api.get('/addresses')
}

export function storeAddress(payload) {
  return api.post('/addresses', payload)
}
