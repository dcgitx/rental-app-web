import api from '@/lib/api'

export function fetchMyitems() {
  return api.get(`/rentalItems`)
}

export function fetchRentalItem(slug) {
  return api.get(`/rental-item/${slug}`)
}

export function storeRentalItem(formData) {
  return api.post('/rental-item', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export function calculateRentalPrice(payload) {
  return api.post('/calculate-rental-price', payload)
}

export function requestRental(payload) {
  return api.post('/rental-requests', payload)
}
