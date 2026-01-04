<script setup>
const props = defineProps({
    checked: null,
    labelText: "",
    name: "",
    id: "",
    disabled: false,
});

defineEmits(["update:checked"]);
</script>

<template>
    <div class="flex flex-col">
        <span
            class="selection:bg-black selection:text-white text-black dark:text-inherit pr-2 text-md"
            >{{ labelText }}</span
        >
        <label
            :class="checked ? 'bg-teal-600 ' : 'bg-teal-600/20'"
            class="inline-flex h-5 w-10 transform translate items-center rounded-full hover:cursor-pointer"
        >
            <span
                :class="checked ? 'translate-x-6' : 'translate-x-1'"
                class="inline-block h-3 w-3 transform rounded-full bg-gray-100 dark:bg-black transition hover:cursor-pointer"
            ></span>

            <input
                class="hidden"
                type="checkbox"
                :name="name"
                :id="id"
                :checked="checked"
                :disabled="disabled"
                @input="$emit('update:checked', $event.target.checked)"
            />
        </label>
    </div>
</template>
