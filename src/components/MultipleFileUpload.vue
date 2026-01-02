<script setup>
defineEmits(["update:modelValue"]);
const props = defineProps({
    accept: "",
});
</script>

<template>
    <div class="flex text-md text-white mt-2">
        <input
            id="file-upload"
            name="file-upload"
            type="file"
            :accept="accept"
            multiple
            class="file:border-0 file:border-r file:border-gray-200 dark:file:border-gray-700 file:bg-gray-900 file:rounded-xl file:p-2 file:text-gray-100 file:hover:cursor-pointer file:hover:bg-gray-700 file:transition-all file:ease-in-out file:duration-300"
            @input="$emit('update:modelValue', $event.target.files)"
        />
    </div>
</template>
