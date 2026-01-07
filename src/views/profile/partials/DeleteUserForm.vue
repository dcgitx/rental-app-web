<script setup>
import DangerButton from "@/components/DangerButton.vue";
import FormImportant from "@/components/FormImportant.vue";
import InputError from "@/components/InputError.vue";
import InputLabel from "@/components/InputLabel.vue";
import Modal from "@/components/Modal.vue";
import SecondaryButton from "@/components/SecondaryButton.vue";
import TextInput from "@/components/TextInput.vue";
import { nextTick, ref } from "vue";

const confirmingUserDeletion = ref(false)
const passwordInput = ref(null)
const processing = ref(false)
const errors = ref(null);

const form = ref({
    password: "",
});

const confirmUserDeletion = () => {
    confirmingUserDeletion.value = true;

    nextTick(() => passwordInput.value.focus());
};

/*const deleteUser = () => {
    form.delete(route("profile.destroy"), {
        preserveScroll: true,
        onSuccess: () => closeModal(),
        onError: () => passwordInput.value.focus(),
        onFinish: () => form.reset(),
    });
};*/

const closeModal = () => {
    confirmingUserDeletion.value = false;

    form.password.value = "";
};
</script>

<template>
    <section class="space-y-6">
        <header>
            <h2 class="text-lg font-medium">
                {{ $t("Delete Account") }}
            </h2>

            <FormImportant class="w-full">
                {{
                    $t(
                        `Once your account is deleted, all of its resources and data will be permanently deleted. Before
                deleting your account, please download any data or information that you wish to retain.`,
                    )
                }}</FormImportant>
        </header>

        <DangerButton @click="confirmUserDeletion">{{
            $t("Delete Account")
        }}</DangerButton>

        <Modal :show="confirmingUserDeletion" @close="closeModal">
            <div class="p-6">
                <h2 class="text-lg font-medium text-gray-900 dark:text-gray-300">
                    {{ $t("Are you sure you want to delete your account?") }}
                </h2>

                <p v-if="auth.user.can_change_password" class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {{
                        $t(
                            `Once your account is deleted, all of its resources and data will be permanently deleted. Please
                    enter your password to confirm you would like to permanently delete your account.`,
                        )
                    }}
                </p>
                <p v-else class="mt-1 text-sm text-gray-600">
                    {{
                        $t(
                            "Once your account is deleted, all of its resources and data will be permanently deleted.",
                        )
                    }}
                </p>

                <div v-if="auth.user.can_change_password" class="mt-6">
                    <InputLabel for="password" :value="$t('Password')" class="sr-only" />

                    <TextInput id="password" ref="passwordInput" v-model="form.password" type="password"
                        class="mt-1 block w-3/4" :placeholder="$t('Password')" @keyup.enter="deleteUser" />

                    <InputError :message="errors" class="mt-2" />
                </div>

                <div class="mt-6 flex justify-end">
                    <SecondaryButton @click="closeModal">
                        {{ $t("Cancel") }}
                    </SecondaryButton>

                    <DangerButton class="ms-3" :class="{ 'opacity-25': processing }" :disabled="processing"
                        @click="deleteUser">
                        {{ $t("Delete Account") }}
                    </DangerButton>
                </div>
            </div>
        </Modal>
    </section>
</template>
