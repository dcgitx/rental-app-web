<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/lib/api'
import InputLabel from '@/components/InputLabel.vue'
import TextInput from '@/components/TextInput.vue'
import PrimaryButton from '@/components/PrimaryButton.vue'

const route = useRoute()
const router = useRouter()

const token = route.query.token
const email = route.query.email

const password = ref('')
const passwordConfirmation = ref('')
const error = ref(null)
const isSubmitting = ref(false)

const submit = async () => {
    error.value = null
    isSubmitting.value = true

    try {
        await api.post('/reset-password', {
            token,
            email,
            password: password.value,
            password_confirmation: passwordConfirmation.value,
        })

        router.push('/login')
    } catch (e) {
        error.value = e.response?.data?.message ?? 'Password reset failed'
    } finally {
        isSubmitting.value = false
    }
}
</script>

<template>
    <div class="max-w-md mx-auto mt-12 bg-white p-6 border rounded-lg shadow-lg">
        <h1 class="text-2xl mb-4 font-semibold">Reset password</h1>

        <form @submit.prevent="submit">
            <div>
                <InputLabel for="email" value="Email" />

                <TextInput id="email" type="email" class="mt-1 block w-full" v-model="email" required autofocus
                    autocomplete="email" />
            </div>

            <div class="mt-4">
                <InputLabel for="password" value="New Password" />

                <TextInput id="password" type="password" class="mt-1 block w-full" v-model="password" required
                    autocomplete="off" />
            </div>

            <div class="mt-4">
                <InputLabel for="password_confirmation" value="Confirm Password" />

                <TextInput id="password_confirmation" type="password" class="mt-1 block w-full"
                    v-model="passwordConfirmation" required autocomplete="off" />
            </div>

            <div class="flex items-center justify-end mt-4">
                <PrimaryButton :class="{ 'opacity-25': isSubmitting }" :disabled="isSubmitting">
                    Reset Password
                </PrimaryButton>
            </div>
        </form>

        <p v-if="error" class="mt-4 text-red-600">
            {{ error }}
        </p>
    </div>
</template>
