import { ref } from 'vue'
import { fetchCategories } from '@/api/itemCategories'

export function useCategories() {
  const categories = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function load() {
    loading.value = true
    error.value = null
    try {
      const res = await fetchCategories()
      categories.value = res.data
    } catch (e) {
      console.error(e)
      error.value = 'Failed to load categories'
    } finally {
      loading.value = false
    }
  }

  return {
    categories,
    loading,
    error,
    load,
  }
}
