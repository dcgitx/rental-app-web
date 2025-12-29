<script setup>
import { RouterView } from 'vue-router'

import TheFooter from "@/components/TheFooter.vue";
import TheHeader from './components/TheHeader.vue';
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

/*onMounted(() => {
  auth.fetchUser()
})*/

onMounted(() => {
  if (localStorage.getItem('token')) {
    auth.fetchUser()
  } else {
    auth.loaded = true
  }
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
    <!-- HEADER -->
    <TheHeader />

    <!-- PAGE CONTENT -->
    <main class="flex-1 min-h-[70vh]">
      <RouterView />
    </main>

    <!-- FOOTER -->
    <TheFooter />
  </div>
</template>
