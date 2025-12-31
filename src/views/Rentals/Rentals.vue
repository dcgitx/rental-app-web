<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { fetchRentals } from "@/api/rentals";
import { useAuthStore } from "@/stores/auth";

import BookedRentals from "./Partials/BookedRentals.vue";
import PendingRentals from "./Partials/PendingRentals.vue";
import HistoricalRentals from "./Partials/HistoricalRentals.vue";

import ActiveRentals from "./Partials/ActiveRentals.vue";

const auth = useAuthStore();
const rentals = ref([]);
const activeTabKey = ref(
    window.location.hash.replace('#', '') || 'active'
);

const tabs = [
    { key: 'active', title: 'Active' },
    { key: 'booked', title: 'Booked' },
    { key: 'requests', title: 'Requests' },
    { key: 'history', title: 'History' },
];

const STATUS_GROUPS = {
    active: ['started'],
    booked: ['booked'],
    requests: ['pending'],
    history: [
        'completed',
        'declined',
        'expired',
        'lister_cancelled',
        'renter_cancelled',
        'refunded',
    ],
};

const rentalsByStatus = computed(() => {
    return rentals.value.filter(r =>
        STATUS_GROUPS[activeTabKey.value]?.includes(r.status)
    );
});

const listerRentals = computed(() => {
    if (!auth.user) return [];
    return rentalsByStatus.value.filter(
        r => r.item_owner_id === auth.user.id
    );
});

const renterRentals = computed(() => {
    if (!auth.user) return [];
    return rentalsByStatus.value.filter(
        r => r.requestor_id === auth.user.id
    );
});

const syncFromHash = () => {
    activeTabKey.value =
        window.location.hash.replace('#', '') || 'active';
};

const setActiveTab = (key) => {
    activeTabKey.value = key;
    window.location.hash = key;
};

const reloadRentals = async () => {
    const response = await fetchRentals();
    //rentals.value = response.data;

    rentals.value = response.data.map(r => ({
        ...r,
        item_owner_id: Number(r.item_owner_id),
        requestor_id: Number(r.requestor_id),
    }));
};

onMounted(() => {
    window.addEventListener('hashchange', syncFromHash);
    reloadRentals();
});

onBeforeUnmount(() => {
    window.removeEventListener('hashchange', syncFromHash);
});
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

        <BookedRentals v-show="auth.user && rentals.length && activeTabKey === 'booked'" :lister-rentals="listerRentals"
            :renter-rentals="renterRentals" :on-refresh="reloadRentals" class="w-full" />

        <PendingRentals v-show="rentals.length && activeTabKey === 'requests'" :lister-rentals="listerRentals"
            :renter-rentals="renterRentals" :on-refresh="reloadRentals" class="w-full" />

        <HistoricalRentals v-show="rentals.length && activeTabKey === 'history'" :lister-rentals="listerRentals"
            :renter-rentals="renterRentals" class="w-full" />
    </div>
</template>
