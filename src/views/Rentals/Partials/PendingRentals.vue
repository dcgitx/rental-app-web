<script setup>
import { ref, onMounted } from "vue";
import { router, Link } from "@inertiajs/vue3";
import axios from "axios";
import { useChatStore } from "@/Composables/useChatStore";
import {
    ChatBubbleOvalLeftEllipsisIcon,
    EnvelopeIcon,
    EyeIcon,
} from "@heroicons/vue/24/outline";
import CancelButton from "@/Components/CancelButton.vue";
import ViewRentalButton from "@/Components/ViewRentalButton.vue";

const listerRentals = ref([]);
const renterRentals = ref([]);
const loading = ref(true);

const chat = useChatStore();

const activeTabIndex = ref(0);

const tabs = [
    { title: 'Received' },
    { title: 'Sent' },
];

const fetchRentals = async () => {
    try {
        const response = await axios.get(route('rentals.data', { status: 'requests' }));
        listerRentals.value = response.data.listerRentals;
        renterRentals.value = response.data.renterRentals;
    } catch (error) {
        console.error("Error fetching pending rentals:", error);
    } finally {
        loading.value = false;
    }
};

const changeRentalStatus = (id, status) => {
    loading.value = true;

    router.post(
        `/changeRentalStatus/${id}`,
        { status },
        {
            preserveScroll: true,
            preserveState: true,
            onSuccess: fetchRentals,
            onError: (errors) => console.error(errors),
            onFinish: () => {
                loading.value = false;
            },
        }
    );
};

onMounted(fetchRentals);

</script>

