import api from '@/lib/api'

export function fetchAddressSuggestions(query, countries = []) {
  return api.post('/address/suggestions', {
    query,
    countries,
  })
}

export function fetchPlaceDetails(placeId) {
  return api.post('/address/place-details', {
    place_id: placeId,
  })
}
