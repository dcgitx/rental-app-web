<script setup>
import { useChatStore } from "@/composables/useChatStore";
import ChatWindow from "./ChatWindow.vue";

const chat = useChatStore();
</script>

<template>
    <div class="fixed bottom-0 right-0 flex flex-row-reverse items-end gap-2">
        <ChatWindow v-for="conversation in chat.openChats" :key="conversation.id" :conversation="conversation"
            @close="chat.close" @send="
                (conversationId, body, rentalId) =>
                    chat.send(conversationId, body, rentalId)
            " />
    </div>
</template>
