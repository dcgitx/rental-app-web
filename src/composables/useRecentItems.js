import { ref } from 'vue'
import { fetchRecentItems } from '@/api/recentItems'
import { useLocationStore } from '@/stores/locationStore'

const CACHE_TTL = 1000 * 60 * 2 // 2 minutes

let cachedItems = null
let cachedAt = null
let cachedCoords = null

export function useRecentItems() {
  const locationStore = useLocationStore()

  const items = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function load() {
    const now = Date.now()
    const coords =
      locationStore.lat && locationStore.lng ? `${locationStore.lat},${locationStore.lng}` : null

    // ✅ reuse cache if still valid AND same location
    if (cachedItems && cachedAt && now - cachedAt < CACHE_TTL && cachedCoords === coords) {
      items.value = cachedItems
      return
    }

    loading.value = true
    error.value = null

    try {
      const params = coords ? { lat: locationStore.lat, lng: locationStore.lng } : undefined

      const res = await fetchRecentItems(params)

      items.value = res.data

      // update cache
      cachedItems = res.data
      cachedAt = now
      cachedCoords = coords
    } catch (e) {
      console.error(e)
      error.value = 'Failed to load recent items'
    } finally {
      loading.value = false
    }
  }

  return {
    items,
    loading,
    error,
    load,
  }
}
