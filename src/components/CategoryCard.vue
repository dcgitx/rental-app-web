<script setup>
import { RouterLink } from "vue-router";

defineProps({
    category: {
        type: Object,
        required: true,
    },
});
</script>

<template>
    <h3 class="sm:text-xl font-semibold text-gray-500 dark:text-gray-400 text-center mb-2">
        {{ category.category }}
        <span class="text-lg">({{ category.rental_items_count }})</span>
    </h3>

    <RouterLink :to="{
        name: 'rental-items',
        params: { slug: category.slug },
    }"
        class="flex flex-col gap-4 rounded-full items-center hover:cursor-pointer hover:bg-teal-100 hover:scale-105 transition-all ease-in-out duration-500">
        <img :src="category.cover_image" :alt="category.alt_cover_image"
            class="object-cover rounded-full h-24 w-24 sm:w-48 sm:h-48 xl:w-48 xl:h-48 hover:opacity-50 transition-all ease-in-out duration-200" />
    </RouterLink>
</template>
