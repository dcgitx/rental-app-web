<script setup>
import { ref, watch } from "vue";

const props = defineProps({
    label: { type: String, default: "Label" },
    placeholder: { type: String, default: "Enter value" },
    inputType: { type: String, default: "text" },
    inputName: { type: String, default: "input" },
    dropdownName: { type: String, default: "dropdown" },
    dropdownLabel: { type: String, default: "Select" },
    dropdownOptions: {
        type: Array,
        default: () => ["Option 1", "Option 2", "Option 3"],
    },
    inputValue: [String, Number],
    dropdownValue: String,
    currencySymbol: { type: String, default: "" }, // Optional prefix for currencies, etc.
});

// Emits for v-model binding
const emit = defineEmits(["update:inputValue", "update:dropdownValue"]);

// Local refs for input and dropdown values
const localInputValue = ref(props.inputValue || "");
const localDropdownValue = ref(props.dropdownValue || props.dropdownOptions[0]);

// Watchers to emit changes
function updateInputValue() {
    emit("update:inputValue", localInputValue.value);
}

function updateDropdownValue() {
    emit("update:dropdownValue", localDropdownValue.value);
}

// Sync local state with props in case props change
watch(
    () => props.inputValue,
    (newVal) => {
        localInputValue.value = newVal;
    },
);
watch(
    () => props.dropdownValue,
    (newVal) => {
        localDropdownValue.value = newVal;
    },
);
</script>

<template>
    <div>
        <label :for="inputName" class="block font-medium text-md">{{
            label
            }}</label>
        <div class="relative mt-1 rounded-md shadow-sm">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3" v-if="currencySymbol">
                <span class="text-gray-500 sm:text-sm">{{
                    currencySymbol
                    }}</span>
            </div>
            <div class="absolute inset-y-0 left-0 flex items-center">
                <label :for="dropdownName" class="sr-only">{{
                    dropdownLabel
                    }}</label>
                <select :id="dropdownName" :name="dropdownName" v-model="localDropdownValue"
                    @change="updateDropdownValue"
                    class="h-full border-gray-200 focus:ring-0 border-0 bg-transparent py-0 pl-4 pr-8 border-r border-r-gray-600 focus:border-r-teal-600 focus:ring-none focus:outline-none text-md">
                    <option v-for="(option, index) in dropdownOptions" :key="index" :value="option">
                        {{ option }}
                    </option>
                </select>
            </div>
            <input :type="inputType" :name="inputName" :id="inputName" v-model="localInputValue"
                @input="updateInputValue" :placeholder="placeholder"
                class="block w-full rounded-md py-2 pl-20 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 border-black focus:border-teal-600 focus:ring-0 text-md" />
        </div>
        <slot />
    </div>
</template>
