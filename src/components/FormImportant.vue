<script setup>
import ImportantSvgIcon from "./ImportantSvgIcon.vue";
</script>

<template>
    <div
        class="flex flex-row justify-center items-center gap-2 bg-red-100 dark:bg-red-700/80 dark:text-gray-200 rounded-lg p-2 text-app-600 text-center text-sm mt-4"
    >
        <div>
            <ImportantSvgIcon class="size-6" />
        </div>
        <slot />
    </div>
</template>
