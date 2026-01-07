import { onMounted, onUnmounted } from 'vue'

export function useVisibilityRefresh(callback) {
  const handler = async () => {
    if (document.visibilityState === 'visible') {
      await callback()
    }
  }

  onMounted(() => {
    document.addEventListener('visibilitychange', handler)
  })

  onUnmounted(() => {
    document.removeEventListener('visibilitychange', handler)
  })
}
