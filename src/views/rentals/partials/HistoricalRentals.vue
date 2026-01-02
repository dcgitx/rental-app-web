<script setup>
import { ref } from "vue";

const props = defineProps({
    listerRentals: Array,
    renterRentals: Array,
});

const activeTabIndex = ref(0);
const loading = ref(false);

const tabs = [
    { title: 'Your Items' },
    { title: 'Your Rentals' },
];
</script>

<template>
    <div>
        <!--tabs-->
        <div class="w-full flex justify-center">
            <div class="bg-gray-50 dark:bg-transparent rounded-t-lg">
                <div class="flex flex-row justify-center items-center text-md font-semibold gap-0">
                    <div v-for="(tab, index) in tabs" :key="index"
                        class="w-32 text-center rounded-t-lg border-gray-500 dark:bg-gray-800 py-2 dark:text-gray-400 transition-all ease-in-out duration-200 hover:cursor-pointer"
                        @click="activeTabIndex = index"
                        :class="{ 'is-active': activeTabIndex === index, 'bg-teal-600/30 dark:bg-teal-600/80 dark:text-gray-100': activeTabIndex === index }">
                        {{
                            tab.title }}</div>
                </div>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center p-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>

        <div v-else>
            <!--History for this users items-->
            <div v-show="activeTabIndex === 0" class="border-t border-gray-400 p-4 mb-4 sm:mb-12 w-full">
                <div v-if="listerRentals.length >= 1" class="flex flex-row flex-wrap gap-4 justify-center w-full">
                    <section v-for="rental in listerRentals" :key="rental.id" :aria-labelledby="`${rental.id}-heading`"
                        class="shadow-lg rounded-lg border p-4 bg-gray-50 dark:border-gray-500 opacity-75 hover:opacity-100 transition-opacity">
                        <RouterLink :to="{ name: 'rental.show', params: { id: rental.id } }" as="div"
                            class="hover:cursor-pointer">
                            <div class=" space-y-1 md:flex md:items-baseline md:space-y-0 md:space-x-4 pt-2">
                                <h2 :id="`${rental.id}-heading`" class="text-lg font-medium md:shrink-0">
                                    Rental #{{ rental.id }}
                                </h2>
                                <div
                                    class="space-y-2 sm:flex sm:items-baseline sm:justify-between sm:space-y-0 md:min-w-0 md:flex-1">
                                    <span
                                        class="px-2 py-1 text-xs font-semibold rounded-full bg-gray-200 dark:bg-gray-700">
                                        {{ rental.status }}
                                    </span>
                                    <div>
                                        <span class="font-semibold">Item:</span>
                                        {{ rental.rental_item.title }}
                                    </div>
                                </div>
                            </div>

                            <div class="mt-2 flow-root divide-y divide-gray-200 border-t border-gray-200">
                                <div class="pt-4 sm:flex flex-col items-center">
                                    <div class="flex space-x-2 sm:min-w-0 sm:flex-1">
                                        <img :src="rental.rental_item.image.src" :alt="rental.rental_item.image.alt"
                                            class="size-20 flex-none rounded-md object-fit sm:size-24 grayscale" />
                                        <div class="min-w-0 flex-1 pt-1.5 sm:pt-0">
                                            <p class="whitespace-nowrap text-sm mt-1">
                                                Start: <time class="font-bold" :datetime="rental.start_date">{{
                                                    $formatDate(rental.start_date) }}</time>
                                            </p>
                                            <p class="whitespace-nowrap text-sm mt-1">
                                                End: <time :datetime="rental.end_date">{{ $formatDate(rental.end_date)
                                                }}</time>
                                            </p>
                                            <p class="mt-1 font-medium">
                                                <span>Total: </span>€{{ rental.total_price }}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </RouterLink>
                    </section>
                </div>
                <div v-else class="flex justify-center w-full">
                    <p class="w-1/2 bg-white dark:bg-transparent p-2 rounded-lg text-center">No historical rentals for
                        your items.</p>
                </div>
            </div>

            <!--History for other users items-->
            <div v-show="activeTabIndex === 1" class="border-t border-gray-400 p-4 mb-4 sm:mb-12 w-full">
                <div v-if="renterRentals.length >= 1" class="flex flex-row flex-wrap gap-4 justify-center w-full">
                    <section v-for="rental in renterRentals" :key="rental.id" :aria-labelledby="`${rental.id}-heading`"
                        class="shadow-lg rounded-lg border p-4 mb-4 bg-gray-50 dark:border-gray-500 opacity-75 hover:opacity-100 transition-opacity">
                        <RouterLink :to="{ name: 'rental.show', params: { id: rental.id } }" as="div"
                            class="hover:cursor-pointer">
                            <div class="space-y-1 md:flex md:items-baseline md:space-y-0 md:space-x-4 pt-2">
                                <h2 :id="`${rental.id}-heading`" class="text-lg font-medium md:shrink-0">
                                    Rental #{{ rental.id }}
                                </h2>
                                <div
                                    class="space-y-2 sm:flex sm:items-baseline sm:justify-between sm:space-y-0 md:min-w-0 md:flex-1">
                                    <span
                                        class="px-2 py-1 text-xs font-semibold rounded-full bg-gray-200 dark:bg-gray-700">
                                        {{ rental.status }}
                                    </span>
                                    <div>
                                        <span class="font-semibold">Item:</span>
                                        {{ rental.rental_item.title }}
                                    </div>
                                </div>
                            </div>

                            <div class="mt-2 flow-root divide-y divide-gray-200 border-t border-gray-200">
                                <div class="pt-4 sm:flex flex-col items-center">
                                    <div class="flex sm:min-w-0 sm:flex-1 space-x-2">
                                        <img :src="rental.rental_item.image.src" :alt="rental.rental_item.image.alt"
                                            class="size-20 flex-none rounded-md object-cover sm:size-24 grayscale" />
                                        <div class="min-w-0 flex-1 pt-1.5 sm:pt-0">
                                            <p class="sm:whitespace-nowrap text-sm mt-1">
                                                Start: <time class="font-bold" :datetime="rental.start_date">{{
                                                    $formatDate(rental.start_date) }}</time>
                                            </p>
                                            <p class="sm:whitespace-nowrap text-sm mt-1">
                                                End: <time :datetime="rental.end_date">{{ $formatDate(rental.end_date)
                                                }}</time>
                                            </p>
                                            <p class="mt-1 font-medium">
                                                <span>Total: </span>€{{ rental.total_price }}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </RouterLink>
                    </section>
                </div>
                <div v-else class="flex justify-center w-full">
                    <p class="w-1/2 bg-white dark:bg-transparent p-2 rounded-lg text-center">No past rentals found.</p>
                </div>
            </div>
        </div>
    </div>
</template>
