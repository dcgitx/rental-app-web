<script setup>
import FormWarning from "@/components/FormWarning.vue";
import PrimaryButton from "@/components/PrimaryButton.vue";

import { computed } from "vue";
import { useUserDataStore } from "@/stores/userData";
import SetDefaultAddressModal from "@/components/SetDefaultAddressModal.vue";
import DisableAddressModal from "@/components/DisableAddressModal.vue";

const userData = useUserDataStore();
const addresses = computed(() => userData.addresses);


const disabledAddresses = [];

/*const props = defineProps({
    addresses: Array,
    disabledAddresses: Array,
});*/
</script>

<template>

    <h1 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white text-center py-6 ">Your Addresses</h1>


    <!--enabled addresses-->
    <div class="flex w-full justify-center">
        <div v-if="addresses.length" class="w-1/2 pt-4 flex flex-col items-center justify-center">
            <RouterLink to="/address/create" class="pb-4 w-full flex justify-start">
                <PrimaryButton class="w-1/4">Create New</PrimaryButton>
            </RouterLink>

            <h1 class="text-xl font-semibold w-full text-center pb-2">
                Enabled Addresses
            </h1>

            <p class="border-b-2 border-teal-600 pb-4 w-full text-center">
                Please note addresses cannot be edited - they can only be
                set as default or enabled/disabled.
            </p>

            <div v-for="address in addresses" :key="address.id"
                class="border-b border-teal-600 w-full flex flex-row justify-between items-center">
                <div class="pt-6">
                    <p class="text-lg font-semibold">
                        {{ address.address_name }}
                        <span class="text-sm">
                            ({{ address.rental_items_count }}
                            items)
                        </span>
                    </p>
                    <p>
                        {{ address.number }} {{ address.street }}
                        {{ address.city }} {{ address.region }}
                        {{ address.country?.name }}
                        {{ address.zip }}
                    </p>
                </div>
                <div class="flex flex-row gap-2">
                    <div v-if="address.is_default" class="w-full">
                        <p
                            class="w-full justify-center inline-flex items-center rounded-md px-2 py-1 text-lg tracking-wide font-semibold">
                            Default
                        </p>
                    </div>
                    <div v-else class="w-full">
                        <SetDefaultAddressModal :address="address" />
                    </div>
                    <div v-if="
                        address.is_default != true &&
                        addresses.length >= 2
                    ">
                        <DisableAddressModal :addresses="addresses" :address="address">Disable Address
                        </DisableAddressModal>
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="text-lg text-teal-600 flex flex-col justify-center">
            <p class="text-center pt-4">
                You haven't created any addresses yet.
            </p>
            <RouterLink to="/address/create" class="py-4 w-full">
                <PrimaryButton class="w-1/2">Create an Address</PrimaryButton>
            </RouterLink>
            <FormWarning>You'll need at least one address before you can start
                listing items.</FormWarning>
        </div>
    </div>

    <!--disabled addresses-->
    <div class="flex w-full justify-center pb-24">
        <div v-if="disabledAddresses.length" class="w-1/2 pt-8 flex flex-col items-center justify-center">
            <h1 class="text-xl font-semibold border-b-2 border-teal-600 w-full text-center pb-2">
                Disabled Addresses
            </h1>

            <div v-for="address in disabledAddresses" :key="address.id"
                class="border-b border-teal-600 w-full flex flex-row justify-between items-center">
                <div class="pt-6">
                    <p class="text-lg font-semibold">
                        {{ address.address_name }}
                    </p>
                    <p>
                        {{ address.number }} {{ address.street }}
                        {{ address.city }} {{ address.region }}
                        {{ address.country?.name }}
                        {{ address.zip }}
                    </p>
                </div>
                <div class="flex flex-row gap-2">
                    <div class="w-full">
                        <RouterLink :to="{ name: '/address/update', address: address }" preserve-scroll
                            class="w-full justify-center inline-flex items-center rounded-md bg-teal-600 hover:bg-teal-700 px-2 py-1 text-sm font-medium text-white ring-1 ring-green-500/20 ring-inset">
                            Enable
                        </RouterLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
