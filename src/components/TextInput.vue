<script setup>
import { onMounted, ref } from "vue";
import InputLabel from "./InputLabel.vue";
import InputError from "./InputError.vue";


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
    disabled: false,
});

const model = defineModel({
    type: [String, Number],
    required: false,
});

defineEmits(["change"]);

const input = ref(null);

onMounted(() => {
    if (input.value.hasAttribute("autofocus")) {
        input.value.focus();
    }
});

defineExpose({ focus: () => input.value.focus() });
</script>

<template>
    <InputLabel :for="id" :value="label" class="mb-1 font-normal" />
    <input
        class="border-black focus:border-teal-600 focus:ring-0 rounded-md shadow-sm block mb-4 w-full text-black dark:bg-gray-900 dark:border-gray-700 dark:text-white"
        :class="disabled ? 'bg-gray-200' : ''" :id="id" :autocomplete="autocomplete" :required="required"
        :autofocus="autofocus" :type="type" :min="min" :pattern="pattern" :step="step" :disabled="disabled"
        :placeholder="placeholder" @change="$emit('change', $event.target.value)" v-model="model" ref="input" />
    <InputError class="mt-2" :message="error" />
</template>
