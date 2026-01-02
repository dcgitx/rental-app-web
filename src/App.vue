<script setup>
import { RouterView } from 'vue-router';
import { onMounted, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useReferenceDataStore } from '@/stores/referenceData';
import { usePanelStore } from '@/composables/usePanelStore';

import SidePanelContainer from '@/components/SidePanelContainer.vue';
import ChatContainer from '@/views/chats/ChatContainer.vue';
import TheFooter from "@/components/TheFooter.vue";
import TheHeader from '@/components/TheHeader.vue';
import { useUserDataStore } from './stores/userData';

const auth = useAuthStore();
const userData = useUserDataStore()
const { activePanel, closePanel } = usePanelStore();

onMounted(() => {
  const refStore = useReferenceDataStore()
  refStore.preload()
  auth.fetchUser()
})

watch(
  () => auth.user,
  (user) => {
    if (user) {
      userData.fetchAddresses()
    } else {
      userData.reset()
    }
  },
  { immediate: true }
)

</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
    <!-- HEADER -->
    <TheHeader />
    <ChatContainer v-if="auth.user" class="z-[9999]" />

    <!-- PAGE CONTENT -->
    <main class="flex-1 min-h-[70vh]">
      <SidePanelContainer class="" v-if="auth.user" :activePanel="activePanel" @close="closePanel" />
      <RouterView />
    </main>

    <!-- FOOTER -->
    <TheFooter />
  </div>
</template>
