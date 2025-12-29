import axios from 'axios'

export function useConversations() {
  async function fetchConversations() {
    try {
      const { data } = await axios.get('/conversations')
      return data
    } catch (e) {
      console.error('Error loading conversations', e)
      return []
    }
  }

  return { fetchConversations }
}
