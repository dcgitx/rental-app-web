import api from '@/lib/api'

export function fetchRecentItems(params = {}) {
  return api.get('/recent-items', {
    params: {
      ...params,
      card: true,
    },
  })
}
