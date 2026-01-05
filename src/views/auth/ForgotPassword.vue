<script setup>
import { ref } from 'vue'
import { forgotPassword } from '@/api/auth'
import InputLabel from '@/components/InputLabel.vue'
import TextInput from '@/components/TextInput.vue'
import PrimaryButton from '@/components/PrimaryButton.vue'

const email = ref('')
const message = ref(null)
const error = ref(null)
const isSubmitting = ref(false)

const submit = async () => {
    error.value = null
    message.value = null
    isSubmitting.value = true

    try {
        const { data } = await forgotPassword({ email: email.value })
        message.value = data.message
    } catch (e) {
        error.value = e.response?.data?.message ?? 'Something went wrong'
    } finally {
        isSubmitting.value = false
    }
}
</script>

<template>
    <div class="max-w-lg mx-auto mt-12 bg-white p-6 border rounded-lg shadow-lg">
        <h1 class="text-2xl mb-4 font-semibold">Forgot Password?</h1>

        <div class="mb-4 text-sm text-gray-600">
            Forgot your password? No problem. Just let us know your email address and we will email you a password reset
            link that will allow you to choose a new one.
        </div>

        <form @submit.prevent="submit">
            <div>
                <InputLabel for="email" value="Email" />

                <TextInput id="email" type="email" class="mt-1 block w-full" v-model="email" required autofocus
                    autocomplete="email" />
            </div>

            <div class="flex items-center justify-end mt-4">
                <PrimaryButton :class="{ 'opacity-25': isSubmitting }" :disabled="isSubmitting">
                    Email Password Reset Link
                </PrimaryButton>
            </div>
        </form>

        <p v-if="message" class="mt-4 text-green-600">
            {{ message }}
        </p>

        <p v-if="error" class="mt-4 text-red-600">
            {{ error }}
        </p>
    </div>
</template>
