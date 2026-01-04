<script setup>
import GoogleSignUpButton from "@/components/GoogleSignUpButton.vue";
import SignUpButton from "@/components/SignUpButton.vue";
import { RouterLink } from "vue-router";

const signInWithGoogle = () => {
    window.location.href =
        import.meta.env.VITE_BACKEND_URL + '/api/v1/auth/google/redirect'
}
</script>

<template>
    <div class="flex flex-col items-center justify-start pt-20 min-h-screen px-4 bg-gray-50 dark:bg-gray-900">
        <div
            class="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">

            <!-- Header -->
            <div class="text-center mb-8">
                <div class="flex justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                        stroke="currentColor" class="w-12 h-12 text-gray-900 dark:text-teal-500">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                </div>
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                    {{ $t("Create an Account") }}
                </h2>
                <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {{ $t("Choose how you want to sign up") }}
                </p>
            </div>

            <!-- Options -->
            <div class="space-y-4">
                <RouterLink to="/register" class="flex justify-center w-full">
                    <SignUpButton />
                </RouterLink>

                <div class="relative">
                    <div class="absolute inset-0 flex items-center">
                        <div class="w-full border-t border-gray-200 dark:border-gray-700"></div>
                    </div>
                    <div class="relative flex justify-center text-sm">
                        <span class="px-2 bg-white dark:bg-gray-800 text-gray-500">Or continue with</span>
                    </div>
                </div>

                <button type="button" class="flex justify-center w-full" @click="signInWithGoogle">
                    <GoogleSignUpButton />
                </button>
            </div>

            <!-- Footer -->
            <div class="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
                {{ $t("Already have an account?") }}
                <RouterLink to="/login" class="font-medium text-teal-600 hover:text-teal-500 dark:text-teal-400">
                    {{ $t("Log in") }}
                </RouterLink>
            </div>
        </div>
    </div>
</template>
