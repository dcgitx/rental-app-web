<script setup>
import InputWithLeadingDropdown from "@/components/InputWithLeadingDropdown.vue";
import { computed, ref, watch, onMounted } from "vue";

const props = defineProps({
    activeCountries: Array,
    modelValue: String,
});

const emit = defineEmits(["update:modelValue"]);

const countryCodeOptions = computed(() => {
    return props.activeCountries.map((country) => `${country.dialling_code}`);
});

const phone_country = ref("");
const phone_number = ref("");

onMounted(() => {
    if (!phone_country.value && countryCodeOptions.value.length > 0) {
        phone_country.value = countryCodeOptions.value[0];
    }
});

const isPhoneValid = computed(() => {
    return /^[0-9]+$/.test(phone_number.value);
});

// Clean + concatenate the full phone number
const fullPhoneNumber = computed(() => {
    // Remove leading 0 from the number part (if it exists)
    const cleanedNumber = phone_number.value.replace(/^0+/, "");
    return `${phone_country.value}${cleanedNumber}`;
});

watch(fullPhoneNumber, (val) => {
    emit("update:modelValue", val);
});
</script>

<template>
    <InputWithLeadingDropdown class="sm:col-span-3" label="Phone*" placeholder="Number without leading 0"
        :dropdownOptions="countryCodeOptions" v-model:inputValue="phone_number" v-model:dropdownValue="phone_country">
        <p v-if="!isPhoneValid && phone_number.length >= 5" class="text-red-500 text-sm">
            Phone number must contain digits only.
        </p>
    </InputWithLeadingDropdown>
</template>
