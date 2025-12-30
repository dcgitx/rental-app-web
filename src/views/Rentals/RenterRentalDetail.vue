<script setup>
import {
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
} from "@headlessui/vue";

const props = defineProps({
    rental: Object
});

</script>

<template>


    <div class="w-full flex flex-col items-center">

        <div class="flex flex-col gap-6 w-full justify-center">
            <div>
                <h1 class="text-2xl font-bold pt-10 text-center">Your Rental of - {{
                    rental.rental_item_title }}</h1>
            </div>

            <div class="flex flex-row gap-6 pt-4 w-full">
                <!--left-->
                <div class="w-full">
                    <!-- Image gallery -->
                    <TabGroup as="div" class="flex flex-col w-full items-end">
                        <!--selected image-->
                        <TabPanels>
                            <TabPanel v-for="image in rental.rental_item.images" :key="image.id"
                                class="flex flex-col items-center justify-end">
                                <img :src="image.image_md" :alt="image.alt_image_md"
                                    class="h-76 w-full sm:h-[24rem] sm:w-[24rem] center rounded-lg object-fit aspect-square" />
                            </TabPanel>
                        </TabPanels>

                        <!-- Image selector -->
                        <div class=" mt-6 sm:block w-full sm:w-[24rem]">
                            <TabList class="grid grid-cols-6 gap-2">
                                <Tab v-for="image in rental.rental_item.images" :key="image.id"
                                    class="relative cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-black hover:bg-app-50 focus:outline-none focus:ring-0"
                                    v-slot="{ selected }">
                                    <!--<span class="sr-only">{{ image.name }}</span>-->
                                    <span class="rounded">
                                        <img :src="image.image_sm" :alt="image.alt_image_sm"
                                            class="aspect-square rounded object-fit" />
                                    </span>
                                    <span :class="[
                                        selected
                                            ? 'ring-teal-600 bg-transparent'
                                            : 'ring-transparent',
                                        'pointer-events-none absolute inset-0 rounded-md ring ring-offset-0',
                                    ]" aria-hidden="true" />
                                </Tab>
                            </TabList>
                        </div>
                    </TabGroup>
                </div>

                <!--right-->
                <div class="flex flex-row w-full justify-start">
                    <div class="w-full flex flex-col">
                        <div class="flex flex-row justify-between w-full">
                            <h1 class="text-xl font-bold">Rental Details</h1>
                            <!--<h1 class="text-xl font-bold">Current Status: <span class=" first-letter:uppercase">{{
                                rental.status }}</span></h1>-->
                        </div>

                        <ul class="space-y-2 pt-2 text-sm">
                            <li>Rental ID: <span class="font-semibold">#{{ rental.id }}</span></li>
                            <li>Requested: <span class="font-semibold">{{ $formatDate(rental.created_at) }}</span>
                            </li>
                            <li>Start Date: <span class="font-semibold">{{ $formatDate(rental.start_date) }}</span>
                            </li>
                            <li>End Date: <span class="font-semibold">{{ $formatDate(rental.end_date) }}</span></li>
                            <li>Paid: <span class="font-semibold">{{ $formatMoney(rental.total_price)
                            }}</span></li>
                            <li>Vat ({{ rental.vat_rate }}%): <span class="font-semibold">{{
                                $formatMoney(rental.vat)
                            }}</span>
                            </li>
                            <li v-if="rental.is_refunded">Refunded: <span class="font-semibold">{{
                                $formatMoney(rental.refund_amount)
                            }}</span></li>

                        </ul>
                    </div>

                    <div class="w-full flex flex-col justify-start items-center">
                        <h1 class="font-bold pb-2 text-xl">Rental History</h1>

                        <div v-if="rental.transactions.length > 0">

                            <div class="flex flex-col justify-start items-start">

                                <div v-for="(transaction, index) in rental.transactions" :key="transaction.id"
                                    class="flex flex-col items-center w-full">
                                    <!-- statuses -->
                                    <div class="text-center">

                                        <!-- pending -->
                                        <div v-if="transaction.to_status === 'pending'">
                                            <h1 class="first-letter:uppercase font-semibold text-md">
                                                Rental Requested
                                            </h1>
                                            <p class="text-xs">{{ $formatDate(transaction.created_at) }}</p>
                                        </div>

                                        <!-- booked -->
                                        <div v-if="transaction.to_status === 'booked'">
                                            <h1 class="first-letter:uppercase font-semibold text-md">
                                                Request Accepted
                                            </h1>
                                            <p class="text-xs">{{ $formatDate(transaction.created_at) }}</p>
                                        </div>

                                        <!-- declined -->
                                        <div v-if="transaction.to_status === 'declined'">
                                            <h1 class="first-letter:uppercase font-semibold text-md">
                                                Rental Request Declined
                                            </h1>
                                            <p class="text-xs">{{ $formatDate(transaction.created_at) }}</p>
                                        </div>

                                        <!-- started -->
                                        <div v-if="transaction.to_status === 'started'">
                                            <h1 class="first-letter:uppercase font-semibold text-md">
                                                Rental Started
                                            </h1>
                                            <p class="text-xs">{{ $formatDate(transaction.created_at) }}</p>
                                        </div>

                                        <!-- completed -->
                                        <div v-if="transaction.to_status === 'completed'">
                                            <h1 class="first-letter:uppercase font-semibold text-md">
                                                Rental Completed
                                            </h1>
                                            <p class="text-xs">{{ $formatDate(transaction.created_at) }}</p>
                                        </div>

                                        <!-- expired -->
                                        <div v-if="transaction.to_status === 'expired'">
                                            <h1 class="first-letter:uppercase font-semibold text-md">
                                                Rental Request Expired
                                            </h1>
                                            <p class="text-xs">{{ $formatDate(transaction.created_at) }}</p>
                                        </div>

                                        <!-- renter cancelled -->
                                        <div v-if="transaction.to_status === 'renter cancelled'">
                                            <h1 class="first-letter:uppercase font-semibold text-md">
                                                Rental Cancelled
                                            </h1>
                                            <p class="text-xs">{{ $formatDate(transaction.created_at) }}</p>
                                        </div>

                                        <!-- lister cancelled -->
                                        <div v-if="transaction.to_status === 'lister cancelled'">
                                            <h1 class="first-letter:uppercase font-semibold text-md">
                                                Lister Cancelled
                                            </h1>
                                            <p class="text-xs">{{ $formatDate(transaction.created_at) }}</p>
                                        </div>

                                        <!-- rental refunded -->
                                        <div v-if="transaction.to_status === 'refunded'">
                                            <h1 class="first-letter:uppercase font-semibold text-md">
                                                Rental Refunded
                                            </h1>
                                            <p class="text-xs">{{ $formatDate(transaction.created_at) }}</p>
                                        </div>
                                    </div>

                                    <div v-if="index < rental.transactions.length - 1"
                                        class="flex flex-col items-center py-1">
                                        <div class="h-4 w-px bg-gray-400 dark:bg-gray-500"></div>
                                        <div class="w-2 h-2 bg-teal-600 dark:bg-teal-700 rounded-full"></div>
                                        <div class="h-4 w-px bg-gray-400 dark:bg-gray-500"></div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div v-else>No Transaction data available.</div>
                    </div>
                    <div class="w-full"></div>
                </div>


            </div>
        </div>
    </div>

</template>
