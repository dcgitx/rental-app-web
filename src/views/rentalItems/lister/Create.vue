<script setup>
import { ref, watch, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useReferenceDataStore } from '@/stores/referenceData'
import DangerButton from "@/components/DangerButton.vue";
import InputError from "@/components/InputError.vue";
import PrimaryButton from "@/components/PrimaryButton.vue";
import TextInput from "@/components/TextInput.vue";
import VerticalRadioInput from "@/components/VerticalRadioInput.vue";
import PriceInput from "@/components/PriceInput.vue";
import SingleSelectDropdown from "@/components/SingleSelectDropdown.vue";
import MultipleFileUpload from "@/components/MultipleFileUpload.vue";
import InputLabel from "@/components/InputLabel.vue";
import { XMarkIcon } from "@heroicons/vue/24/solid";
import { useUserDataStore } from "@/stores/userData";
import { useAuthStore } from "@/stores/auth";
import { storeRentalItem } from "@/api/rentalItems";

const refStore = useReferenceDataStore();
const userData = useUserDataStore();
const router = useRouter();
const auth = useAuthStore();

const itemConditions = computed(() => refStore.itemConditions);
const rentalCategories = computed(() => refStore.categories);
const userAddresses = computed(() => userData.addresses);
const commissionRate = computed(() => auth.user?.listing_fee)

const errors = ref({});
const previewImages = ref([]);

const form = ref({
    title: "",
    description: "",
    key_features: "",
    special_handling: "",
    item_condition_id: null,
    price_per_day: "",
    price_7_days: "",
    price_30_days: "",
    rental_category_id: 0,
    user_address_id: null,
    minimum_rental_days: "",
    owner_can_transport: false,
    transport_radius: "",
    transport_fixed_price: 0,
    transport_km_price: 0,
    item_images: [],
});

// Auto-calculate weekly and monthly rates based on daily rate
watch(() => form.value.price_per_day, (newDailyRate) => {
    if (newDailyRate && !isNaN(newDailyRate)) {
        form.value.price_7_days = String(parseFloat(newDailyRate) * 7);
        form.value.price_30_days = String(parseFloat(newDailyRate) * 30);
    }
});

//handle images
function handleFileChange(event) {
    const files = Array.from(event.target.files);

    files.forEach((file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;

            img.onload = () => {
                const MAX_WIDTH = 1920;
                const MAX_HEIGHT = 1080;

                let width = img.width;
                let height = img.height;

                if (width > MAX_WIDTH || height > MAX_HEIGHT) {
                    const aspectRatio = width / height;
                    if (width > height) {
                        width = MAX_WIDTH;
                        height = MAX_WIDTH / aspectRatio;
                    } else {
                        height = MAX_HEIGHT;
                        width = MAX_HEIGHT * aspectRatio;
                    }
                }

                const canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        const resizedFile = new File([blob], file.name, {
                            type: "image/webp",
                            lastModified: Date.now(),
                        });

                        form.value.item_images?.push(resizedFile);
                        const previewReader = new FileReader();
                        previewReader.readAsDataURL(resizedFile);
                        previewReader.onload = (e) => {
                            previewImages.value.push(e.target.result);
                        };
                    },
                    "image/webp",
                    0.8,
                );
            };
        };
    });
}

function removeImage(index) {
    previewImages.value.splice(index, 1);
    form.value.item_images.splice(index, 1);
}

const submit = async () => {
    console.log(form.value)
    errors.value = {}

    try {
        const data = new FormData()

        Object.entries(form.value).forEach(([key, value]) => {
            if (key === 'item_images') {
                value.forEach((file, index) => {
                    data.append(`item_images[${index}]`, file)
                })
            } else {
                data.append(key, value ?? '')
            }
        })

        await storeRentalItem(data)

        router.push({ name: 'item.submitted' })
    } catch (e) {
        if (e.response?.status === 422) {
            errors.value = e.response.data.errors
        }
    }
}
</script>

