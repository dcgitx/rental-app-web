import api from '@/lib/api'

export function fetchFavourites() {
  return api.get('/favourites')
}

export function addFavourite(itemId) {
  return api.post(`/favourites/${itemId}`)
}

export function deleteFavourite(id) {
  return api.delete(`/favourites/${id}`)
}
