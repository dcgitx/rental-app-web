<script setup>
import { ref, onMounted, computed, nextTick } from "vue";
import { useImageResizer } from "@/composables/useImageResizer";
import { UserCircleIcon } from "@heroicons/vue/24/solid";
import { useReferenceDataStore } from "@/stores/referenceData";
import { useAuthStore } from "@/stores/auth";
import { useRoute, useRouter } from "vue-router";

import InputLabel from "@/components/InputLabel.vue";
import PrimaryButton from "@/components/PrimaryButton.vue";
import TextInput from "@/components/TextInput.vue";
import FileUpload from "@/components/FileUpload.vue";
import ToggleSwitch from "@/components/ToggleSwitch.vue";
import DangerButton from "@/components/DangerButton.vue";
import PhoneInput from "@/components/PhoneInput.vue";
import InputError from "@/components/InputError.vue";

import api from "@/lib/api";

const refStore = useReferenceDataStore();
const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const errors = ref({})
const loading = ref(false)

onMounted(() => {
    refStore.loadActiveCountries()
})

const activeCountries = computed(() => refStore.activeCountries)
const languages = computed(() => refStore.activeLanguages)

const form = ref({
    name: "",
    surname: "",
    username: "",
    email: "",
    phone_number: "",
    password: "",
    password_confirmation: "",
    avatar: "",
    cover_image: "",
    news_email: false,
    promo_email: false,
    languages: [],
    vat_number: "",
});

const toggleLanguage = (language) => {
    if (form.value.languages.includes(language.id)) {
        form.value.languages = form.value.languages.filter((l) => l !== language.id);
    } else {
        form.value.languages.push(language.id);
    }
};


const submit = async () => {
    errors.value = {}
    loading.value = true

    try {
        const data = new FormData()

        Object.entries(form.value).forEach(([key, value]) => {
            if (key === 'languages') {
                value.forEach((langId, index) => {
                    data.append(`languages[${index}]`, langId)
                })
            } else if (key === 'avatar') {
                if (value instanceof File) {
                    data.append('avatar', value)
                }
            } else if (key === 'news_email' || key === 'promo_email') {
                data.append(key, value ? 1 : 0)
            } else {
                data.append(key, value ?? '')
            }
        })

        const response = await api.post('/register', data)

        // Store token
        localStorage.setItem('token', response.data.token)

        // Hydrate auth store
        auth.user = response.data.user
        auth.loaded = true
        sessionStorage.setItem('auth:user', JSON.stringify(response.data.user))

        // Redirect (support intended route)
        await nextTick()
        router.replace(route.query.redirect || { name: 'home' })
    } catch (e) {
        if (e.response?.status === 422) {
            errors.value = e.response.data.errors
        } else {
            console.error(e)
        }
    } finally {
        loading.value = false
        form.value.password = ''
        form.value.password_confirmation = ''
    }
}

const avatarPreview = ref(null)

const { resizeImages } = useImageResizer({
    maxWidth: 400,
    maxHeight: 400,
    quality: 0.8,
    multiple: false,
});

const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const { file: resizedFile, preview } = await resizeImages(file);

    form.avatar = resizedFile;
    avatarPreview.value = preview;
};


</script>

