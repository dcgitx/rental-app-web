<script setup>
import { EyeIcon } from '@heroicons/vue/24/outline';
import { RouterLink } from 'vue-router';

const props = defineProps({
    rentalId: Number
})

</script>

<template>
    <div>
        <RouterLink class="space-y-4 w-full pt-4" :to="{ name: 'rental.show', params: { id: rentalId } }">
            <button
                class="flex w-full items-center justify-center rounded-md border border-transparent bg-teal-600 px-2.5 py-2 text-sm font-medium text-white shadow-xs hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:outline-hidden sm:grow-0 transition-all ease-in-out duration-200">
                <EyeIcon class="size-5 mr-1" />
                View Details
            </button>
        </RouterLink>
    </div>
</template>