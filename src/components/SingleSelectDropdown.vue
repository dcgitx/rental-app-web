<script setup>
import InputError from "./InputError.vue";
import InputLabel from "./InputLabel.vue";

const model = defineModel({
    required: true,
});

const props = defineProps({
    id: String,
    label: String,
    error: String,
    autocomplete: String,
});
</script>

<template>
    <InputLabel :for="id" :value="label" />
    <select v-model="model" :autocomplete="autocomplete" :id="id"
        class="mt-2 w-full rounded-md border-black py-2 shadow-sm ring-0 focus:ring-0 focus:border-black text-md sm:leading-6 text-black dark:text-white dark:bg-gray-900 dark:border-gray-700">

        <slot />
    </select>
    <InputError class="mt-2" :message="error" />
</template>
