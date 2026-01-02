import api from '@/lib/api'

export function fetchItemConditions() {
  return api.get('/item-conditions')
}
