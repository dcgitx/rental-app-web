<script setup>
import PrimaryButton from '@/components/PrimaryButton.vue';

const closeTab = () => {
    window.close();
};
</script>

<template>
    <div class="flex flex-col items-center justify-start mt-20 gap-4">
        <h1>Stripe process complete</h1>
        <p>You can now close this tab and return to the app.</p>
        <PrimaryButton @click="closeTab">Close Tab</PrimaryButton>
    </div>
</template>
