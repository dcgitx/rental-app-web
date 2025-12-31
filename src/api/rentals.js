import api from '@/lib/api'

export function fetchRentals() {
  return api.get('/rentals')
}
