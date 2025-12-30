<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/lib/api'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

onMounted(async () => {
    const code = new URLSearchParams(window.location.search).get('code')

    if (!code) {
        return
    }

    const { data } = await api.post('/auth/oauth/exchange', { code })

    localStorage.setItem('token', data.token)

    await authStore.fetchUser()

    router.replace({ name: 'home' })
})
</script>

<template>
    <div class="p-6 text-center">
        Signing you in…
    </div>
</template>
