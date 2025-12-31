<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { fetchRentals } from "@/api/rentals";

import BookedRentals from "./Partials/BookedRentals.vue";
import PendingRentals from "./Partials/PendingRentals.vue";
import HistoricalRentals from "./Partials/HistoricalRentals.vue";
import { useAuthStore } from "@/stores/auth";
import ActiveRentals from "./Partials/ActiveRentals.vue";

const auth = useAuthStore();

const rentals = ref([]);

const listerRentals = computed(() =>
    rentals.value.filter(r => r.item_owner_id === auth.user.id)
);

const renterRentals = computed(() =>
    rentals.value.filter(r => r.requestor_id === auth.user.id)
);

//const activeTabIndex = ref(0);

const activeTabKey = ref(
    window.location.hash.replace('#', '') || 'active'
);

const syncFromHash = () => {
    activeTabKey.value =
        window.location.hash.replace('#', '') || 'active';
};

onMounted(() => {
    window.addEventListener('hashchange', syncFromHash);
});

onBeforeUnmount(() => {
    window.removeEventListener('hashchange', syncFromHash);
});

const setActiveTab = (key) => {
    activeTabKey.value = key;
    window.location.hash = key;
};

/*const activeTabKey = computed({
    get() {
        return window.location.hash.replace('#', '') || 'active';
    },
    set(key) {
        window.location.hash = key;
    },
});*/

/*const tabs = [
    { title: 'Active' },
    { title: 'Booked' },
    { title: 'Requests' },
    { title: 'History' },
];*/

const tabs = [
    { key: 'active', title: 'Active' },
    { key: 'booked', title: 'Booked' },
    { key: 'requests', title: 'Requests' },
    { key: 'history', title: 'History' },
];


const reloadRentals = async () => {
    const { data } = await fetchRentals();
    rentals.value = data;
};

onMounted(reloadRentals);
</script>

<template>
    <div class="w-full text-center py-6">
        <div class="w-full flex justify-center">
            <!--tabs-->
            <div class="bg-gray-50 dark:bg-transparent rounded-t-lg">
                <div class="flex flex-row justify-center items-center text-md font-semibold gap-0">

                    <div v-for="tab in tabs" :key="tab.key"
                        class="w-32 sm:w-48 text-center rounded-t-lg border-gray-500 dark:bg-gray-800 py-2 transition-all ease-in-out duration-200 hover:cursor-pointer"
                        @click="setActiveTab(tab.key)"
                        :class="{ 'is-active': activeTabKey === tab.key, 'bg-teal-600/30 dark:bg-teal-600/30': activeTabKey === tab.key }">
                        {{
                            tab.title }}</div>
                </div>
            </div>
        </div>
    </div>

    <div class="flex flex-col lg:flex-row lg:justify-center lg:gap-6">
        <ActiveRentals v-show="activeTabKey === 'active'" :lister-rentals="listerRentals"
            :renter-rentals="renterRentals" class="w-full" />

        <BookedRentals v-show="activeTabKey === 'booked'" :lister-rentals="listerRentals"
            :renter-rentals="renterRentals" :on-refresh="reloadRentals" class="w-full" />

        <PendingRentals v-show="activeTabKey === 'requests'" :lister-rentals="listerRentals"
            :renter-rentals="renterRentals" :on-refresh="reloadRentals" class="w-full" />

        <HistoricalRentals v-show="activeTabKey === 'history'" class="w-full" />
    </div>
</template>
