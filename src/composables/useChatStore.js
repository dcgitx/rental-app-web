import api from '@/lib/api'
import { reactive, computed } from 'vue'
import { useRentalMessaging } from '@/composables/useRentalMessaging'
import { useAuthStore } from '@/stores/auth'
import { useMessaging } from './useMessaging'

const state = reactive({
  chats: [],
  openChats: [],
  showList: false,
  hasUnread: false,

  // internals
  _subscribed: new Set(),
  _userSubscribed: false,
  _subscribedExisting: false,
})

export function useChatStore() {
  const auth = useAuthStore()
  const user = computed(() => auth.user)
  const { connect } = useMessaging()
  const { openConversation, sendMessage } = useRentalMessaging()

  // -------------------------------------------------
  // Helpers
  // -------------------------------------------------

  async function checkUnread() {
    try {
      const { data } = await api.get('/has-unread')

      const freshHasUnread = !!data.has_unread
      state.hasUnread = freshHasUnread

      if (!freshHasUnread) {
        state.chats.forEach((c) => (c.unread_count = 0))
      }
    } catch (e) {
      console.error('Error checking unread:', e)
    }
  }

  function toggleMinimize(conversationId) {
    const chat = state.chats.find((c) => c.id === conversationId)
    if (chat) {
      chat.minimized = !chat.minimized
      markAsRead(chat.id)
    }
  }

  function ensureSubscribed(conversationId) {
    if (!conversationId || state._subscribed.has(conversationId)) return
    if (!user.value?.id) return

    const ably = connect()
    const channel = ably.channels.get(`private-conversation.${conversationId}`)

    channel.subscribe('MessageSent', (msg) => {
      const event = msg.data
      const currentUserId = user.value.id

      let chat = state.chats.find((c) => c.id === conversationId)

      if (!chat) {
        chat = {
          ...event.conversation,
          messages: [event.message],
          unread_count: 0,
        }
        state.chats.push(chat)
      } else {
        chat.messages.push(event.message)
      }

      if (event.message.sender_id !== currentUserId) {
        const isOpen = state.openChats.some((c) => c?.id === conversationId)

        if (!isOpen) {
          chat.unread_count = (chat.unread_count || 0) + 1
        }

        state.hasUnread = state.chats.some(
          (c) => (c.unread_count || 0) > 0 && !state.openChats.find((o) => o.id === c.id),
        )
      }
    })

    state._subscribed.add(conversationId)
  }

  function ensureSubscribedMany(ids = []) {
    ids.forEach((id) => ensureSubscribed(id))
  }

  // -------------------------------------------------
  // Subscriptions (Echo)
  // -------------------------------------------------

  function subscribeUserChannel() {
    if (state._userSubscribed || !user.value?.id) return

    const ably = connect()
    const userId = user.value.id

    const channel = ably.channels.get(`private-App.Models.User.${userId}`)

    channel.subscribe('ConversationCreated', (msg) => {
      const event = msg.data

      ensureSubscribed(event.conversation.id)

      if (!state.chats.find((c) => c.id === event.conversation.id)) {
        state.chats.push({
          ...event.conversation,
          messages: [],
          unread_count: 0,
        })
      }
    })

    state._userSubscribed = true
  }

  async function subscribeExisting() {
    if (state._subscribedExisting) return

    try {
      const { data } = await api.get('/conversations')

      data.forEach((c) => {
        if (!state.chats.find((chat) => chat.id === c.id)) {
          state.chats.push({
            ...c,
            messages: c.messages || [],
            unread_count: c.unread_count || 0,
          })
        }
        ensureSubscribed(c.id)
      })

      state._subscribedExisting = true
    } catch (e) {
      console.error('Failed to fetch conversations:', e)
    }
  }

  // -------------------------------------------------
  // Core Actions
  // -------------------------------------------------

  async function open(rentalId) {
    try {
      const data = await openConversation(rentalId)
      if (!data || !data.conversation) return

      let chat = state.chats.find((c) => c.id === data.conversation.id)

      if (!chat) {
        chat = {
          ...data.conversation,
          messages: data.messages || [],
          minimized: false,
          unread_count: data.conversation.unread_count ?? 0,
        }
        state.chats.push(chat)
      } else {
        // refresh messages reactively
        chat.messages.splice(0, chat.messages.length, ...(data.messages || []))
      }

      // make sure we’re listening for incoming messages
      ensureSubscribed(chat.id)

      // if you’re storing per-chat minimized on the object, un-minimize on open
      if (chat.minimized) chat.minimized = false

      // show the window if it’s not already visible
      if (chat.id && !state.openChats.some((c) => c?.id === chat.id)) {
        state.openChats.push(chat)
      }

      // ✅ Optimistically mark as read immediately (no waiting)
      if (chat.unread_count > 0) {
        chat.unread_count = 0 // instantly clear local unread
        state.hasUnread = state.chats.some((c) => (c.unread_count || 0) > 0)

        // fire-and-forget backend call (no await)
        markAsRead(chat.id)
      }

      return chat
    } catch (error) {
      console.error('Error opening conversation:', error)
    }
  }

  async function send(conversationId, body, rentalId = null) {
    try {
      const data = await sendMessage(conversationId, body, rentalId)

      if (data?.message) {
        let chat = state.chats.find((c) => c.id === data.message.conversation_id)

        if (!chat && data.conversation) {
          chat = { ...data.conversation, messages: [] }
          state.chats.push(chat)
        }

        if (chat) {
          chat.messages.push(data.message)
        }
      }
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  async function markAsRead(conversationId) {
    try {
      await api.post(`/conversations/${conversationId}/mark-read`)

      const chat = state.chats.find((c) => c.id === conversationId)
      if (chat) {
        chat.unread_count = 0
        chat._unreadWhileMinimized = false
      }

      state.hasUnread = state.chats.some((c) => (c.unread_count || 0) > 0)
    } catch (e) {
      console.error('Error marking as read:', e)
    }
  }

  // -------------------------------------------------
  // UI Actions
  // -------------------------------------------------

  function toggleChatList() {
    state.showList = !state.showList
  }

  function close(conversationId) {
    const index = state.openChats.findIndex((c) => c && c.id === conversationId)

    const chat = state.chats.find((c) => c.id === conversationId)

    if (!chat) return

    // If chat was open (not minimized), mark as read on close
    if (!chat.minimized) {
      markAsRead(chat.id)
    } else if (chat.unread_count > 0) {
      // Otherwise, keep unread flag if minimized
      state.hasUnread = true
    }

    if (index !== -1) {
      state.openChats.splice(index, 1)
    }
  }

  return {
    toggleChatList,
    checkUnread,
    markAsRead,
    toggleMinimize,
    subscribeUserChannel,
    subscribeExisting,
    ensureSubscribed,
    ensureSubscribedMany,
    open,
    send,
    close,

    get hasUnread() {
      return state.chats.some((chat) => {
        const isOpen = state.openChats.some((o) => o?.id === chat.id)
        return !isOpen && (chat.unread_count || 0) > 0
      })
    },

    openChats: state.openChats,
  }
}
