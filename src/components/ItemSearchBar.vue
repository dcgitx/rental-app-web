<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import debounce from "lodash/debounce";
import { MagnifyingGlassIcon } from "@heroicons/vue/24/outline";

defineProps({
    placeholder: {
        type: String,
        default: "Search…",
    },
});

const router = useRouter();
const searchText = ref("");

// Debounced API search
const performSearch = debounce(async (value) => {
    if (!value || value.length < 2) return;

    const { data } = await axios.get("/api/items-search", {
        params: { q: value },
    });

    if (data.results?.length) {
        router.push({
            name: "search-results",
            query: { q: value },
        });
    }
}, 400);

// Watch input
watch(searchText, (value) => {
    performSearch(value);
});
</script>

<template>
    <div class="text-gray-600 dark:text-gray-300
           flex flex-row items-center
           w-full rounded-2xl mb-6
           bg-teal-600/80 pl-2">
        <label for="search" class="sr-only">Search</label>

        <MagnifyingGlassIcon class="size-10 pointer-events-none pr-2 mx-2 text-white" aria-hidden="true" />

        <input id="search" v-model="searchText" :placeholder="placeholder" type="text" name="search" class="w-full text-lg rounded-r-2xl pl-2
             border border-teal-600/30
             sm:py-3
             text-gray-900
             placeholder-gray-500 placeholder:text-lg
             focus:border-white
             dark:focus:border-gray-700
             focus:outline-none focus:ring-0
             dark:bg-gray-800" />
    </div>
</template>
