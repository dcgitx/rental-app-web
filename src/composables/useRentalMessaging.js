import api from '@/lib/api'

export function useRentalMessaging() {
  async function openConversation(rentalId) {
    try {
      const { data } = await api.post(`/rentals/${rentalId}/conversations`)
      return data
    } catch (error) {
      console.error('Error opening conversation:', error)
    }
  }

  async function sendMessage(conversationId, body) {
    try {
      const { data } = await api.post(`/conversations/${conversationId}/messages`, { body })
      return data
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  return { openConversation, sendMessage }
}