<template>
    <div class="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div class="max-w-5xl mx-auto">
            <!-- Header -->
            <div class="mb-8 text-center">
                <h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                    {{ $t("List a New Item") }}
                </h2>
                <p class="mt-2 text-lg text-gray-600 dark:text-gray-400">
                    {{ $t("Share your gear with the community and start earning.") }}
                </p>
            </div>

            <form @submit.prevent="submit" class="space-y-6" autocomplete="off">
                <!-- Error Summary -->
                <div v-if="Object.keys(errors).length > 0"
                    class="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                    <div class="flex">
                        <div class="flex-shrink-0">
                            <XMarkIcon class="h-5 w-5 text-red-400" aria-hidden="true" />
                        </div>
                        <div class="ml-3">
                            <h3 class="text-sm font-medium text-red-800 dark:text-red-200">
                                {{ $t("There were errors with your submission") }}
                            </h3>
                            <div class="mt-2 text-sm text-red-700 dark:text-red-300">
                                <ul role="list" class="list-disc pl-5 space-y-1">
                                    <li v-for="(error, key) in errors" :key="key">{{ error[0] }}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Location Section -->
                <div class="bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
                    <div class="px-4 py-6 sm:p-8">
                        <div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div class="col-span-full">
                                <h3 class="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                                    {{ $t("Location") }}
                                </h3>
                                <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
                                    {{ $t("Where is this item located?") }}
                                </p>
                            </div>

                            <div class="col-span-full sm:col-span-4">
                                <SingleSelectDropdown id="user_address_id" :label="$t('Select Address') + '*'"
                                    :error="errors.user_address_id?.[0]" v-model="form.user_address_id">
                                    <option v-for="address in userAddresses" :value="address.id" :key="address.id">
                                        {{ address.address_name }} ({{ address.number }}, {{ address.street }})
                                    </option>
                                </SingleSelectDropdown>
                            </div>

                            <div class="col-span-full sm:col-span-2 flex items-end pb-1">
                                <RouterLink to="/address/create" class="w-full">
                                    <PrimaryButton type="button" class="w-full justify-center">
                                        {{ $t("New Address") }}
                                    </PrimaryButton>
                                </RouterLink>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Details Section -->
                <div class="bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
                    <div class="px-4 py-6 sm:p-8">
                        <div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div class="col-span-full">
                                <h3 class="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                                    {{ $t("Item Details") }}
                                </h3>
                                <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
                                    {{ $t("Describe your item accurately to attract renters.") }}
                                </p>
                            </div>

                            <div class="col-span-full">
                                <TextInput id="title" v-model="form.title" :label="$t('Item Name') + '*'"
                                    :error="errors.title?.[0]" placeholder="e.g. Professional DSLR Camera Kit" />
                            </div>

                            <div class="col-span-full">
                                <InputLabel for="description" :value="$t('Description')" />
                                <div class="mt-2">
                                    <textarea id="description" rows="4" v-model="form.description"
                                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white dark:bg-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                                        :placeholder="$t('Provide detailed information about your item...')" />
                                    <InputError :message="errors.description?.[0]" class="mt-2" />
                                </div>
                            </div>

                            <div class="sm:col-span-3">
                                <TextInput id="key_features" v-model="form.key_features"
                                    :label="$t('Key Features (Optional)')" :error="errors.key_features?.[0]"
                                    placeholder="e.g. 4K Video, Waterproof" />
                            </div>

                            <div class="sm:col-span-3">
                                <TextInput id="special_handling" v-model="form.special_handling"
                                    :label="$t('Special Handling (Optional)')" :error="errors.special_handling?.[0]"
                                    placeholder="e.g. Fragile, Heavy" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Category & Condition Split -->
                <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <!-- Category -->
                    <div class="bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
                        <div class="px-4 py-6 sm:p-8">
                            <h3 class="text-base font-semibold leading-7 text-gray-900 dark:text-white mb-4">
                                {{ $t("Category") }}
                            </h3>
                            <SingleSelectDropdown id="rental_category" :label="$t('Select Category') + '*'"
                                :error="errors.rental_category_id?.[0]" v-model="form.rental_category_id">
                                <option v-for="category in rentalCategories" :value="category.id" :key="category.id">
                                    {{ $t(category.category) }}
                                </option>
                            </SingleSelectDropdown>
                        </div>
                    </div>

                    <!-- Condition -->
                    <div class="bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
                        <div class="px-4 py-6 sm:p-8">
                            <h3 class="text-base font-semibold leading-7 text-gray-900 dark:text-white mb-4">
                                {{ $t("Condition") }}
                            </h3>
                            <VerticalRadioInput :options="itemConditions" v-model="form.item_condition_id" />
                            <InputError :message="errors.item_condition_id?.[0]" class="mt-2" />
                        </div>
                    </div>
                </div>

                <!-- Pricing Section -->
                <div class="bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
                    <div class="px-4 py-6 sm:p-8">
                        <div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div class="col-span-full">
                                <h3 class="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                                    {{ $t("Pricing & Availability") }}
                                </h3>
                                <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
                                    {{ $t("Set your rates. Longer rentals can have discounted rates.") }}
                                </p>
                                <div class="mt-2 rounded-md bg-blue-50 dark:bg-blue-900/20 p-3">
                                    <div class="flex">
                                        <div class="flex-shrink-0">
                                            <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor"
                                                aria-hidden="true">
                                                <path fill-rule="evenodd"
                                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                                    clip-rule="evenodd" />
                                            </svg>
                                        </div>
                                        <div class="ml-3 flex-1 md:flex md:justify-between">
                                            <p class="text-sm text-blue-700 dark:text-blue-300">
                                                {{ $t("Platform commission rate:") }} <span class="font-bold">{{
                                                    commissionRate }}%</span>.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="sm:col-span-2">
                                <PriceInput :label="$t('Daily Rate') + '*'" v-model="form.price_per_day" />
                            </div>

                            <div class="sm:col-span-2">
                                <PriceInput :label="$t('Weekly Rate (7 Days)')" v-model="form.price_7_days" />
                            </div>

                            <div class="sm:col-span-2">
                                <PriceInput :label="$t('Monthly Rate (30 Days)')" v-model="form.price_30_days" />
                            </div>

                            <div class="col-span-full">
                                <div class="rounded-md bg-teal-50 dark:bg-teal-900/20 p-3">
                                    <div class="flex">
                                        <div class="flex-shrink-0">
                                            <svg class="h-5 w-5 text-teal-400" viewBox="0 0 20 20" fill="currentColor"
                                                aria-hidden="true">
                                                <path fill-rule="evenodd"
                                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                                                    clip-rule="evenodd" />
                                            </svg>
                                        </div>
                                        <div class="ml-3">
                                            <p class="text-sm text-teal-700 dark:text-teal-300">
                                                {{ $t(`Weekly and monthly rates are auto-calculated from your daily
                                                rate. You can adjust them to offer discounts for longer rental
                                                periods.`) }}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-span-full border-t border-gray-200 dark:border-gray-700 pt-6 mt-2">
                                <div class="max-w-xs">
                                    <InputLabel for="minimum_rental_days" :value="$t('Minimum Rental Days')" />
                                    <div class="relative mt-2 rounded-md shadow-sm">
                                        <input type="number" name="minimum_rental_days" id="minimum_rental_days"
                                            max="30" v-model="form.minimum_rental_days"
                                            class="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white dark:bg-gray-900 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                                            :placeholder="$t('e.g. 1')" />
                                    </div>
                                    <p class="mt-1 text-xs text-gray-500">{{ $t(`Minimum number of days a user must
                                        rent this item.`) }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Images Section -->
                <div class="bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
                    <div class="px-4 py-6 sm:p-8">
                        <h3 class="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                            {{ $t("Photos") }}
                        </h3>
                        <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
                            {{ $t("Upload up to 6 photos. The first photo will be the cover image.") }}
                        </p>

                        <div class="mt-6">
                            <MultipleFileUpload v-if="form.item_images.length < 6" accept="image/*"
                                @change="handleFileChange" />
                            <div v-else
                                class="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-md text-yellow-800 dark:text-yellow-200 text-sm text-center">
                                {{ $t("Maximum of 6 images reached.") }}
                            </div>
                        </div>

                        <div class="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                            <div v-for="(image, index) in previewImages" :key="index"
                                class="relative group aspect-square">
                                <img :src="image" alt="Preview"
                                    class="h-full w-full rounded-lg object-cover border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900" />
                                <button type="button" @click="removeImage(index)"
                                    class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors">
                                    <XMarkIcon class="h-4 w-4" />
                                </button>
                                <div v-if="index === 0"
                                    class="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs text-center py-1 rounded-b-lg">
                                    {{ $t("Cover") }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Terms & Actions -->
                <div class="flex flex-col items-center justify-center gap-6 pt-6 pb-12">
                    <p class="text-sm text-gray-500 dark:text-gray-400 text-center">
                        {{ $t("By submitting this form you confirm acceptance of the") }}
                        <RouterLink to="/terms" target="_blank" class="text-teal-600 hover:underline">
                            {{ $t("terms & conditions") }}</RouterLink>
                    </p>

                    <div class="flex items-center gap-4 w-full sm:w-auto">
                        <RouterLink to="/" class="w-full sm:w-auto">
                            <DangerButton type="button" :disabled="form.processing" class="w-full justify-center">
                                {{ $t("Cancel") }}
                            </DangerButton>
                        </RouterLink>

                        <PrimaryButton :disabled="form.processing" class="w-full sm:w-auto justify-center px-8">
                            {{ $t("Create Listing") }}
                        </PrimaryButton>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>
