<script setup>
import { ref, watch } from "vue";
import { RadioGroup, RadioGroupOption } from "@headlessui/vue";

const props = defineProps({
    options: Object,
    label: String,
    modelValue: null,
});

const emit = defineEmits(["update:modelValue"]);

const selected = ref(parseInt(props.modelValue, 10) || null);

watch(selected, (newValue) => {
    emit("update:modelValue", newValue);
});

</script>
<template>
    <fieldset :aria-label="label">
        <RadioGroup v-model="selected" class="-space-y-px rounded-md bg-white dark:bg-gray-900">
            <RadioGroupOption as="template" v-for="(option, optionIdx) in options" :key="option.name" :value="option.id"
                :aria-label="option.name" :aria-description="option.description" v-slot="{ active, checked }">
                <div class="transition-all ease-in-out duration-200" :class="[
                    optionIdx === 0 ? 'rounded-tl-md rounded-tr-md' : '',
                    optionIdx === options.length - 1
                        ? 'rounded-bl-md rounded-br-md'
                        : '',
                    checked
                        ? 'z-10 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-teal-600/30'
                        : 'border-gray-200 dark:border-gray-700',
                    'relative flex cursor-pointer border p-4 focus:outline-none hover:bg-gray-100 dark:hover:bg-teal-600/30 transition-all ease-in-out duration-200',
                ]">
                    <span :class="[
                        checked
                            ? 'border-transparent bg-gray-600 dark:bg-teal-600'
                            : 'border-gray-300 dark:border-white bg-white dark:bg-transparent',
                        active
                            ? 'ring-2 ring-gray-600 ring-offset-2 hover:bg-gray-400'
                            : '',
                        'mt-0.5 flex h-4 w-4 shrink-0 cursor-pointer  items-center justify-center rounded-full border',
                    ]" aria-hidden="true">
                        <span class="h-1.5 w-1.5 rounded-full bg-white" />
                    </span>
                    <span class="ml-3 flex flex-col">
                        <span :class="[
                            checked
                                ? 'text-black dark:text-gray-300'
                                : 'text-black dark:text-gray-300',
                            'block text-sm font-medium',
                        ]">{{ $t(option.name) }}</span>
                        <span :class="[
                            checked
                                ? 'text-black dark:text-gray-300'
                                : 'text-gray-500',
                            'block text-sm',
                        ]">{{ $t(option.description ?? "") }}</span>
                    </span>
                </div>
            </RadioGroupOption>
        </RadioGroup>
    </fieldset>
</template>
