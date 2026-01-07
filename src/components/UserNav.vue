<script setup>
import { watch, computed } from "vue";
import { RouterLink } from "vue-router";

import { useAuthStore } from "@/stores/auth";
import { useChatStore } from "@/composables/useChatStore";
import { usePanelStore } from "@/composables/usePanelStore";
import { useMessaging } from "@/composables/useMessaging";
import { useUserNotifications } from "@/composables/useUserNotifications";
import {
    BellIcon,
    ChatBubbleLeftIcon,
    HeartIcon,
} from "@heroicons/vue/24/outline";

const auth = useAuthStore();
const { togglePanel } = usePanelStore();
const chat = useChatStore();
const messaging = useMessaging();
const notifications = useUserNotifications();

const user = computed(() => auth.user);

watch(() => notifications.hasUnread.value, (val) => {
    console.log("UserNav sees hasUnread change:", val);
});

watch(
    () => auth.loaded,
    (loaded) => {
        if (!loaded || !auth.user) return

        messaging.connect()
        chat.subscribeUserChannel()
        chat.subscribeExisting()
        chat.checkUnread()
        notifications.subscribe()
    },
    { immediate: true }
)

function openNotifications() {
    notifications.markAsRead();
    togglePanel("notifications");
}
</script>

<template>
    <div v-if="user" class="hidden w-full border-b bg-white py-3 lg:block dark:border-gray-700 dark:bg-gray-800">
        <div class="w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between gap-6">
                <div class="flex w-full items-center gap-6"></div>

                <!-- Left Section: Main Navigation -->
                <nav class="flex items-center gap-1 w-full">
                    <RouterLink v-if="user.can_rent"
                        class="relative px-4 py-2 text-sm font-medium text-gray-700 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:text-teal-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-teal-400"
                        to="/rentals">
                        Your Rentals
                    </RouterLink>

                    <RouterLink v-if="!user.can_list && user.can_rent"
                        class="px-4 py-2 text-sm font-medium text-gray-700 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:text-teal-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-teal-400"
                        to="/profile">
                        {{ $t("Complete Your Profile to begin listing") }}
                    </RouterLink>

                    <RouterLink v-if="!user.can_rent && !user.can_list"
                        class="px-4 py-2 text-sm font-medium text-gray-700 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:text-teal-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-teal-400"
                        to="/profile">
                        {{ $t("Complete Your Profile to begin listing and renting!") }}
                    </RouterLink>

                    <RouterLink v-if="user.can_list"
                        class="px-4 py-2 text-sm font-medium text-gray-700 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:text-teal-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-teal-400"
                        to="/rentalItems">
                        Your Listings
                    </RouterLink>

                    <RouterLink v-if="user.can_list"
                        class="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg transition-all duration-200 hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-700"
                        to="/lister/rental-items/create">
                        {{ $t("List a new Item") }}
                    </RouterLink>
                </nav>

                <!-- Right Section: Slide outs -->
                <div class="flex items-center gap-1">

                    <!-- Favourites -->
                    <button @click="togglePanel('favourites')"
                        class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:text-teal-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-teal-400">
                        <HeartIcon class="w-5 h-5" aria-hidden="true" />
                        <span>Favourites</span>
                    </button>

                    <!-- Chats -->
                    <button @click="togglePanel('chat')"
                        class="relative flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:text-teal-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-teal-400">
                        <ChatBubbleLeftIcon class="w-5 h-5" />
                        <span>Chat</span>
                        <span v-if="chat.hasUnread"
                            class="absolute top-1.5 left-2.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-0 ring-white dark:ring-gray-800"></span>
                    </button>

                    <!-- Notifications -->
                    <button @click="openNotifications"
                        class="relative flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:text-teal-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-teal-400">
                        <BellIcon class="w-5 h-5" />
                        <span>Notifications</span>
                        <span v-if="notifications.hasUnread.value === true"
                            class="absolute top-1.5 left-3.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-0"></span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
