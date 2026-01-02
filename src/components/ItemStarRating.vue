<script setup>
import { StarIcon } from "@heroicons/vue/20/solid";

const props = defineProps({
    star_rating: 0,
});
</script>

<template>
    <div>
        <h3 class="sr-only">Reviews</h3>
        <div class="flex items-center">
            <div class="flex items-center">
                <StarIcon
                    v-for="rating in [0, 1, 2, 3, 4]"
                    :key="rating"
                    :class="[
                        star_rating > rating
                            ? 'text-yellow-400'
                            : 'text-gray-300/80',
                        'size-5 shrink-0',
                    ]"
                    aria-hidden="true"
                />
            </div>
            <p v-if="star_rating" class="text-sm pl-2 text-gray-600 sr-only">
                {{ star_rating }} out of 5 stars.
            </p>
            <p v-else class="text-sm pl-2 text-gray-600 sr-only">
                No ratings yet.
            </p>
        </div>
    </div>
</template>
