<script setup>
import api from "@/lib/api";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { usePanelStore } from "@/composables/usePanelStore";
import { useUserNotifications } from "@/composables/useUserNotifications";

const router = useRouter();
const loading = ref(true);
const notifications = ref([]);

const { fetchNotifications } = useUserNotifications();
const { closePanel } = usePanelStore();

onMounted(async () => {
    notifications.value = await fetchNotifications();

    loading.value = false;
});

function openNotification(notification) {
    api.post(`/notifications/${notification.id}/mark-read`)
        .then(() => {
            if (notification.redirect_url) {
                router.push(notification.redirect_url)
            }
            closePanel()
        })
        .catch((e) => console.error('Error marking as read:', e))
}
</script>

<template>
    <div class="p-2">
        <div v-if="loading" class="text-sm text-gray-500">Loading...</div>

        <ul v-else-if="notifications.length >= 1"
            class="divide-y divide-gray-200 dark:divide-black max-h-[60vh] overflow-y-auto">
            <li v-for="notification in notifications" :key="notification.id"
                class="cursor-pointer py-3 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all ease-in-out duration-200 p-1"
                @click="openNotification(notification)">
                <div class="flex flex-col items-start justify-between gap-2">
                    <div class="flex flex-col w-full">
                        <div class="font-semibold" :class="!notification.is_read ? '' : 'text-gray-500 text-sm'">
                            {{
                                notification.title
                            }}
                        </div>
                        <span class="text-xs text-gray-400">
                            {{
                                notification?.description
                            }}
                        </span>
                    </div>
                    <div class="flex flex-row w-full justify-end">
                        <div class="text-xs text-gray-400">
                            {{ $formatDate(
                                notification.created_at,
                                "MMM Do HH:mm"
                            )
                            }}
                        </div>
                    </div>
                </div>
            </li>
        </ul>
        <div v-else class="text-gray-600 dark:text-gray-400">
            You have no notifications.
        </div>
    </div>
</template>
