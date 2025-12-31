<script setup>
</script>

<template>
    <button
        class="flex w-full items-center justify-center rounded-md border border-red-300 dark:border-0 bg-white dark:bg-red-500 px-2.5 py-2 text-sm font-medium text-red-500 dark:text-red-100 shadow-xs hover:bg-red-100 dark:hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-hidden sm:grow-0 transition-all ease-in-out duration-200">
        <slot />
    </button>
</template>