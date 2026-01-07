<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { createConnectedAccount, startIdentityVerification } from "@/api/stripe";
import { useVisibilityRefresh } from "@/composables/useVisibilityRefresh";
import { useAuthStore } from "@/stores/auth";
import DeleteUserForm from "./partials/DeleteUserForm.vue";
import UpdatePasswordForm from "./partials/UpdatePasswordForm.vue";
import UpdateProfileInformationForm from "./partials/UpdateProfileInformationForm.vue";
import PrimaryButton from "@/components/PrimaryButton.vue";
import FormInfo from "@/components/FormInfo.vue";
import FormWarning from "@/components/FormWarning.vue";
import LoadingState from "@/components/LoadingState.vue";

const auth = useAuthStore();
const user = computed(() => auth.user);
const redirecting = ref(false);
const router = useRouter();

const startVerification = async () => {
    redirecting.value = true
    try {
        const { data } = await startIdentityVerification();
        window.open(data.url, "_blank");
        redirecting.value = false
    } catch (error) {
        console.error(error);
    }
};

const createAddress = async () => {
    router.push({ name: 'address/create' });
};

const createStripeConnectedAccount = async () => {
    redirecting.value = true
    try {
        const { data } = await createConnectedAccount();
        window.open(data.url, "_blank");
        redirecting.value = false
    } catch (error) {
        console.error(error);
    }
};

useVisibilityRefresh(() => auth.fetchUser());

</script>

<template>

    <h2 class="font-semibold text-2xl dark:text-inherit leading-tight text-center pt-6">
        {{ $t("Manage your profile") }}
    </h2>

    <LoadingState title="Redirecting" v-if="redirecting" />

    <div v-if="!redirecting" class="flex flex-col justify-center items-center w-full">

        <!-- profile requirements-->
        <div v-if="!user.is_identified || !user.can_list"
            class="flex flex-col items-center justify-start gap-2 max-w-2xl w-full mt-6 px-4 pb-4 bg-white dark:bg-inherit shadow-lg sm:rounded-lg border h-full">
            <FormWarning class="w-full">{{
                $t("Actions required to complete your profile.")
            }}</FormWarning>

            <!--identification-->
            <div v-if="!user.is_identified" class="dark:bg-inherit rounded-lg w-full flex justify-start gap-2 mt-2">
                <PrimaryButton @click="startVerification" class="min-w-56">
                    {{
                        user.verification_status === "requires_input"
                            ? $t("Complete Identification")
                            : $t("Verify Identity")
                    }}
                </PrimaryButton>

                <FormInfo class="w-full">
                    {{ $t("Required to begin renting and listing items.") }}
                </FormInfo>
            </div>

            <!--create address-->
            <div v-if="!user.user_address_id" class="dark:bg-inherit rounded-lg w-full flex justify-start gap-2">
                <PrimaryButton @click="createAddress" class="min-w-56 sm:text-nowrap">
                    Create Address</PrimaryButton>
                <FormInfo class="w-full">Required to create a connected account.</FormInfo>
            </div>

            <!--connect account-->
            <div v-if="!user.stripe_account_id" class="dark:bg-inherit rounded-lg w-full flex justify-start gap-2">
                <PrimaryButton @click="createStripeConnectedAccount" :disabled="!user.user_address_id"
                    class="min-w-56 sm:text-nowrap">{{
                        $t("Create Payment Account")
                    }}</PrimaryButton>
                <FormInfo class="w-full">{{ $t("Required to begin listing items.") }}</FormInfo>
            </div>
        </div>

        <!--Personal info forms-->
        <div class="pt-6 pb-12 justify-end items-end max-w-2xl w-full">
            <div class="mx-auto space-y-6">

                <div class="p-4 sm:p-8 bg-white dark:bg-inherit shadow-lg sm:rounded-lg border dark:border-gray-500">
                    <UpdateProfileInformationForm :user="user" class="w-full" />
                </div>

                <!--Password form-->
                <div v-if="user && user.can_change_password"
                    class="p-4 sm:p-8 bg-white dark:bg-inherit shadow-lg sm:rounded-lg border dark:border-gray-500">
                    <UpdatePasswordForm class="max-w-xl" />
                </div>

                <!--Delete account-->
                <div class="p-4 sm:p-8 bg-white dark:bg-inherit shadow-lg sm:rounded-lg border">
                    <DeleteUserForm class="w-full" />
                </div>
            </div>
        </div>


    </div>
</template>
