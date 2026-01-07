<script setup>
import WarningSvgIcon from './WarningSvgIcon.vue';


</script>

<template>
    <div
        class="flex flex-row justify-center items-center gap-2 bg-yellow-100 dark:bg-yellow-300/20 dark:text-gray-300 rounded-lg p-2 text-center text-sm mt-4">
        <div>
            <WarningSvgIcon class="size-6" />
        </div>
        <slot />
    </div>
</template>
