<script setup>
const props = defineProps({
    title: ""
})
</script>

<template>
    <div class="flex items-center justify-center py-12 text-gray-500 text-2xl">
        <span class="animate-pulse">{{ title ?? 'Loading' }}...</span>
    </div>
</template>
