<script setup>
import { fetchTerms } from '@/api/terms'
import LoadingState from '@/components/LoadingState.vue'
import { onMounted, ref, computed } from 'vue'

const path = ref(null)
const loading = ref(true)

const backendUrl = import.meta.env.VITE_BACKEND_URL

const pdfUrl = computed(() => {
  if (!path.value) return null
  return `${backendUrl}/storage/${path.value}`
})

onMounted(async () => {
  try {
    const res = await fetchTerms()
    path.value = res.data.path
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <LoadingState v-if="loading" />

  <div v-else class="w-full">
    <iframe v-if="pdfUrl" :src="pdfUrl" class="w-full min-h-screen" type="application/pdf" />
  </div>
</template>
