import api from '@/lib/api'

export function fetchCategories() {
  return api.get('/item-categories')
}
