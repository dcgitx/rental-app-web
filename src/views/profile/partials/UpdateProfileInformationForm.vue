<script setup>
import { ref, watch, computed, reactive } from "vue";
import { CurrencyEuroIcon } from "@heroicons/vue/24/outline";
import { useReferenceDataStore } from "@/stores/referenceData";
import { useImageResizer } from "@/composables/useImageResizer";
import { updateProfile } from "@/api/profile";
import { showAccountDashboard } from "@/api/stripe";
import { useAuthStore } from "@/stores/auth";

import FileUpload from "@/components/FileUpload.vue";
import FormInfo from "@/components/FormInfo.vue";
import InputError from "@/components/InputError.vue";
import InputLabel from "@/components/InputLabel.vue";
import PrimaryButton from "@/components/PrimaryButton.vue";
import TextInput from "@/components/TextInput.vue";
import ToggleSwitch from "@/components/ToggleSwitch.vue";
import PhoneInput from "@/components/PhoneInput.vue";
import { UserCircleIcon } from "@heroicons/vue/24/solid";

import LoadingState from "@/components/LoadingState.vue";


const props = defineProps({
    user: Object
})

const auth = useAuthStore();
const refStore = useReferenceDataStore()
const activeCountries = computed(() => refStore.activeCountries)
const userLanguages = computed(() => refStore.activeLanguages)

const newPhoneNumber = ref(null)
const addingNewNumber = ref(false)
const avatarError = ref(false)
const formErrors = ref({})
const formSaved = ref(false)
const processing = ref(false)
const currentPhoneNumber = props.user.phone_number
const avatarPreview = ref(null)

const form = reactive({
    username: props.user.username ?? "",
    name: props.user.name,
    surname: props.user.surname,
    email: props.user.email,
    phone_number: newPhoneNumber.value ?? currentPhoneNumber,
    avatar: props.user.avatar ?? null,
    languages: props.user.languages?.map((lang) => lang.id) ?? [],
});

const toggleAddingNewNumber = () => {
    addingNewNumber.value = !addingNewNumber.value;
};

watch(newPhoneNumber, (newVal) => {
    form.phone_number = newVal || currentPhoneNumber;
});

const toggleLanguage = (language) => {
    if (form.languages.includes(language.id)) {
        form.languages = form.languages.filter((l) => l !== language.id);
    } else {
        form.languages.push(language.id);
    }
};

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

    form.avatar.value = resizedFile;
    avatarPreview.value = preview;
};

const showConnectedAccount = async () => {
    processing.value = true
    try {
        const { data } = await showAccountDashboard();
        window.open(data.url, "_blank");
        processing.value = false
    } catch (error) {
        console.error(error);
    }
};

const submit = async () => {

    processing.value = true;
    formErrors.value = {};
    formSaved.value = false;

    try {
        const data = new FormData();

        data.append("username", form.username);
        data.append("name", form.name);
        data.append("surname", form.surname);
        data.append("email", form.email);
        data.append("phone_number", form.phone_number);

        form.languages.forEach((langId, i) => {
            data.append(`languages[${i}]`, langId);
        });

        if (form.avatar) {
            data.append("avatar", form.avatar);
        }

        await updateProfile(data);

        formSaved.value = true;
    } catch (error) {
        console.error(error);

        if (error.response?.status === 422) {
            formErrors.value = error.response.data.errors ?? {};
        }
    } finally {
        await auth.fetchUser()
        processing.value = false
        avatarPreview.value = null
    }
};
</script>

