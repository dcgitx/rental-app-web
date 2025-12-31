<script setup>
import { computed, ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import RenterRentalDetail from './RenterRentalDetail.vue'
import ListerRentalDetail from './ListerRentalDetail.vue'
import { useRoute } from 'vue-router'
import { showRental } from '@/api/rentals'
import LoadingState from '@/components/LoadingState.vue'


const route = useRoute();
const rental = ref(null);
const auth = useAuthStore()
const loading = ref(true);

onMounted(async () => {
    const { data } = await showRental(route.params.id);
    rental.value = data;
    loading.value = false;

    document.title = `Rental #${data.id}`;
});

const isRenter = computed(() => {
    if (!rental.value || !auth.user) return false;
    return rental.value.requestor_id === auth.user.id;
});

</script>

<template>
    <LoadingState v-if="loading" />

    <div v-else>
        <RenterRentalDetail v-if="isRenter" :rental="rental" />
        <ListerRentalDetail v-else :rental="rental" />
    </div>
</template>
