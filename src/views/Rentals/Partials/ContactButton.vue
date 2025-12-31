<script setup>
import { useChatStore } from "@/composables/useChatStore";
import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/vue/24/outline";

const props = defineProps({
    rentalId: Number,
});

const chat = useChatStore();
</script>

<template>
    <button @click="chat.open(rentalId)"
        class="flex w-full items-center justify-center rounded-md border border-transparent bg-teal-600 px-2.5 py-2 text-sm font-medium text-white shadow-xs hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:outline-hidden sm:grow-0 transition-all ease-in-out duration-200">
        <ChatBubbleOvalLeftEllipsisIcon class="size-5 mr-1" />
        <slot />
    </button>
</template>