<template>

    <section>

        <header class="flex flex-col justify-between">
            <div class="flex flex-col items-end">

                <!--Avatar Form-->
                <div class="w-full">
                    <div class="flex flex-col items-start justify-start pb-12">
                        <div class="flex flex-row justify-between gap-2 w-full">
                            <div>
                                <label for="avatar" class="block text-lg font-medium leading-6 pb-2">
                                    {{ $t("Add/Update your Avatar") }}</label>

                                <div class="flex items-start justify-center gap-x-3">

                                    <template v-if="avatarPreview">
                                        <img :src="avatarPreview" alt="Avatar preview"
                                            class="h-12 w-12 rounded-full object-cover mt-2" />
                                    </template>

                                    <UserCircleIcon v-else class="h-12 w-12 text-gray-300 mt-2" aria-hidden="true" />

                                    <FileUpload id="avatar" name="avatar" v-model="form.avatar"
                                        @change="handleAvatarChange" />

                                    <div v-if="avatarError" class="text-sm text-red-500 italic pt-4">
                                        {{ avatarError }}
                                    </div>
                                </div>
                            </div>

                            <!--avatar circular image-->
                            <div v-if="user.avatar" class="-mt-12 -mr-12">
                                <img :src="user.avatar" alt="user_avatar" class="h-28 w-28 rounded-full object-fill" />
                            </div>
                        </div>

                    </div>

                    <!--stripe dashboard-->
                    <div v-if="user.stripe_account_id" class="flex place-self-end -mt-6">
                        <PrimaryButton @click="showConnectedAccount" class="bg-orange-500 hover:bg-orange-600">
                            <CurrencyEuroIcon class="size-6 mr-1" /> View Stripe Dashboard (opens in new
                            tab)
                        </PrimaryButton>
                    </div>
                </div>

            </div>

            <div class="flex flex-col justify-end">
                <h2 class="text-lg font-medium text-gray-600 dark:text-inherit pb-2">
                    {{ $t("Profile Information") }}
                </h2>
                <FormInfo>{{
                    $t(
                        "Update your account's profile information and email address.",
                    )
                }}</FormInfo>
            </div>
        </header>
        <LoadingState title="Updating" v-show="processing" />

        <form v-if="!processing" @submit.prevent="submit" class="mt-6 space-y-6">

            <!--username-->
            <div :class="{ 'mb-4': formErrors.username }">
                <InputLabel for="username" :value="$t('Choose a Public Username')" />
                <TextInput id="username" v-model="form.username" autocomplete="off" :error="formErrors.username?.[0]"
                    :class="{ 'mb-12': formErrors.username }" />
            </div>

            <!-- name and surname-->
            <div class="flex flex-row gap-4">
                <!--name-->
                <div class="w-full">
                    <InputLabel for="name" :value="$t('Name')" />
                    <TextInput id="name" type="text" class="mt-1 block w-full" v-model="form.name" required
                        autocomplete="name" />
                    <InputError class="mt-2" :message="formErrors.name?.[0]" />
                </div>

                <!--surname-->
                <div class="w-full">
                    <InputLabel for="surname" :value="$t('Surname')" />
                    <TextInput id="surname" type="text" class="mt-1 block w-full" v-model="form.surname" required
                        autocomplete="surname" />
                    <InputError class="mt-2" :message="formErrors.surname?.[0]" />
                </div>
            </div>

            <!--email-->
            <div>
                <InputLabel for="email" :value="$t('Email')" />
                <TextInput id="email" type="email" class="mt-1 block w-full" v-model="form.email" required
                    autocomplete="username" />
                <InputError class="mt-2" :message="formErrors.email?.[0]" />
            </div>

            <!--phone-->
            <div class="flex flex-row w-full justify-around items-center">
                <p>
                    Verified Phone Number:
                    <span class="font-bold">{{ currentPhoneNumber }}</span>
                </p>

                <PrimaryButton v-if="!addingNewNumber" @click="toggleAddingNewNumber">Update Phone Number
                </PrimaryButton>
                <PrimaryButton v-if="addingNewNumber" @click="toggleAddingNewNumber">Cancel</PrimaryButton>
            </div>

            <div v-if="addingNewNumber">
                <FormInfo>If you change your number you will need to verify the new
                    number via SMS.</FormInfo>
                <PhoneInput class="w-1/2 py-2 place-self-center" label="New Number*" :activeCountries="activeCountries"
                    v-model="newPhoneNumber" />
            </div>

            <!--user languages-->
            <div class="pb-4">
                <InputLabel for="username" :value="$t('Languages You Speak')" />
                <FormInfo>
                    This will be displayed to renters of your items and to
                    listers if you make a rental request.
                </FormInfo>
                <div class="flex flex-wrap justify-center gap-2 items-center w-auto">
                    <div v-for="language in userLanguages" :key="language">
                        <ToggleSwitch :labelText="language.language" name="languages" :id="language.id"
                            class="flex justify-start items-center w-full gap-2 sm:pr-4 text-lg py-4"
                            :checked="form.languages.includes(language.id)" @change="toggleLanguage(language)" />
                    </div>
                </div>
            </div>

            <div v-if="user.email_verified_at === null">
                <p class="text-sm mt-2 text-gray-800">
                    {{ $t("Your email address is unverified.") }}
                    <RouterLink href="route('verification.send')" method="post" as="button"
                        class="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        {{
                            $t("Click here to re-send the verification email.")
                        }}
                    </RouterLink>
                </p>
            </div>

            <div class="flex items-center gap-4">
                <PrimaryButton :type="submit" :disabled="processing">{{
                    $t("Save")
                }}</PrimaryButton>

                <Transition enter-active-class="transition ease-in-out" enter-from-class="opacity-0"
                    leave-active-class="transition ease-in-out" leave-to-class="opacity-0">
                    <p v-if="formSaved" class="text-sm text-gray-600">
                        {{ $t("Saved.") }}
                    </p>
                </Transition>
            </div>
        </form>
    </section>
</template>
