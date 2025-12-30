import axios from 'axios'
import api from '@/lib/api'

export function useConversations() {
  async function fetchConversations() {
    try {
      const { data } = await api.get('/conversations')
      return data
    } catch (e) {
      console.error('Error loading conversations', e)
      return []
    }
  }

  return { fetchConversations }
}