<template>
    <div class="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div class="max-w-4xl mx-auto">
            <!-- Header -->
            <div class="text-center mb-8">
                <h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                    {{ $t("Create an Account") }}
                </h2>
                <p class="mt-2 text-lg text-gray-600 dark:text-gray-400">
                    {{ $t("Join our community to start renting and listing items.") }}
                </p>
                <div class="mt-4">
                    <RouterLink to="/login" class="text-teal-600 hover:text-teal-500 font-medium">
                        {{ $t("Already have an account? Sign in") }}
                    </RouterLink>
                </div>
            </div>

            <form @submit.prevent="submit" class="space-y-6" autocomplete="off">

                <!-- Account Information -->
                <div class="bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
                    <div class="px-4 py-6 sm:p-8">
                        <div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div class="col-span-full">
                                <h3 class="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                                    {{ $t("Account Information") }}
                                </h3>
                                <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
                                    {{ $t("This information will be displayed publicly on your profile.") }}
                                </p>
                            </div>

                            <div class="sm:col-span-4">
                                <TextInput id="username" v-model="form.username" :label="$t('Username') + '*'" autofocus
                                    autocomplete="username" :error="errors.username?.[0]" />
                            </div>

                            <div class="col-span-full">
                                <InputLabel for="avatar" :value="$t('Profile Photo')" />
                                <div class="mt-2 flex items-center gap-x-6">
                                    <div class="relative">
                                        <img v-if="avatarPreview" :src="avatarPreview" alt="Avatar preview"
                                            class="h-20 w-20 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-700" />
                                        <UserCircleIcon v-else class="h-20 w-20 text-gray-300 dark:text-gray-600"
                                            aria-hidden="true" />
                                    </div>

                                    <div class="flex-1">
                                        <FileUpload id="avatar" name="avatar" v-model="form.avatar"
                                            @change="handleAvatarChange" />
                                        <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                            {{ $t("JPG, GIF or PNG. Max 1MB.") }}
                                        </p>
                                        <InputError :message="errors.avatar?.[0]" class="mt-2" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Personal Details -->
                <div class="bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
                    <div class="px-4 py-6 sm:p-8">
                        <div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div class="col-span-full">
                                <h3 class="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                                    {{ $t("Personal Details") }}
                                </h3>
                                <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
                                    {{ $t("Private information used for account security and verification.") }}
                                </p>
                            </div>

                            <div class="sm:col-span-3">
                                <TextInput id="name" type="text" :label="$t('First Name') + '*'" autocomplete="name"
                                    v-model="form.name" :error="errors.name?.[0]" />
                            </div>

                            <div class="sm:col-span-3">
                                <TextInput id="surname" type="text" :label="$t('Surname') + '*'" autocomplete="surname"
                                    v-model="form.surname" :error="errors.surname?.[0]" />
                            </div>

                            <div class="sm:col-span-3">
                                <TextInput id="email" type="email" :label="$t('Email Address') + '*'"
                                    :error="errors.email?.[0]" v-model="form.email" autocomplete="email" />
                            </div>

                            <div class="sm:col-span-3">
                                <PhoneInput :activeCountries="activeCountries" v-model="form.phone_number" />
                                <InputError :message="errors.phone_number?.[0]" class="mt-2" />
                            </div>

                            <div class="sm:col-span-3">
                                <TextInput id="password" type="password" :label="$t('Password') + '*'"
                                    :error="errors.password?.[0]" v-model="form.password" autocomplete="new-password" />
                            </div>

                            <div class="sm:col-span-3">
                                <TextInput id="password_confirmation" type="password"
                                    :label="$t('Confirm Password') + '*'" :error="errors.password_confirmation?.[0]"
                                    v-model="form.password_confirmation" autocomplete="new-password" />
                            </div>

                            <div class="col-span-full">
                                <TextInput id="vat_number" type="text" :label="$t('VAT Number (Optional)')"
                                    :error="errors.vat_number?.[0]" v-model="form.vat_number" autocomplete="off" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Languages -->
                <div class="bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
                    <div class="px-4 py-6 sm:p-8">
                        <h3 class="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                            {{ $t("Languages") }}
                        </h3>
                        <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400 mb-6">
                            {{ $t("Select the languages you speak to help others communicate with you.") }}
                        </p>

                        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <div v-for="lang in languages" :key="lang.id">
                                <ToggleSwitch :labelText="lang.language" name="languages" :id="lang.id"
                                    class="flex items-center justify-between w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                    :checked="form.languages.includes(lang.id)" @change="toggleLanguage(lang)" />
                            </div>
                        </div>
                        <InputError :message="errors.languages?.[0]" class="mt-4" />
                    </div>
                </div>

                <!-- Notifications -->
                <div class="bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
                    <div class="px-4 py-6 sm:p-8">
                        <h3 class="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                            {{ $t("Notifications") }}
                        </h3>
                        <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400 mb-6">
                            {{ $t("Manage your email preferences.") }}
                        </p>

                        <div class="space-y-4">
                            <ToggleSwitch :labelText="$t('Subscribe to our newsletter')" name="newsletter_email"
                                id="newsletter_email"
                                class="flex items-center justify-between w-full p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                                v-model:checked="form.news_email" />
                            <ToggleSwitch :labelText="$t('Receive promotional emails')" name="promo_email"
                                id="promo_email"
                                class="flex items-center justify-between w-full p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                                v-model:checked="form.promo_email" />
                        </div>
                    </div>
                </div>

                <!-- Actions -->
                <div class="flex flex-col sm:flex-row items-center justify-end gap-4 pt-4">
                    <RouterLink to="/" class="w-full sm:w-auto">
                        <DangerButton type="button" :disabled="form.processing" class="w-full justify-center">
                            {{ $t("Cancel") }}
                        </DangerButton>
                    </RouterLink>

                    <PrimaryButton type="submit" class="w-full sm:w-auto justify-center px-8"
                        :class="{ 'opacity-25': form.processing }" :disabled="form.processing">
                        {{ $t("Create Account") }}
                    </PrimaryButton>
                </div>
            </form>
        </div>
    </div>
</template>