<template>
    <div>
        <!--tabs-->
        <div class="w-full flex justify-center">
            <div class="bg-gray-50 dark:bg-transparent rounded-t-lg">
                <div class="flex flex-row justify-center items-center text-md font-semibold gap-0">
                    <div v-for="(tab, index) in tabs" :key="index"
                        class="w-32 text-center rounded-t-lg border-gray-500 dark:bg-gray-800 py-2 transition-all ease-in-out duration-200 hover:cursor-pointer"
                        @click="activeTabIndex = index"
                        :class="{ 'is-active': activeTabIndex === index, 'bg-teal-600/30 dark:bg-teal-600/30': activeTabIndex === index }">
                        {{
                            tab.title }}</div>
                </div>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center p-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>

        <div v-else>
            <!--lister received requests-->
            <div v-if="activeTabIndex === 0" class="border-t border-gray-400 p-4 mb-4 sm:mb-12 w-full">
                <div v-if="listerRentals.length >= 1" class="flex flex-row flex-wrap gap-4 justify-center w-full">
                    <section v-for="rental in listerRentals" :key="rental.id" :aria-labelledby="`${rental.id}-heading`"
                        class="shadow-lg rounded-lg border p-4 bg-gray-50 dark:bg-black dark:border-gray-500">
                        <div class="space-y-1 md:flex md:items-baseline md:space-y-0 md:space-x-4 pt-2">
                            <h2 :id="`${rental.id}-heading`" class="text-lg font-medium md:shrink-0">
                                Request #{{ rental.id }}
                            </h2>
                            <div
                                class="space-y-2 sm:flex sm:items-baseline sm:justify-between sm:space-y-0 md:min-w-0 md:flex-1">
                                <div></div>
                                <div>
                                    <span class="font-semibold">Item:</span>
                                    {{ rental.rental_item.title }}
                                </div>
                            </div>
                        </div>

                        <div class="mt-2 flow-root divide-y divide-gray-200 border-t border-gray-200">
                            <div class="pt-4 sm:flex flex-col items-center">
                                <div class="flex sm:min-w-0 sm:flex-1 space-x-2">
                                    <img :src="rental.rental_item.images[0]
                                        ?.image_sm
                                        " :alt="rental.rental_item.images[0]
                                            ?.alt_image_sm
                                            " class="size-20 flex-none rounded-md object-fit sm:size-24" />
                                    <div class="min-w-0 flex-1 pt-1.5 sm:pt-0">
                                        <p class="mt-1 font-medium">
                                            <span>Your Profit: </span>€{{
                                                rental.rental_price -
                                                rental.lister_fee
                                            }}
                                        </p>
                                        <p class="whitespace-nowrap text-sm mt-1">
                                            Requested:
                                            <br class="sm:hidden" />
                                            <time :datetime="rental.created_at
                                                ">{{
                                                    $formatDate(
                                                        rental.created_at,
                                                    )
                                                }}</time>
                                        </p>
                                        <p class="whitespace-nowrap text-sm mt-1">
                                            Rental Start:
                                            <br class="sm:hidden" />
                                            <time class="font-bold text-lg" :datetime="rental.start_date
                                                ">{{
                                                    $formatDate(
                                                        rental.start_date,
                                                    )
                                                }}</time>
                                        </p>
                                        <p class="whitespace-nowrap text-sm mt-1">
                                            Rental End:
                                            <br class="sm:hidden" />

                                            <time :datetime="rental.end_date">{{
                                                $formatDate(
                                                    rental.end_date,
                                                )
                                            }}</time>
                                        </p>
                                    </div>
                                </div>
                                <div class="space-y-4 w-full pt-4">
                                    <!--accept rental-->
                                    <button @click="
                                        changeRentalStatus(
                                            rental.id,
                                            'booked',
                                        )
                                        "
                                        class="flex w-full items-center justify-center rounded-md border border-transparent bg-teal-600 px-2.5 py-2 text-sm font-medium text-white shadow-xs hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:outline-hidden sm:grow-0 transition-all ease-in-out duration-200">
                                        <EnvelopeIcon class="size-5 mr-1" />
                                        Accept
                                    </button>

                                    <!--message renter-->
                                    <button @click="chat.open(rental.id)"
                                        class="flex w-full items-center justify-center rounded-md border border-transparent bg-teal-600 px-2.5 py-2 text-sm font-medium text-white shadow-xs hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:outline-hidden sm:grow-0 transition-all ease-in-out duration-200">
                                        <ChatBubbleOvalLeftEllipsisIcon class="size-5 mr-1" />
                                        Message Renter
                                    </button>

                                    <!--view rental-->
                                    <ViewRentalButton :rental-id="rental.id" />

                                    <!--decline rental-->
                                    <CancelButton @click="changeRentalStatus(rental.id, 'declined',)">Decline
                                    </CancelButton>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
                <div v-else class="flex justify-center w-full">
                    <p class="w-1/2 bg-white dark:bg-transparent p-2 rounded-lg text-center">You have no pending
                        received
                        rental requests.</p>
                </div>
            </div>

            <!--lister sent requests-->
            <div v-if="activeTabIndex === 1" class="border-t border-gray-400 p-4 mb-4 sm:mb-12 w-full">
                <div v-if="renterRentals.length >= 1" class="flex flex-row flex-wrap gap-4 justify-center w-full">
                    <section v-for="rental in renterRentals" :key="rental.id" :aria-labelledby="`${rental.id}-heading`"
                        class="shadow-lg rounded-lg border p-4 mb-4 bg-gray-50 dark:bg-black dark:border-gray-500">
                        <div class="space-y-1 md:flex md:items-baseline md:space-y-0 md:space-x-4 pt-2">
                            <h2 :id="`${rental.id}-heading`" class="text-lg font-medium md:shrink-0">
                                Request #{{ rental.id }}
                            </h2>
                            <div
                                class="space-y-2 sm:flex sm:items-baseline sm:justify-between sm:space-y-0 md:min-w-0 md:flex-1">
                                <div></div>
                                <div>
                                    <span class="font-semibold">Item:</span>
                                    {{ rental.rental_item.title }}
                                </div>
                            </div>
                        </div>

                        <div class="mt-2 flow-root divide-y divide-gray-200 border-t border-t-gray-200">
                            <div class="pt-4 sm:flex flex-col items-center">
                                <div class="flex space-x-2 sm:min-w-0 sm:flex-1">
                                    <img :src="rental.rental_item.images[0]
                                        ?.image_sm
                                        " :alt="rental.rental_item.images[0]
                                            ?.alt_image_sm
                                            " class="size-20 flex-none rounded-md object-fit sm:size-24" />
                                    <div class="min-w-0 flex-1 pt-1.5 sm:pt-0">
                                        <p class="mt-1 font-medium">
                                            <span>Total Paid: </span>€{{
                                                rental.total_price
                                            }}
                                        </p>
                                        <p class="whitespace-nowrap text-sm mt-1">
                                            Rental Start:
                                            <br class="sm:hidden" />
                                            <time class="font-bold text-lg" :datetime="rental.start_date
                                                ">{{
                                                    $formatDate(
                                                        rental.start_date,
                                                    )
                                                }}</time>
                                        </p>
                                        <p class="whitespace-nowrap text-sm mt-1">
                                            Rental End:
                                            <br class="sm:hidden" />
                                            <time :datetime="rental.end_date">{{
                                                $formatDate(
                                                    rental.end_date,
                                                )
                                            }}</time>
                                        </p>
                                        <div class="mt-4 text-xs bg-gray-200 dark:bg-gray-800 p-1 rounded-lg">
                                            <p class="whitespace-nowrap mt-1">
                                                Rental Price: €{{
                                                    rental.rental_price
                                                }}
                                            </p>
                                            <p class="whitespace-nowrap mt-1">
                                                Platform Fee: €{{
                                                    rental.platform_fee
                                                }}
                                            </p>
                                            <p class="whitespace-nowrap mt-1">
                                                VAT: €{{ rental.vat }} ({{
                                                    rental.vat_rate
                                                }}%)
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div class="space-y-4 w-full sm:flex-none pt-4">
                                    <Link as="button" href="#"
                                        class="flex w-full items-center justify-center rounded-md border border-transparent bg-teal-600 px-2.5 py-2 text-sm font-medium text-white shadow-xs hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:outline-hidden sm:grow-0 transition-all ease-in-out duration-200">
                                    <EnvelopeIcon class="size-5 mr-1" />
                                    Remind Lister
                                    </Link>

                                    <!--view rental-->
                                    <ViewRentalButton :rental-id="rental.id" />

                                    <CancelButton @click="changeRentalStatus(rental.id, 'renter cancelled',)">Cancel
                                    </CancelButton>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
                <div v-else class="flex justify-center w-full">
                    <p class="w-1/2 bg-white dark:bg-transparent p-2 rounded-lg text-center">You have no pending sent
                        rental
                        requests.</p>
                </div>
            </div>
        </div>
    </div>
</template>