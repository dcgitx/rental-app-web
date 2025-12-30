<script setup>
import { ref, watch, nextTick, computed, onMounted, onUnmounted } from "vue";
import { formatDate } from "@/lib/date";
import { useChatStore } from "@/composables/useChatStore";
import {
    MinusIcon,
    XMarkIcon,
    PaperAirplaneIcon,
} from "@heroicons/vue/24/outline";
import { useAuthStore } from "@/stores/auth";

const props = defineProps({
    conversation: {
        type: Object,
        required: true,
    },
});

const emit = defineEmits(["close", "send"]);

const auth = useAuthStore();
const chat = useChatStore();
const newMessage = ref("");
const textarea = ref(null);
const messagesContainer = ref(null);
const atBottom = ref(true);
const showNewMessageButton = ref(false);
const timeTicker = ref(0);

let timeInterval = null;

onMounted(() => {
    // update every 60s
    timeInterval = setInterval(() => {
        timeTicker.value++;
    }, 60 * 1000);
});

onUnmounted(() => {
    clearInterval(timeInterval);
});

const relativeTime = (date, _tick) => {
    if (!date) return "";
    return formatDate(date, "relative");
};

const minimized = computed({
    get: () => props.conversation.minimized ?? false,
    set: (val) => {
        props.conversation.minimized = val;
    },
});

function autoResize() {
    const el = textarea.value;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
}

function handleSend() {
    if (!newMessage.value.trim()) return;

    emit(
        "send",
        props.conversation.id || null,
        newMessage.value,
        props.conversation.rental_id,
    );

    newMessage.value = "";

    const el = textarea.value;
    if (el) {
        el.style.height = "auto";
    }

    scrollToBottom("smooth");
}

function isNearBottom(el, px = 200) {
    return el.scrollHeight - el.scrollTop - el.clientHeight < px;
}

function scrollToBottom(behavior = "auto") {
    const el = messagesContainer.value;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior });
}

function onScroll() {
    const el = messagesContainer.value;
    if (!el) return;
    atBottom.value = isNearBottom(el);

    if (atBottom.value) {
        showNewMessageButton.value = false;
        chat.markAsRead(props.conversation.id);
    }
}

function jumpToBottom() {
    scrollToBottom("smooth");
    showNewMessageButton.value = false;
}

watch(
    () => props.conversation.messages?.length,
    async (newLen, oldLen) => {
        if (oldLen !== undefined && newLen > oldLen && minimized.value) {
            props.conversation.unread_count =
                (props.conversation.unread_count || 0) + 1;
            return;
        }

        await nextTick();
        const el = messagesContainer.value;
        if (!el || minimized.value) return;
        if (oldLen === undefined) {
            scrollToBottom("auto");
        } else if (atBottom.value) {
            scrollToBottom("smooth");
        } else {
            showNewMessageButton.value = true;
        }
        if (!minimized.value && atBottom.value) {
            chat.markAsRead(props.conversation.id);
        }
    },
    { immediate: true },
);

let initialized = false;

watch(minimized, async (newVal) => {
    if (!initialized) {
        initialized = true;
        return;
    }
    if (!newVal) {
        await nextTick();
        scrollToBottom("auto");

        props.conversation.unread_count = 0;
        props.conversation._unreadWhileMinimized = false;

        chat.markAsRead(props.conversation.id);
    }
});
</script>

