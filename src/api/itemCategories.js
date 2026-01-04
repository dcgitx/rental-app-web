import api from '@/lib/api'

export function fetchItemCategories() {
  return api.get('/item-categories')
}
