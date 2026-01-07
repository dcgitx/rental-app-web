<script setup>
import { reactive, ref } from "vue";
import { updatePassword } from "@/api/profile";
import FormWarning from "@/components/FormWarning.vue";
import InputError from "@/components/InputError.vue";
import InputLabel from "@/components/InputLabel.vue";
import PrimaryButton from "@/components/PrimaryButton.vue";
import TextInput from "@/components/TextInput.vue";
import LoadingState from "@/components/LoadingState.vue";

const errors = ref({})
const formSaved = ref(false)
const processing = ref(false)

const form = reactive({
    current_password: "",
    password: "",
    password_confirmation: "",
});

const submit = async () => {
    processing.value = true;
    errors.value = {};

    try {
        await updatePassword({
            current_password: form.current_password,
            password: form.password,
            password_confirmation: form.password_confirmation,
        });

        form.current_password = "";
        form.password = "";
        form.password_confirmation = "";

        formSaved.value = true;
    } catch (error) {
        if (error.response?.status === 422) {
            errors.value = error.response.data.errors ?? {};
        }
    } finally {
        processing.value = false
    }
};
</script>

<template>

    <section>
        <header>
            <h2 class="text-lg font-medium text-app-900">
                {{ $t("Update Password") }}
            </h2>

            <FormWarning>{{
                $t(
                    "Ensure your account is using a long, random password to stay secure.",
                )
            }}</FormWarning>
        </header>

        <LoadingState title="Updating" v-show="processing" />

        <form v-if="!processing" @submit.prevent="submit" class="mt-6 space-y-6">
            <div>
                <InputLabel for="current_password" :value="$t('Current Password')" />

                <TextInput id="current_password" ref="currentPasswordInput" v-model="form.current_password"
                    type="password" class="mt-1 block w-full" autocomplete="current-password" />

                <InputError :message="errors.current_password?.[0]" class="mt-2" />
            </div>

            <div>
                <InputLabel for="password" :value="$t('New Password')" />

                <TextInput id="password" ref="passwordInput" v-model="form.password" type="password"
                    class="mt-1 block w-full" autocomplete="new-password" />

                <InputError :message="errors.password?.[0]" class="mt-2" />
            </div>

            <div>
                <InputLabel for="password_confirmation" :value="$t('Confirm Password')" />

                <TextInput id="password_confirmation" v-model="form.password_confirmation" type="password"
                    class="mt-1 block w-full" autocomplete="new-password" />

                <InputError :message="errors.password_confirmation?.[0]" class="mt-2" />
            </div>

            <div class="flex items-center gap-4">
                <PrimaryButton :disabled="processing">{{
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
