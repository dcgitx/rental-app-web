<script setup>
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import SidePanelContainer from '@/components/SidePanelContainer.vue';
import ChatContainer from '@/views/chats/ChatContainer.vue';
import { usePresence } from '@/composables/usePresence'
import { usePanelStore } from '@/composables/usePanelStore';

import TheFooter from "@/components/TheFooter.vue";
import TheHeader from '@/components/TheHeader.vue';

const auth = useAuthStore();
const { activePanel, closePanel } = usePanelStore();

//usePresence(5, 10);

onMounted(() => {
  auth.fetchUser()
})

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
