<script setup>
import { computed, reactive, watch, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useReferenceDataStore } from "@/stores/referenceData";
import { storeAddress } from "@/api/userAddresses";

import useGoogleAddressAutocomplete from "@/composables/googleAddressComplete";
import PrimaryButton from "@/components/PrimaryButton.vue";
import TextInput from "@/components/TextInput.vue";
import FormInfo from "@/components/FormInfo.vue";
import ToggleSwitch from "@/components/ToggleSwitch.vue";
import DangerButton from "@/components/DangerButton.vue";
import InputLabel from "@/components/InputLabel.vue";
import InputError from "@/components/InputError.vue";
import LoadingState from "@/components/LoadingState.vue";
import { useAuthStore } from "@/stores/auth";
import { useUserDataStore } from "@/stores/userData";

const referenceData = useReferenceDataStore()
const countriesReady = computed(() => referenceData.countriesLoaded)
const countries = computed(() => referenceData.activeCountries)
const formErrors = ref({})
const processing = ref(false)
const router = useRouter()
const auth = useAuthStore()
const userDataStore = useUserDataStore()

const { query, suggestions, selectedAddress, fetchSuggestions, selectAddress } =
    useGoogleAddressAutocomplete(countries);

onMounted(() => {
    if (!referenceData.countriesLoaded) {
        referenceData.loadActiveCountries();
    }
});

const form = reactive({
    address_name: "",
    street: "",
    number: "",
    city: "",
    region: "",
    country: "",
    country_id: null,
    zip: "",
    latitude: "",
    longitude: "",
    is_default: false,
    move_all_items: false,
});

watch(selectedAddress, (newAddress) => {
    if (newAddress) {
        form.street = newAddress.street;
        form.number = newAddress.number;
        form.city = newAddress.city;
        form.zip = newAddress.postalCode;
        form.region = newAddress.region;
        form.country = newAddress.country;
        form.country_id = newAddress.country_id;
        form.latitude = newAddress.latitude;
        form.longitude = newAddress.longitude;
    }
});

const submit = async () => {
    processing.value = true;
    formErrors.value = {};

    try {
        await storeAddress({
            address_name: form.address_name,
            street: form.street,
            number: form.number,
            city: form.city,
            region: form.region,
            zip: form.zip,
            country: form.country,
            country_id: form.country_id,
            latitude: form.latitude,
            longitude: form.longitude,
            is_default: form.is_default,
            move_all_items: form.move_all_items,
        });

        await auth.fetchUser()
        await userDataStore.refreshAddresses()

        if (window.history.length > 1) {
            router.back();
        } else {
            router.push({ name: "addresses" });
        }


    } catch (error) {
        if (error.response?.status === 422) {
            formErrors.value = error.response.data.errors ?? {};
        } else {
            console.error(error);
        }
    } finally {
        processing.value = false;
    }
};
</script>

<template>
    <LoadingState v-if="!countriesReady || processing" />
    <form v-if="countriesReady && !processing" @submit.prevent="submit"
        class="flex flex-col justify-center items-center p-12 pb-24" autocomplete="off">
        <div
            class="space-y-6 w-2/5 shadow-lg dark:shadow-none dark:border dark:border-gray-500 rounded-lg p-6 px-12 bg-white dark:bg-inherit">
            <div class="border-b border-gray-900/10 pb-4 text-black dark:text-inherit">
                <!--header-->
                <div class="flex flex-row gap-2 items-center justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                        stroke="#000000" class="size-8 dark:stroke-teal-600">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18m3-13.636 10.5-3.819" />
                    </svg>

                    <h2 class="text-3xl text-center font-semibold">
                        Create Address
                    </h2>
                </div>

                <FormInfo class="mb-4">At least one active address is required before you can
                    list an item for rental.</FormInfo>

                <div class="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
                    <!--address name-->
                    <div class="sm:col-span-6">
                        <TextInput id="address_name" v-model="form.address_name" label="Address Name (eg, home/work)"
                            autofocus :autocomplete="`off`" :error="formErrors.address_name?.[0]" />
                    </div>
                </div>

                <!--google address lookup-->
                <div v-if="form.address_name" class="sm:col-span-6">
                    <InputLabel value="Address Lookup:*" />
                    <input
                        class="border-black focus:border-teal-600 focus:ring-0 rounded-md shadow-sm block mb-4 w-full text-black dark:bg-black dark:text-gray-400"
                        v-model="query" @input="fetchSuggestions" :placeholder="`Search...`" autocomplete="off" />
                    <ul v-if="suggestions.length && !selectedAddress && query">
                        <li v-for="s in suggestions" :key="s.place_id" @click="selectAddress(s)"
                            class="py-2 items-center border-b hover:bg-teal-600/10 hover:cursor-pointer">
                            {{ s.description }}
                        </li>
                    </ul>
                </div>

                <!--street-->
                <div v-if="selectedAddress" class="grid grid-cols-1 gap-x-6 sm:grid-cols-6">
                    <div class="sm:col-span-6">
                        <TextInput id="street" v-model="form.street" label="Street*" :autocomplete="`off`"
                            :error="formErrors.street?.[0]" />
                    </div>
                </div>

                <!--number-->
                <div v-if="selectedAddress" class="sm:col-span-6">
                    <TextInput id="number" v-model="form.number" label="Name/Number*" :autocomplete="`off`" required
                        :error="formErrors.number?.[0]" />
                </div>

                <!--city-->
                <div v-if="selectedAddress" class="grid grid-cols-1 gap-x-6 sm:grid-cols-6">
                    <div class="sm:col-span-3">
                        <TextInput id="city" v-model="form.city" label="City*" :autocomplete="`off`"
                            :error="formErrors.city?.[0]" />
                    </div>

                    <!--zip-->
                    <div v-if="selectedAddress" class="sm:col-span-3">
                        <TextInput id="zip" v-model="form.zip" label="Zip/Postcode*" :autocomplete="`off`"
                            :error="formErrors.zip?.[0]" />
                    </div>
                </div>

                <!--country select-->
                <div v-if="selectedAddress" class="flex flex-col justify-center items-start">
                    <InputLabel for="country" value="Country:*" />
                    <select
                        class="rounded-md my-1 border-black focus:border-gray-500 focus:ring-gray-500 space-y-6 w-full dark:bg-black"
                        id="country" name="country" required v-model="form.country_id">
                        <option v-for="country in countries" :key="country.id" :value="country.id"
                            class="text-start text-md text-black dark:text-gray-400 w-full my-2">
                            {{ country.name }}
                        </option>
                    </select>
                    <InputError class="mt-2" :message="formErrors.country_id?.[0]" />
                </div>
            </div>

            <!--set default-->
            <div v-if="selectedAddress" class="flex flex-col justify-center gap-4">
                <ToggleSwitch labelText="Set as Default?" name="is_default" id="is_default"
                    class="flex flex-row items-start gap-2 pr-4" v-model:checked="form.is_default" />
                <ToggleSwitch labelText="Move your existing listings to this address?" name="move_all_items"
                    id="move_all_items" class="flex flex-row items-start gap-2 pr-4"
                    v-model:checked="form.move_all_items" />
            </div>

            <!--submit/cancel-->
            <div class="flex items-center justify-center gap-4">
                <PrimaryButton type="submit" class="ms-4" :class="{ 'opacity-25': processing }" :disabled="processing">
                    Create Address </PrimaryButton>
                <RouterLink @keydown.left as="button" to="/addresses" class="text-sm font-semibold leading-6">
                    <DangerButton :disabled="processing">Cancel</DangerButton>
                </RouterLink>
            </div>
        </div>
    </form>
</template>
