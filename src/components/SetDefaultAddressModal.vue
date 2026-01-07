<script setup>
import { ref } from "vue";
import Modal from "@/components/Modal.vue";
import PrimaryButton from "@/components/PrimaryButton.vue";
import SecondaryButton from "@/components/SecondaryButton.vue";
import ToggleSwitch from "@/components/ToggleSwitch.vue";
import FormInfo from "@/components/FormInfo.vue";

const props = defineProps({
    address: Object,
});

const settingDefault = ref(false);

const form = ref({
    move_all_items: false,
});

/*const setDefault = () => {
    form.patch(route("address/update", props.address.id), {
        move_all_items: form.move_all_items,
        preserveScroll: true,
        onSuccess: () => closeModal(),
    });
};*/

const closeModal = () => {
    settingDefault.value = false;
    form.value.move_all_items = false;
};
</script>

<template>
    <button @click="settingDefault = !settingDefault"
        class="w-full justify-center inline-flex items-center rounded-md bg-teal-600 hover:bg-teal-700 px-2 py-1 text-sm font-medium text-white ring-1 ring-green-500/20 ring-inset">
        Set as default
    </button>
    <Modal :show="settingDefault" @close="closeModal">
        <div class="p-6 w-full">
            <h2 class="text-lg font-medium text-gray-900 pb-4">
                Setting Address - {{ address.address_name }} to default
                <p class="flex flex-row text-sm">
                    {{ address.number }} {{ address.street }}
                    {{ address.city }} {{ address.region }}
                    {{ address.country?.name }}
                    {{ address.zip }}
                </p>
            </h2>

            <div>
                <div class="w-full place-self-center">
                    <FormInfo>Would you Like to assign all of your existing listings
                        to this address?</FormInfo>
                </div>

                <div class="place-self-center pt-4">
                    <ToggleSwitch labelText="Move existing listings?" name="move_all_items" id="move_all_items"
                        class="flex flex-row items-center gap-2 pr-4" v-model:checked="form.move_all_items" />
                </div>
            </div>

            <!--form actions-->
            <div class="mt-6 flex justify-center">
                <SecondaryButton @click="closeModal">
                    {{ $t("Cancel") }}
                </SecondaryButton>

                <PrimaryButton class="ms-3" :class="{ 'opacity-25': form.processing }" :disabled="form.processing"
                    @click="setDefault">
                    Set Default
                </PrimaryButton>
            </div>
        </div>
    </Modal>
</template>
