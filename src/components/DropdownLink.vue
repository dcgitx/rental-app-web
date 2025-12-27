<script setup>
import { RouterLink } from 'vue-router'

defineProps({
    to: {
        type: [String, Object],
        default: null,
    },
})
</script>

<template>
    <component :is="to ? RouterLink : 'button'" v-bind="to ? { to } : {}"
        class="block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out z-100"
        type="button">
        <slot />
    </component>
</template>
