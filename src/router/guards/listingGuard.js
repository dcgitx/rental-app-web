import { useAuthStore } from '@/stores/auth'
import { useUserDataStore } from '@/stores/userData'

export function listingGuard(to) {
  const auth = useAuthStore()
  const userData = useUserDataStore()

  if (!auth.user?.can_list) {
    return { name: 'home' }
  }

  if (!userData.loaded) {
    return null
  }

  return null

  /*if (!userData.addresses.length) {
    return { name: 'home' }
  }*/
}
