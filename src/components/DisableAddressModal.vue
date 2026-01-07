<script setup>
import { ref } from "vue";
import InputError from "@/components/InputError.vue";
import InputLabel from "@/components/InputLabel.vue";
import Modal from "@/components/Modal.vue";
import SecondaryButton from "@/components/SecondaryButton.vue";
import DangerButton from "@/components/DangerButton.vue";
import FormWarning from "@/components/FormWarning.vue";

const props = defineProps({
    address: Object,
    addresses: Array,
});

const error = ref(null);
const disablingAddress = ref(false);

const form = ref({
    new_address_id: "",
});

/*const disableAddress = () => {
    if (!form.value.new_address_id && props.address.rental_items_count >= 1) {
        error.value = "new_address_id", "Please select a new Address."
        return;
    }
    form.delete(route("address/destroy", props.address.id), {
        preserveScroll: true,
        onSuccess: () => closeModal(),
    });
};*/

const closeModal = () => {
    disablingAddress.value = false
    error.value = null
    form.value.new_address_id = ""
};
</script>

<template>
    <button @click="disablingAddress = !disablingAddress"
        class="w-full justify-center inline-flex items-center rounded-md bg-black hover:bg-gray-700 px-2 py-1 text-sm font-medium text-white ring-1 ring-green-500/20 ring-inset">
        Disable
    </button>
    <Modal :show="disablingAddress" @close="closeModal">
        <div class="p-6 w-full">
            <h2 class="text-lg font-medium text-gray-900 pb-4">
                Disabling Address - {{ address.address_name }}
                <p class="flex flex-row text-sm">
                    {{ address.number }} {{ address.street }}
                    {{ address.city }} {{ address.region }}
                    {{ address.country?.name }}
                    {{ address.zip }}
                </p>
            </h2>

            <!--select replacement address-->
            <div v-if="address.rental_items_count >= 1">
                <div class="w-3/4 place-self-center">
                    <FormWarning>You have {{ address.rental_items_count }} items
                        assigned to this address, please select a new address
                        for those items to be moved to.</FormWarning>
                </div>

                <div class="flex flex-col justify-center items-center pt-4 w-full">
                    <InputLabel for="newAddress" value="Replacement Address:*" />
                    <select
                        class="rounded-md my-1 border-gray-300 focus:border-app-500 focus:ring-app-500 space-y-6 w-2/3"
                        id="newAddress" name="newAddress" required v-model="form.new_address_id">
                        <option disabled value="">
                            -- select replacement address --
                        </option>
                        <option v-for="address in addresses" :key="address.id" :value="address.id"
                            :disabled="address.id === props.address.id"
                            class="text-start text-md text-app-900 w-full my-2" :class="{
                                'text-gray-300':
                                    address.id === props.address.id,
                            }">
                            {{ address.address_name }}
                        </option>
                    </select>
                    <InputError class="mt-2" :message="form.errors.new_address_id" />
                </div>
            </div>
            <div v-else>
                <div class="w-3/4 place-self-center">
                    <FormWarning>You have {{ address.rental_items_count }} items
                        assigned to this address, are you sure you want to
                        disable it? Note you can re-activate later</FormWarning>
                </div>
            </div>

            <!--form actions-->
            <div class="mt-6 flex justify-center">
                <SecondaryButton @click="closeModal">
                    {{ $t("Cancel") }}
                </SecondaryButton>

                <DangerButton class="ms-3" :class="{ 'opacity-25': form.processing }" :disabled="form.processing"
                    @click="disableAddress">
                    Disable Address
                </DangerButton>
            </div>
        </div>
    </Modal>
</template>
