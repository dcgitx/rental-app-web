<script setup>
import { ref } from "vue";
import InputLabel from "./InputLabel.vue";

const props = defineProps({
    id: String,
    label: String,
    error: String,
    autocomplete: String,
    required: String,
    autofocus: String,
    class: String,
    type: String,
    placeholder: String,
    min: null,
    pattern: null,
    step: null,
});

const model = defineModel({
    type: [String, Number],
    required: true,
});

defineEmits(["change"]);

const input = ref(null);
</script>

<template>
    <div>
        <InputLabel :for="id" :value="label" />
        <div class="relative mt-1 rounded-md shadow-sm">
            <div
                class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
            >
                <span class="sm:text-sm">&#8364;</span>
            </div>
            <input
                type="text"
                name="price"
                :id="id"
                @change="$emit('change', $event.target.value)"
                v-model="model"
                ref="input"
                class="border-black focus:border-black dark:bg-gray-900 dark:border-gray-700 focus:ring-black text-black dark:text-white placeholder-gray-300 dark:placeholder-gray-500 rounded-md shadow-sm block mb-4 w-full pl-7 pr-12"
                placeholder="0.00"
                aria-describedby="price-currency"
            />
        </div>
    </div>
</template>
