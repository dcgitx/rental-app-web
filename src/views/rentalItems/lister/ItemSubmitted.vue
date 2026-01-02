<script setup>
import PrimaryButton from "@/components/PrimaryButton.vue";
import SecondaryButton from "@/components/SecondaryButton.vue";
import { CheckCircleIcon } from "@heroicons/vue/24/solid";
import { RouterLink } from "vue-router";
</script>

<template>
    <div class="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div
            class="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 max-w-lg w-full text-center">

            <div class="flex justify-center mb-6">
                <CheckCircleIcon class="h-20 w-20 text-teal-600" />
            </div>

            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {{ $t("Item Submitted!") }}
            </h1>

            <p class="text-lg text-gray-600 dark:text-gray-300 mb-8">
                {{ $t("We'll send you a notification when your item has been confirmed and is ready for renting.") }}
            </p>

            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <RouterLink to="/lister/rental-items/create" class="w-full sm:w-auto">
                    <PrimaryButton class="w-full justify-center py-3 text-base">
                        {{ $t("Create Another") }}
                    </PrimaryButton>
                </RouterLink>

                <RouterLink to="/" class="w-full sm:w-auto">
                    <SecondaryButton class="w-full justify-center py-3 text-base">
                        {{ $t("Maybe Later") }}
                    </SecondaryButton>
                </RouterLink>
            </div>
        </div>
    </div>
</template>
