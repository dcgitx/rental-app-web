import api from '@/lib/api'

export function fetchRentals() {
  return api.get('/rentals')
}

export function acceptRental(id) {
  return api.post(`/rentals/${id}/accept`)
}

export function declineRental(id) {
  return api.post(`/rentals/${id}/decline`)
}

export function cancelRental(id) {
  return api.post(`/rentals/${id}/cancel`)
}
