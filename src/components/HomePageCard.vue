<script setup>
const props = defineProps({
    title: "",
});
</script>

<template>
    <div
        class="border p-2 rounded-xl bg-white dark:bg-inherit dark:border-gray-500"
    >
        <h3 class="text-xl font-semibold text-gray-500 dark:text-gray-400">
            {{ title }}
        </h3>
        <p class="text-md text-teal-600">
            <slot />
        </p>
    </div>
</template>
