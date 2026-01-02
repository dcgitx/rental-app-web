import { useReferenceDataStore } from '@/stores/referenceData'
import { computed } from 'vue'

export function useCategories() {
  const store = useReferenceDataStore()

  return {
    categories: computed(() => store.categories),
    loading: computed(() => store.categories.length === 0),
    error: null,
  }
}
