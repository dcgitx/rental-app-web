import { useAuthStore } from '@/stores/auth'

export function authGuard(to) {
  const auth = useAuthStore()

  if (!auth.isAuthenticated) {
    return { name: 'login' }
  }
}
