<script setup>
import { ref } from "vue";
import { Head } from "@inertiajs/vue3";
import PublicLayout from "@/Layouts/PublicLayout.vue";
import BookedRentals from "@/Pages/Public/Rentals/Partials/BookedRentals.vue";
import PendingRentals from "@/Pages/Public/Rentals/Partials/PendingRentals.vue";
import StartedRentals from "@/Pages/Public/Rentals/Partials/StartedRentals.vue";
import HistoricalRentals from "@/Pages/Public/Rentals/Partials/HistoricalRentals.vue";

const activeTabIndex = ref(0);

const tabs = [
    { title: 'Active' },
    { title: 'Booked' },
    { title: 'Requests' },
    { title: 'History' },
];

</script>

<template>

    <Head title="My Rentals" />

    <PublicLayout>
        <div class="w-full text-center py-6">
            <div class="w-full flex justify-center">
                <!--tabs-->
                <div class="bg-gray-50 dark:bg-transparent rounded-t-lg">
                    <div class="flex flex-row justify-center items-center text-md font-semibold gap-0">

                        <div v-for="(tab, index) in tabs" :key="index"
                            class="w-32 sm:w-48 text-center rounded-t-lg border-gray-500 dark:bg-gray-800 py-2 transition-all ease-in-out duration-200 hover:cursor-pointer"
                            @click="activeTabIndex = index"
                            :class="{ 'is-active': activeTabIndex === index, 'bg-teal-600/30 dark:bg-teal-600/30': activeTabIndex === index }">
                            {{
                                tab.title }}</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex flex-col lg:flex-row lg:justify-center lg:gap-6">
            <StartedRentals v-if="activeTabIndex === 0" class="w-full" />

            <BookedRentals v-if="activeTabIndex === 1" class="w-full" />

            <PendingRentals v-if="activeTabIndex === 2" class="w-full" />

            <HistoricalRentals v-if="activeTabIndex === 3" class="w-full" />
        </div>

    </PublicLayout>
</template>
