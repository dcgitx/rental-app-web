<script setup>
import { MagnifyingGlassIcon } from "@heroicons/vue/24/outline";
import { router } from "@inertiajs/core";
import { watch, ref } from "vue";

const props = defineProps({
    href: String,
    placeholder: String,
});

const searchText = ref("");

watch([searchText], () => {
    router.visit(props.href, {
        data: {
            searchText: searchText.value,
        },
        preserveState: true,
        preserveScroll: true,
    });
});
</script>

<template>
    <div
        class="text-gray-400 flex flex-row justify-start items-center w-1/2 dark:bg-gray-800 rounded-lg bg-teal-600/70 pl-2"
    >
        <label for="search" class="sr-only">Search</label>
        <MagnifyingGlassIcon
            class="size-8 pointer-events-none pr-2 text-white"
            aria-hidden="true"
        />

        <input
            id="search"
            class="w-full rounded-r-lg border border-gray-200 dark:border-gray-800 focus-within:text-gray-600 bg-none dark:bg-black flex justify-center items-center pr-3 leading-5 text-gray-900 dark:text-gray-300 placeholder-gray-400 placeholder:text-md focus:border-white dark:focus:border-gray-500 focus:outline-none focus:ring-0 sm:text-sm"
            :placeholder="placeholder"
            type="text"
            name="search"
            v-model="searchText"
        />
    </div>
</template>
