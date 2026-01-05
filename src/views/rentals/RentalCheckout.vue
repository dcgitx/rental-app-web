<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { loadStripe } from '@stripe/stripe-js'
import { requestRental } from '@/api/rentalItems'
import { useCheckoutStore } from '@/stores/checkout'

const router = useRouter()
const checkoutStore = useCheckoutStore()

const payload = checkoutStore.payload

if (!payload) {
    router.push('/')
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)

console.log('Stripe key:', import.meta.env.VITE_STRIPE_PUBLIC_KEY)

const stripeElements = ref(null)
const isLoading = ref(true)
const error = ref(null);

onMounted(async () => {
    try {
        // 1. Create PaymentIntent
        const { data } = await requestRental(payload)

        // 2. Setup Stripe Elements
        const stripe = await stripePromise

        stripeElements.value = stripe.elements({
            clientSecret: data.client_secret,
            business: {
                name: 'rent-locally.com',
            },
        })

        const paymentElement = stripeElements.value.create('payment')
        paymentElement.mount('#payment-element')

        isLoading.value = false
    } catch (e) {
        console.error(e)
    }
})

const confirmPayment = async () => {
    const stripe = await stripePromise

    const { error: stripeError } = await stripe.confirmPayment({
        elements: stripeElements.value,
        redirect: 'if_required',
    })

    if (stripeError) {
        error.value = stripeError.message
        return
    }

    router.push({ name: 'rental-request-submitted' })
}
</script>

<template>
    <div class="min-h-screen flex items-start mt-12 justify-center">
        <div class="w-full max-w-md">
            <div v-if="isLoading">Loading…</div>

            <div v-show="!isLoading">
                <p v-if="error" class="text-md py-2 pb-4 text-red-500">{{ error }}</p>
                <div id="payment-element"></div>

                <button class="mt-4 w-full bg-black text-white py-2 rounded" @click="confirmPayment">
                    Submit payment
                </button>
            </div>
        </div>
    </div>
</template>
