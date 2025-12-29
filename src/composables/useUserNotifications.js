import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

import api from '@/lib/api'
import { useAuthStore } from '@/stores/auth'
import { useMessaging } from '@/composables/useMessaging'

export function useUserNotifications() {
  const auth = useAuthStore()
  const user = computed(() => auth.user)

  const { connect } = useMessaging()
  const router = useRouter()

  const hasUnread = ref(false)
  const notifications = ref([])

  // --------------------------------
  // HTTP
  // --------------------------------

  async function fetchNotifications() {
    try {
      const { data } = await api.get('/notifications')
      return data
    } catch (e) {
      if (e.response?.status === 401) {
        router.push({ name: 'login' })
        return []
      }
      console.error('Error loading notifications', e)
      return []
    }
  }

  // --------------------------------
  // Realtime (Ably)
  // --------------------------------

  function subscribe() {
    if (!user.value?.id) return

    const ably = connect()
    const channel = ably.channels.get(`private-notifications.${user.value.id}`)

    const events = [
      'RentalRequested',
      'RentalDeclined',
      'RentalExpired',
      'RentalBooked',
      'RentalCompleted',
      'ListerCancelled',
      'RenterCancelled',
    ]

    events.forEach((eventName) => {
      channel.subscribe(eventName, (msg) => {
        hasUnread.value = true
        notifications.value.unshift(msg.data)
      })
    })
  }

  function markAsRead() {
    hasUnread.value = false
  }

  return {
    hasUnread,
    notifications,
    subscribe,
    markAsRead,
    fetchNotifications,
  }
}
