<script setup>
import { deleteFavourite, fetchFavourites } from '@/api/favourites';
import { onMounted, ref } from 'vue';

const favourites = ref([]);
const loading = ref(true);

onMounted(async () => {
    const { data } = await fetchFavourites();
    favourites.value = data;
    loading.value = false;
});

const remove = async (id) => {
    await deleteFavourite(id);
    favourites.value = favourites.value.filter(f => f.id !== id);
}
</script>

<template>
    <div class="p-2">
        <div v-if="loading" class="text-sm text-gray-500">Loading...</div>

        <ul v-else-if="favourites.length >= 1" class="divide-y divide-gray-200 dark:divide-black">
            <li v-for="fav in favourites" :key="fav.id"
                class="cursor-pointer py-3 hover:bg-gray-50 dark:hover:bg-transparent transition-all ease-in-out duration-200 p-1">

                <div class="flex flex-row items-center justify-between gap-2">

                    <img :src="fav.rental_item.image.src" :alt="fav.rental_item.image.alt"
                        class="size-10 flex-none rounded-md object-fit" />

                    <div class="flex flex-col items-start justify-start w-full">
                        <p class="font-semibold dark:text-gray-200">
                            {{ fav.rental_item.title }}
                        </p>
                        <p class="truncate text-sm text-gray-600 dark:text-gray-400 text-wrap">
                            {{ fav.rental_item.description }}
                        </p>
                    </div>

                    <div class="text-xs flex flex-col gap-2 items-end justify-start w-full">
                        <div class="text-gray-600 dark:text-gray-400">
                            added: {{ $formatDate(fav.created_at, "MMM Do YYYY")
                            }}</div>
                        <button @click="remove(fav.id)"
                            class="text-sm underline text-blue-500 hover:text-blue-700 dark:hover:text-blue-400">remove</button>
                    </div>
                </div>
            </li>
        </ul>
        <div v-else class="text-gray-600 dark:text-gray-400">
            You haven't added any favourites.
        </div>
    </div>
</template>
