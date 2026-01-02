<script setup>
import TextInput from '@/components/TextInput.vue';
import InputLabel from '@/components/InputLabel.vue';
import InputError from '@/components/InputError.vue';
import { ref } from 'vue';
import { submitContact } from '@/api/contactUs';
import PrimaryButton from '@/components/PrimaryButton.vue';
import { useRouter } from 'vue-router';

const form = ref({
    email: "",
    message: "",
})

const errors = ref({})
const router = useRouter();

const submit = async () => {
    errors.value = {}

    try {
        await submitContact(form.value)

        form.value.email = ""
        form.value.message = ""

        router.push({ name: 'home' })
    } catch (e) {
        if (e.response?.status === 422) {
            errors.value = e.response.data.errors
        }
    }
}
</script>

<template>
    <div>
        <h1 class="font-semibold text-3xl py-6 text-center">
            Contact us using the form below
        </h1>
    </div>

    <div class="flex flex-col justify-center items-center ">
        <form @submit.prevent="submit" class="w-1/3 p-12 bg-white border border-teal-600/30 rounded-lg">
            <div class="w-full">
                <TextInput id="email" type="email" v-model="form.email" label="Your email address:*"
                    :error="errors.email?.[0]" class="border border-gray-100" />
            </div>

            <div class="col-span-full">
                <InputLabel for="message" value="Your Message:*" />
                <div class="mt-2">
                    <textarea id="message" rows="4" v-model="form.message"
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white dark:bg-gray-900 shadow-sm ring-1 ring-inset ring-black dark:ring-gray-700 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                        placeholder="Your Message max 200 characters" />
                    <InputError :message="errors.message?.[0]" class="mt-2" />
                </div>
            </div>
            <PrimaryButton class="mt-4">Submit</PrimaryButton>
        </form>
    </div>
</template>