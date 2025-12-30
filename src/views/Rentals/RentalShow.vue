<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import RenterRentalDetail from './RenterRentalDetail.vue'
import ListerRentalDetail from './ListerRentalDetail.vue'

const props = defineProps({ rental: Object })
const auth = useAuthStore()

const isRenter = computed(
    () => props.rental.requestor_id === auth.user.id
)
</script>

<template>
    <RenterRentalDetail v-if="isRenter" :rental="rental" />
    <ListerRentalDetail v-else :rental="rental" />
</template>
