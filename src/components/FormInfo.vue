<script setup>
import InfoSvgIcon from "./InfoSvgIcon.vue";
</script>

<template>
    <div
        class="flex flex-row justify-center items-center gap-2 bg-teal-600/10 dark:text-gray-300 rounded-lg p-2 text-teal-700 font-normal italic tracking-medium text-center text-sm">
        <div>
            <InfoSvgIcon class="size-6" />
        </div>
        <slot />
    </div>
</template>
