import { useAuthStore } from '@/stores/auth'
import { useUserDataStore } from '@/stores/userData'

export function listingGuard(to) {
  const auth = useAuthStore()
  const userData = useUserDataStore()

  if (!auth.user?.can_list) {
    return { name: 'home' }
  }

  if (!userData.addresses.length) {
    return { name: 'home' }
  }
}
