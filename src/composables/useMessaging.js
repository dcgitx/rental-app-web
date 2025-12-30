import Ably from 'ably'

let client = null

export function useMessaging() {
  function connect() {
    if (client) return client

    client = new Ably.Realtime({
      authUrl: `${import.meta.env.VITE_API_BASE_URL}/ably/auth`,
      authMethod: 'GET',
      withCredentials: true,
      authHeaders: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'X-Requested-With': 'XMLHttpRequest',
      },
    })

    return client
  }

  function disconnect() {
    try {
      client?.close()
    } catch {}
    client = null
  }

  return { connect, disconnect }
}
