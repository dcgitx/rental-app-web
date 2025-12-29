import * as Ably from 'ably'

let client = null

export function useMessaging() {
  function connect() {
    if (client) return client

    const token = localStorage.getItem('token')

    client = new Ably.Realtime({
      authUrl: `${import.meta.env.VITE_API_BASE_URL}/ably/auth`,
      authMethod: 'GET',
      authHeaders: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
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