<template>
    <div class="flex w-80 flex-col rounded-t-lg bg-white dark:bg-gray-800 shadow-lg">
        <!-- Header -->
        <div
            class="flex items-center justify-between rounded-t-lg bg-gradient-to-r from-teal-600 to-teal-800 px-3 py-2 text-white">
            <div @click="minimized = !minimized" class="flex flex-col">
                <div v-if="conversation.unread_count > 0"
                    class="-ml-4 -mt-4 h-4 w-4 animate-pulse rounded-full bg-red-500 px-0.5 text-center text-xs">
                    {{ conversation.unread_count }}
                </div>
                <div>
                    Chat with:
                    {{
                        conversation.renter.id === auth.user.id
                            ? conversation.lister.username
                            : conversation.renter.username
                    }}
                </div>

                <div class="text-sm">
                    Rental Id: #{{ conversation.rental_id ?? "Unknown" }}
                </div>
            </div>

            <div>
                <button @click="chat.toggleMinimize(props.conversation.id)" class="pr-2 text-white hover:text-gray-200">
                    <MinusIcon class="size-5 stroke-2" />
                </button>

                <button @click="emit('close', conversation.id)" class="text-white hover:text-gray-200">
                    <XMarkIcon class="size-5 stroke-2" />
                </button>
            </div>
        </div>

        <!-- messages container-->
        <div v-if="!minimized" class="flex max-h-[32rem] flex-1 flex-col">
            <!-- Messages -->
            <div ref="messagesContainer" @scroll="onScroll"
                class="z-100 min-h-60 flex-1 space-y-4 overflow-y-auto bg-white dark:bg-black p-2">
                <div v-for="(msg, idx) in conversation.messages || []" :key="idx" class="flex w-full" :class="msg.sender_id === auth.user.id
                    ? 'justify-end'
                    : 'justify-start'
                    ">
                    <!-- Received message -->
                    <div v-if="msg.sender_id !== auth.user.id" class="flex items-start">
                        <!-- Avatar -->
                        <div v-if="msg.sender.avatar" class="-mt-2 -mr-1 z-20">
                            <img :src="msg.sender.avatar" alt="user_avatar"
                                class="h-8 w-8 flex-shrink-0 rounded-full" />
                        </div>
                        <div v-else class="h-8 w-8 flex-shrink-0 rounded-full bg-gray-400"></div>
                        <div
                            class="flex max-w-48 flex-col whitespace-pre-wrap break-words rounded-b-xl rounded-tr-2xl bg-gray-200 dark:bg-gray-300 p-2 text-gray-800">
                            <span class="text-sm">{{ msg.body }}</span>
                            <span class="mt-2 text-xs text-gray-600 dark:text-gray-800">{{
                                relativeTime(msg.created_at, timeTicker)
                                }}</span>
                        </div>
                    </div>

                    <!-- Sent message -->
                    <div v-else class="flex items-end">
                        <!-- Avatar -->
                        <div class="place-self-start -mt-2 -mr-1 z-20">

                            <div v-if="msg.sender.avatar">
                                <img :src="msg.sender.avatar" alt="user_avatar"
                                    class="h-8 w-8 flex-shrink-0 rounded-full" />
                            </div>
                            <div v-else
                                class="h-8 w-8 flex justify-center items-center rounded-full bg-gray-300 font-bold uppercase">
                                {{ auth.user.username[0] }}</div>
                        </div>
                        <div
                            class="flex max-w-48 flex-col whitespace-pre-wrap text-wrap break-words rounded-t-xl rounded-bl-2xl bg-teal-600/40 dark:bg-teal-600 p-2 text-gray-800 dark:text-gray-900">
                            <span class="text-sm">{{ msg.body }}</span>
                            <span class="mt-2 text-xs text-gray-600 dark:text-gray-300">{{
                                relativeTime(msg.created_at, timeTicker)
                                }}</span>
                        </div>
                    </div>
                </div>
                <!-- New messages button -->
                <button v-if="showNewMessageButton" @click="jumpToBottom"
                    class="relative bottom-12 right-4 rounded-full bg-teal-600 p-2 text-xs tracking-wide text-gray-50 hover:bg-teal-700">
                    New messages ↓
                </button>
            </div>

            <form class="flex w-full flex-col p-2" @submit.prevent="handleSend">
                <!-- New messages button -->
                <div v-if="showNewMessageButton"
                    class="mb-1 flex w-auto animate-pulse flex-row items-center justify-center place-self-center rounded-xl bg-teal-600/20 p-2 hover:bg-teal-600/30">
                    <button @click="jumpToBottom" class="text-xs tracking-wide">
                        New messages ↓
                    </button>
                </div>

                <!-- Input & Button Row -->
                <div class="flex items-end gap-2">
                    <textarea ref="textarea" v-model="newMessage" rows="1" @input="autoResize"
                        @keyup.enter.exact.prevent="handleSend" placeholder="Type a message..."
                        class="flex-grow resize-none overflow-hidden rounded-xl border border-gray-300 bg-gray-100 dark:bg-black text-sm text-gray-800 dark:text-gray-200 focus:border-gray-300 focus:outline-none focus:ring-0 p-2"></textarea>

                    <button v-if="newMessage" type="submit" class="text-teal-600 self-end mb-1">
                        <PaperAirplaneIcon class="size-5 hover:text-teal-600/50" />
                    </button>
                </div>
            </form>

        </div>
    </div>
</template>
