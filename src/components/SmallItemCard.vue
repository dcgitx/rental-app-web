<script setup>
import ItemStarRating from "./ItemStarRating.vue";

const props = defineProps({
    item: Object,
});
</script>

<template>
    <div class="flex flex-row items-start w-full">

        <!--image-->
        <div class="border-r border-teal-600 pr-2">
            <div>
                <img :src="item.image.src" :alt="item.image.alt"
                    class="rounded-lg object-fit size-20 flex-none max-w-20 max-h-20" />
            </div>
        </div>

        <div class="px-2">
            <!-- Product info -->
            <div class="px-4 sm:px-0 lg:mt-0 w-full flex flex-col items-start text-gray-800 dark:text-gray-200">
                <h1 class="text-lg font-bold tracking-tight w-full truncate text-wrap">
                    {{ item.title }}
                </h1>
                <!-- Review Stars -->
                <ItemStarRating :star_rating="item?.item_rating" />
            </div>
        </div>
    </div>
</template>
