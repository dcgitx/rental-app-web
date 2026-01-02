<script setup>
import { ref } from "vue";
import { acceptRental, cancelRental, declineRental } from "@/api/rentals";
import { EnvelopeIcon } from "@heroicons/vue/24/outline";
import CancelButton from "@/components/CancelButton.vue";
import ViewRentalButton from "@/components/ViewRentalButton.vue";
import ContactButton from "@/views/rentals/partials/ContactButton.vue";

const props = defineProps({
    listerRentals: Array,
    renterRentals: Array,
    onRefresh: Function,
});

const activeTabIndex = ref(0);
const loading = ref(false);

const tabs = [
    { title: 'Your Items' },
    { title: 'Your Rentals' },
];

const accept = async (id) => {
    await acceptRental(id)
    await props.onRefresh();
};

const decline = async (id) => {
    await declineRental(id)
    await props.onRefresh();
};

const cancel = async (id) => {
    await cancelRental(id)
    await props.onRefresh();
};
</script>

<template>
    <div>
        <!--tabs-->
        <div class="w-full flex justify-center">
            <div class="bg-gray-50 dark:bg-transparent rounded-t-lg">
                <div class="flex flex-row justify-center items-center text-md font-semibold gap-0">
                    <div v-for="(tab, index) in tabs" :key="index"
                        class="w-32 text-center rounded-t-lg border-gray-500 dark:bg-gray-800 py-2 dark:text-gray-400 transition-all ease-in-out duration-200 hover:cursor-pointer"
                        @click="activeTabIndex = index"
                        :class="{ 'is-active': activeTabIndex === index, 'bg-teal-600/30 dark:bg-teal-600/80 dark:text-gray-100': activeTabIndex === index }">
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
            <div v-show="activeTabIndex === 0" class="border-t border-gray-400 p-4 mb-4 sm:mb-12 w-full">
                <div v-if="listerRentals.length >= 1" class="flex flex-row flex-wrap gap-4 justify-center w-full">
                    <section v-for="rental in listerRentals" :key="rental.id" :aria-labelledby="`${rental.id}-heading`"
                        class="shadow-lg rounded-lg border p-4 bg-gray-50 dark:bg-black dark:text-gray-300 dark:border-gray-500">
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
                                    <img :src="rental.rental_item.image.src" :alt="rental.rental_item.image.alt"
                                        class="size-20 flex-none rounded-md object-fit sm:size-24" />
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
                                    <button @click="accept(rental.id)"
                                        class="flex w-full items-center justify-center rounded-md border border-transparent bg-teal-600 px-2.5 py-2 text-sm font-medium text-white shadow-xs hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:outline-hidden sm:grow-0 transition-all ease-in-out duration-200">
                                        <EnvelopeIcon class="size-5 mr-1" />
                                        Accept Rental
                                    </button>
                                    <ContactButton :rental-id="rental.id">Message Renter</ContactButton>
                                    <ViewRentalButton :rental-id="rental.id" />
                                    <CancelButton @click="decline(rental.id)">Decline</CancelButton>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
                <div v-else class="flex justify-center w-full">
                    <p class="w-1/2 bg-white dark:text-gray-400 dark:bg-transparent p-2 rounded-lg text-center">You have
                        no pending
                        received
                        rental requests.</p>
                </div>
            </div>

            <!--lister sent requests-->
            <div v-show="activeTabIndex === 1" class="border-t border-gray-400 p-4 mb-4 sm:mb-12 w-full">
                <div v-if="renterRentals.length >= 1" class="flex flex-row flex-wrap gap-4 justify-center w-full">
                    <section v-for="rental in renterRentals" :key="rental.id" :aria-labelledby="`${rental.id}-heading`"
                        class="shadow-lg rounded-lg border p-4 mb-4 bg-gray-50 dark:bg-black dark:text-gray-300 dark:border-gray-500">
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
                                    <img :src="rental.rental_item.image.src" :alt="rental.rental_item.image.alt"
                                        class="size-20 flex-none rounded-md object-fit sm:size-24" />
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
                                    <button
                                        class="flex w-full items-center justify-center rounded-md border border-transparent bg-teal-600 px-2.5 py-2 text-sm font-medium text-white shadow-xs hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:outline-hidden sm:grow-0 transition-all ease-in-out duration-200">
                                        <EnvelopeIcon class="size-5 mr-1" />
                                        Remind Lister (todo)
                                    </button>
                                    <ViewRentalButton :rental-id="rental.id" />
                                    <CancelButton @click="cancel(rental.id)">Cancel</CancelButton>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
                <div v-else class="flex justify-center w-full">
                    <p class="w-1/2 bg-white dark:text-gray-400 dark:bg-transparent p-2 rounded-lg text-center">You have
                        no pending sent
                        rental
                        requests.</p>
                </div>
            </div>
        </div>
    </div>
</template>