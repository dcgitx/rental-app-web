<script setup>
defineEmits(["update:modelValue"]);
const props = defineProps({
    accept: "",
});
</script>

<template>
    <div class="flex text-md text-gray-700 mt-2">
        <input
            id="file-upload"
            name="file-upload"
            type="file"
            :accept="accept"
            class="file:border-none file:bg-teal-600 file:rounded-xl file:p-2 file:text-gray-100 file:font-semibold file:hover:cursor-pointer file:hover:bg-teal-800 file:transition-all file:ease-in-out file:duration-300"
            @input="$emit('update:modelValue', $event.target.files[0])"
        />
    </div>
</template>
