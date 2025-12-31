<script setup>
import FavouritesPanel from "./FavouritesPanel.vue";
import ChatPanel from "./ChatPanel.vue";
import NotificationsPanel from "./NotificationsPanel.vue";
import { XMarkIcon } from "@heroicons/vue/24/outline";

defineProps({
    activePanel: String,
});
</script>

<style>
.slide-enter-active,
.slide-leave-active {
    transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
    transform: translateX(100%);
}
</style>

<template>
    <transition name="slide">
        <div v-if="activePanel" class="absolute right-0 min-w-80 w-auto bg-white dark:bg-gray-800 shadow-lg z-50">
            <button class=" absolute top-2 right-2 text-teal-700 font-semibold hover:text-teal-600 flex"
                @click="$emit('close')">
                <XMarkIcon class="size-5 dark:text-black" />
                <span class="text-sm font-light text-center dark:text-black">close</span>
            </button>

            <div v-if="activePanel === 'favourites'">
                <h1
                    class="px-2 py-2 border-b border-teal-600 bg-teal-600/20 dark:bg-teal-600 font-semibold dark:text-gray-800">
                    Your Favourites
                </h1>
                <FavouritesPanel />
            </div>

            <div v-else-if="activePanel === 'chat'">
                <h1
                    class="px-2 py-2 border-b border-teal-600 bg-teal-600/20 dark:bg-teal-600 font-semibold dark:text-gray-900">
                    Your Chats
                </h1>
                <ChatPanel />
            </div>

            <div v-else-if="activePanel === 'notifications'">
                <h1 class="px-2 py-2 border-b border-teal-600 bg-teal-600/20 font-semibold">
                    Your Notifications
                </h1>
                <NotificationsPanel v-once />
            </div>
        </div>
    </transition>
</template>
