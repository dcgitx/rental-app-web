<script setup>
import { RouterView } from 'vue-router'

import TheFooter from "@/components/TheFooter.vue";
import TheHeader from './components/TheHeader.vue';
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
