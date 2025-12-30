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
        const { data } = await api.post('/login', {
            email: email.value,
            password: password.value,
            remember: remember.value,
        })

        // store token
        localStorage.setItem('token', data.token)

        // load user
        auth.user = data.user
        auth.loaded = true

        sessionStorage.setItem('auth:user', JSON.stringify(data.user))

        router.push({ name: 'home' })

        password.value = ''
    } catch (e) {
        if (e.response?.status === 422) {
            const rawErrors = e.response.data.errors || {}

            errors.value = Object.fromEntries(
                Object.entries(e.response.data.errors || {}).map(
                    ([k, v]) => [k, v?.[0]]
                )
            )
        } else {
            console.error(e)
        }

    } finally {
        loading.value = false
    }
}

const signInWithGoogle = () => {
    window.location.href =
        import.meta.env.VITE_BACKEND_URL + '/api/v1/auth/google/redirect'
}

</script>

<template>
    <div class="flex flex-col items-center justify-start pt-6 min-h-screen px-4 bg-gray-50 dark:bg-gray-900">
        <div
            class="relative w-full max-w-md bg-white lg:mt-4 dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">

            <!-- Loading Overlay -->
            <div v-if="loading"
                class="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <!-- Spinner -->
                <svg class="h-8 w-8 animate-spin text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>

                <!-- Text -->
                <p class="mt-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ $t('Signing you in…') }}
                </p>
            </div>

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

                <!-- sign in with google -->
                <button type="button" class="flex justify-center w-full" @click="signInWithGoogle">
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
