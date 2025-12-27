<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import Checkbox from "@/components/Checkbox.vue";
import InputError from "@/components/InputError.vue";
import InputLabel from "@/components/InputLabel.vue";
import PrimaryButton from "@/components/PrimaryButton.vue";
import TextInput from "@/components/TextInput.vue";
import GoogleSignInButton from '@/components/GoogleSignInButton.vue';
import api from '@/lib/api'
import axios from 'axios'

const auth = useAuthStore()

defineProps({
    canResetPassword: {
        type: Boolean,
        default: false,
    },
})

const router = useRouter()

const email = ref('')
const password = ref('')
const remember = ref(false)

const errors = ref({
    email: null,
    password: null,
})

const loading = ref(false)

const submit = async () => {
    loading.value = true
    errors.value = { email: null, password: null }

    try {
        await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/sanctum/csrf-cookie`,
            { withCredentials: true }
        )

        await api.post('/login', {
            email: email.value,
            password: password.value,
            remember: remember.value,
        })

        await auth.fetchUser()

        router.push({ name: 'home' })

        password.value = ''
    } catch (e) {
        if (e.response?.status === 422) {
            errors.value = e.response.data.errors || {}
        } else {
            console.error(e)
        }
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="flex flex-col items-center justify-start pt-6 min-h-screen px-4 bg-gray-50 dark:bg-gray-900">
        <div
            class="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">

            <!-- Header -->
            <div class="text-center mb-8">
                <div class="flex justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                        stroke="currentColor" class="w-12 h-12 text-gray-900 dark:text-teal-500">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>
                </div>

                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                    {{ $t("Sign In") }}
                </h2>

                <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {{ $t("Welcome back! Please sign in to continue") }}
                </p>
            </div>



            <!-- Form -->
            <form @submit.prevent="submit" class="space-y-6">
                <div>
                    <InputLabel for="email" :value="$t('user.email')" />
                    <TextInput id="email" type="email" class="mt-1 block w-full" v-model="email" required autofocus
                        autocomplete="username" />
                    <InputError class="mt-2" :message="errors.email" />
                </div>

                <div>
                    <InputLabel for="password" :value="$t('user.password')" />
                    <TextInput id="password" type="password" class="mt-1 block w-full" v-model="password" required
                        autocomplete="current-password" />
                    <InputError class="mt-2" :message="errors.password" />
                </div>

                <div class="flex items-center justify-between">
                    <label class="flex items-center">
                        <Checkbox v-model:checked="remember" />
                        <span class="ms-2 text-sm text-gray-600 dark:text-gray-400">
                            {{ $t("remember me") }}
                        </span>
                    </label>

                    <RouterLink v-if="canResetPassword" to="/forgot-password"
                        class="text-sm text-teal-600 hover:text-teal-500 dark:text-teal-400 underline">
                        {{ $t("Forgot your password?") }}
                    </RouterLink>
                </div>

                <PrimaryButton class="w-full justify-center" :class="{ 'opacity-25': loading }" :disabled="loading">
                    {{ $t("Sign In") }}
                </PrimaryButton>

                <div class="relative">
                    <div class="absolute inset-0 flex items-center">
                        <div class="w-full border-t border-gray-200 dark:border-gray-700"></div>
                    </div>
                    <div class="relative flex justify-center text-sm">
                        <span class="px-2 bg-white dark:bg-gray-800 text-gray-500">
                            Or continue with
                        </span>
                    </div>
                </div>

                <!-- Google button (no-op for now) -->
                <button type="button" class="flex justify-center w-full" disabled>
                    <GoogleSignInButton />
                </button>
            </form>

            <!-- Footer -->
            <div class="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
                {{ $t("Don't have an account?") }}
                <RouterLink to="/signup" class="font-medium text-teal-600 hover:text-teal-500 dark:text-teal-400">
                    {{ $t("Sign up") }}
                </RouterLink>
            </div>
        </div>
    </div>
</template>
