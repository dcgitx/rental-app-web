<script setup>
import { ref, onMounted } from "vue";
import { useConversations } from "@/composables/useConversations";
import { useChatStore } from "@/composables/useChatStore";
import { usePanelStore } from "@/composables/usePanelStore";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
const conversations = ref([]);
const loading = ref(true);

const { fetchConversations } = useConversations();
const { closePanel } = usePanelStore();
const chat = useChatStore();

onMounted(async () => {
    conversations.value = await fetchConversations();

    chat.ensureSubscribedMany(conversations.value.map((c) => c.id));

    loading.value = false;
});

function openChat(conversation) {
    chat.open(conversation.rental_id);

    closePanel();
}
</script>

<template>
    <div class="p-2">
        <div v-if="loading" class="text-sm text-gray-500">Loading...</div>

        <ul v-else-if="conversations.length >= 1" class="divide-y divide-gray-200 dark:divide-black">
            <li v-for="c in conversations" :key="c.id"
                class="cursor-pointer py-3 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all ease-in-out duration-200 p-2"
                @click="openChat(c)">
                <div class="flex items-center justify-between">
                    <span class="font-semibold dark:text-gray-300">
                        {{
                            c.renter_id === auth.user.id
                                ? c.lister.username
                                : c.renter.username
                        }}<span v-if="c.unread_count > 0">
                            ({{ c.unread_count }})
                        </span>
                    </span>

                    <span class="text-xs text-gray-400">
                        {{
                            c.messages[0]?.created_at
                                ? $formatDate(
                                    c.messages[0].created_at,
                                    "MMM Do HH:mm",
                                )
                                : ""
                        }}
                    </span>
                </div>
                <p class="truncate text-sm text-gray-600 dark:text-gray-400">
                    Rental :#{{ c.rental_id }}
                </p>
                <p class="truncate text-sm text-gray-600 dark:text-gray-400">
                    {{ c.messages[0]?.body || "No messages yet..." }}
                </p>
            </li>
        </ul>
        <div v-else class="text-gray-600 dark:text-gray-400">
            You currently have no open chats.
        </div>
    </div>
</template>
