<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { StarIcon } from "@heroicons/vue/20/solid";
import { ArrowPathIcon, HeartIcon, MinusIcon, PlusIcon } from "@heroicons/vue/24/outline";
import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
} from "@headlessui/vue";

import ItemStarRating from "@/components/ItemStarRating.vue";
import InputError from "@/components/InputError.vue";
import FormInfo from "@/components/FormInfo.vue";
import Datepicker from "@/components/Datepicker.vue";
import { RouterLink, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { addFavourite, deleteFavourite } from "@/api/favourites";
import {
    fetchRentalItem,
    calculateRentalPrice,
    requestRental,
} from '@/api/rentalItems';
import LoadingState from "@/components/LoadingState.vue";

const auth = useAuthStore();
const user = computed(() => auth.user);
const isFavourite = computed(() => favouriteId.value !== null)
const isTogglingFavourite = ref(false)
const route = useRoute();
const rentalItem = ref(null);
const unavailableDates = ref([])
const favouriteId = ref(null)
const isLoading = ref(true)
const loadError = ref(null)
const discountCode = ref("");
const isCalculatingPrice = ref(false)
const calculatedPrice = ref(null);
const priceError = ref(null);
const form = ref({
    start_date: null,
    end_date: null,
    total_days: null,
    discount_code: null,
    rental_price: null,
    platform_fee: null,
    lister_fee: null,
    vat: null,
    vat_rate: null,
    total_price: null,
});

const loadItem = async () => {
    try {
        const { data } = await fetchRentalItem(route.params.slug)
        rentalItem.value = data.rentalItem
        unavailableDates.value = data.unavailableDates
        favouriteId.value = data.favouriteId
    } catch (e) {
        loadError.value = 'Item not found'
    } finally {
        isLoading.value = false
    }
}

const createFavourite = async (slug) => {
    if (isTogglingFavourite.value) return

    isTogglingFavourite.value = true
    try {
        const { data } = await addFavourite(slug)
        favouriteId.value = data
    } catch (e) {
        console.error(e)
    } finally {
        isTogglingFavourite.value = false
    }
}

const removeFavourite = async (id) => {
    if (isTogglingFavourite.value) return

    isTogglingFavourite.value = true
    try {
        await deleteFavourite(id)
        favouriteId.value = null
    } catch (e) {
        console.error(e)
    } finally {
        isTogglingFavourite.value = false
    }
}

onMounted(loadItem)

const calculatePrice = async () => {
    if (!selectedDates.value.start || !selectedDates.value.end) return

    isCalculatingPrice.value = true
    priceError.value = null

    try {
        const { data } = await calculateRentalPrice({
            item_id: rentalItem.value.id,
            from_date: selectedDates.value.start,
            to_date: selectedDates.value.end,
            discount_code: discountCode.value || null,
        })
        calculatedPrice.value = data
    } catch (e) {
        priceError.value = 'Price calculation failed'
    } finally {
        isCalculatingPrice.value = false
    }
}

//reset form
const reset = () => {
    calculatedPrice.value = null
    selectedDates.value = {
        start: null,
        end: null,
    };
}

const selectedDates = ref({
    start: null,
    end: null,
})

watch(selectedDates, (range) => {
    calculatedPrice.value = null

    if (range.start && range.end) {
        calculatePrice()
    }
})

/*TODO: Add props:
Reviews
Questions & replies
*/

const reviews = {
    average: 4,
    featured: [
        {
            id: 1,
            rating: 5,
            content: `
        <p>This icon pack is just what I need for my latest project. There's an icon for just about anything I could ever need. Love the playful look!</p>
      `,
            date: "July 16, 2021",
            datetime: "2021-07-16",
            author: "Emily Selman",
            avatarSrc:
                "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80",
        },
        {
            id: 2,
            rating: 5,
            content: `
        <p>Blown away by how polished this icon pack is. Everything looks so consistent and each SVG is optimized out of the box so I can use it directly with confidence. It would take me several hours to create a single icon this good, so it's a steal at this price.</p>
      `,
            date: "July 12, 2021",
            datetime: "2021-07-12",
            author: "Hector Gibbons",
            avatarSrc:
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80",
        },
    ],
};

const faqs = [
    {
        question: "What format are these icons?",
        answer: "The icons are in SVG (Scalable Vector Graphic) format. They can be imported into your design tool of choice and used directly in code.",
    },
    {
        question: "Can I use the icons at different sizes?",
        answer: "Yes. The icons are drawn on a 24 x 24 pixel grid, but the icons can be scaled to different sizes as needed. We don't recommend going smaller than 20 x 20 or larger than 64 x 64 to retain legibility and visual balance.",
    },
    // More FAQs...
];
</script>

<template>
    <LoadingState v-if="isLoading" />

    <div v-else class="w-full px-6 py-2 sm:pb-12 sm:pt-4 sm:px-6 lg:px-12 dark:bg-gray-800">
        <h1 class="text-2xl font-semibold text-red-500 text-center">Lister Item View (todo)</h1>
        <div class="xl:grid xl:grid-cols-2 xl:items-start items-center xl:gap-x-6 pb-24 pt-4">
            <div class="flex flex-col gap-6">
                <!-- Image gallery -->
                <TabGroup as="div"
                    class="flex xl:flex-row xl:gap-4 xl:justify-center xl:items-start flex-col-reverse gap-4 items-center w-full h-full">

                    <!-- Image selector -->
                    <div>
                        <TabList class="grid grid-cols-6 xl:grid-cols-1 gap-2 w-full">
                            <Tab v-for="image in rentalItem.images" :key="image.id"
                                class="relative cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-black hover:bg-app-50 focus:outline-none focus:ring-0"
                                v-slot="{ selected }">
                                <!--<span class="sr-only">{{ image.name }}</span>-->
                                <span class="rounded">
                                    <img :src="image.image_sm" :alt="image.alt_image_sm"
                                        class="aspect-square rounded object-fit sm:h-[5rem] sm:w-[6rem] w-full" />
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

                    <!--selected image-->
                    <TabPanels>
                        <TabPanel v-for="image in rentalItem.images" :key="image.id"
                            class="flex flex-col items-center justify-center">
                            <img :src="image.image_md" :alt="image.alt_image_md"
                                class="h-76 w-full sm:h-[36rem] sm:w-[42rem] center rounded-lg object-fit aspect-square" />
                        </TabPanel>
                    </TabPanels>
                </TabGroup>

                <!--section for FAQ and Reviews-->
                <div class="mx-auto w-full max-w-2xl lg:col-span-1 lg:mt-0 lg:max-w-xl">
                    <TabGroup as="div">
                        <div class="border-b border-gray-200">
                            <TabList class="-mb-px flex space-x-8">
                                <Tab as="template" v-slot="{ selected }">
                                    <button :class="[
                                        selected
                                            ? 'border-black outline-0'
                                            : 'border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-800',
                                        'whitespace-nowrap border-b-2 py-6 text-sm font-medium',
                                    ]">
                                        Customer Reviews
                                    </button>
                                </Tab>
                                <Tab as="template" v-slot="{ selected }">
                                    <button :class="[
                                        selected
                                            ? 'border-black outline-0'
                                            : 'border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-800',
                                        'whitespace-nowrap border-b-2 py-6 text-sm font-medium',
                                    ]">
                                        FAQ
                                    </button>
                                </Tab>
                            </TabList>
                        </div>
                        <TabPanels as="template">
                            <TabPanel class="-mb-10">
                                <h3 class="sr-only">Customer Reviews</h3>

                                <div v-for="(
review, reviewIdx
                                        ) in reviews.featured" :key="review.id"
                                    class="flex space-x-4 text-sm text-gray-500">
                                    <div class="flex-none py-10">
                                        <img :src="review.avatarSrc" alt="" class="size-10 rounded-full bg-gray-100" />
                                    </div>
                                    <div :class="[
                                        reviewIdx === 0
                                            ? ''
                                            : 'border-t border-gray-200',
                                        'py-10',
                                    ]">
                                        <h3 class="font-medium text-gray-900">
                                            {{ review.author }}
                                        </h3>
                                        <p>
                                            <time :datetime="review.datetime">{{ review.date }}</time>
                                        </p>

                                        <div class="mt-4 flex items-center">
                                            <StarIcon v-for="rating in [
                                                0, 1, 2, 3, 4,
                                            ]" :key="rating" :class="[
                                                review.rating > rating
                                                    ? 'text-yellow-400'
                                                    : 'text-gray-300',
                                                'size-5 shrink-0',
                                            ]" aria-hidden="true" />
                                        </div>
                                        <p class="sr-only">
                                            {{ review.rating }} out of 5
                                            stars
                                        </p>

                                        <div class="mt-4 text-sm/6 text-gray-500" v-html="review.content" />
                                    </div>
                                </div>
                            </TabPanel>
                            <!-- Item Faqs-->
                            <TabPanel class="text-sm text-gray-500">
                                <h3 class="sr-only">
                                    Frequently Asked Questions
                                </h3>

                                <dl>
                                    <template v-for="faq in faqs" :key="faq.question">
                                        <dt class="mt-10 font-medium text-gray-900">
                                            {{ faq.question }}
                                        </dt>
                                        <dd class="mt-2 text-sm/6 text-gray-500">
                                            <p>{{ faq.answer }}</p>
                                        </dd>
                                    </template>
                                </dl>
                            </TabPanel>
                        </TabPanels>
                    </TabGroup>
                </div>
            </div>

            <!-- Product info -->
            <div
                class="mt-6 px-4 sm:mt-16 sm:px-0 lg:mt-0 w-full flex flex-col items-start text-black dark:text-gray-200">
                <!--title row-->
                <div class="flex flex-row justify-between w-3/4">
                    <h1 class="text-3xl font-bold tracking-tight text-inherit w-full pb-2">
                        {{ rentalItem.title }}
                    </h1>

                    <!--favourites-->
                    <div v-if="user">
                        <div v-if="isFavourite" @click="removeFavourite(favouriteId)"
                            :class="{ 'opacity-50 pointer-events-none': isTogglingFavourite }"
                            class="text-nowrap rounded-lg p-2 flex flex-row gap-1 items-center bg-transparent text-gray-600 hover:text-teal-600 hover:cursor-pointer transition-all ease-in-out duration-200">
                            <HeartIcon class="size-7 shrink-0" aria-hidden="true" />Remove Favourite
                        </div>
                        <div v-else @click="createFavourite(rentalItem.slug)"
                            :class="{ 'opacity-50 pointer-events-none': isTogglingFavourite }"
                            class="text-nowrap rounded-lg p-2 flex flex-row gap-1 items-center bg-transparent text-gray-600 hover:text-teal-600 hover:cursor-pointer transition-all ease-in-out duration-200">
                            <HeartIcon class="size-7 shrink-0" aria-hidden="true" />Add to Favourites
                        </div>
                    </div>
                </div>

                <!-- Review Stars -->
                <div class="flex flex-row items-end">
                    <ItemStarRating :star_rating="rentalItem?.item_rating" />
                    <div>
                        <p class="text-gray-500 text-sm pl-1 align-text-bottom -mb-0.5">
                            (0)
                        </p>
                    </div>
                </div>

                <!--pricing-->
                <div class="mt-3 sm:w-3/4 text-inherit">
                    <h2 class="text-2xl font-semibold tracking-normal pb-2 min-w-full border-b border-teal-600/40">
                        Pricing
                    </h2>
                    <div class="flex flex-row-wrap gap-6 py-2 items-center justify-start">
                        <div>
                            <h1 class="font-semibold text-xl">Per Day</h1>
                            <p class="text-2xl tracking-tight">
                                &#8364; {{ rentalItem.price_per_day }}
                            </p>
                        </div>

                        <div v-if="rentalItem.price_7_days != 0">
                            <h1 class="font-semibold text-xl">7 days</h1>
                            <p class="text-2xl tracking-tight">
                                &#8364; {{ rentalItem.price_7_days }}
                            </p>
                        </div>

                        <div v-if="rentalItem.price_30_days != 0">
                            <h1 class="font-semibold text-xl">30 days</h1>
                            <p class="text-2xl tracking-tight">
                                &#8364;
                                {{ rentalItem.price_30_days }}
                            </p>
                        </div>
                    </div>
                </div>

                <!--description-->
                <div class="sm:w-3/4 w-full">
                    <h2 class="text-2xl font-semibold tracking-tight pt-4 mb-2 w-full border-b pb-2 border-teal-600/40">
                        Item Description
                    </h2>

                    <div class="text-base w-full pb-4">
                        {{ rentalItem.description }}
                    </div>
                </div>

                <!--rental dates and request prices-->
                <div class="flex flex-col gap-4 sm:w-3/4 items-start pb-4 border-t border-teal-600/40">
                    <h1 class="pt-4 sm:text-center font-thin">
                        Select available dates to view pricing and book your rental!
                    </h1>

                    <Datepicker v-model="selectedDates" :bookedDates="unavailableDates" />

                    <div v-if="selectedDates.end" class="flex flex-col gap-2">
                        <button @click="reset"
                            class="p-1 bg-teal-600 rounded-lg text-gray-100 hover:bg-teal-800 transition-all ease-in-out duration-200 flex justify-center items-center gap-2">
                            <ArrowPathIcon class="size-5 text-gray-100" /> Reset
                        </button>
                        <p>Pickup Date: <span class="font-semibold">{{ $formatDate(selectedDates.start) }}</span>
                        </p>
                        <p>Return Date: <span class="font-semibold">{{ $formatDate(selectedDates.end) }}</span>
                        </p>
                    </div>

                    <div v-if="isCalculatingPrice" class="flex items-center gap-2 text-teal-600">
                        <svg class="animate-spin h-5 w-5 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z">
                            </path>
                        </svg>
                        Calculating prices...
                    </div>

                    <!--<input
                            v-model="discountCode"
                            type="text"
                            placeholder="Discount Code (optional)"
                            class="rounded-lg text-teal-800 border-teal-600 focus:border-teal-600 focus:ring-0 w-3/4"
                        />-->

                    <!--calculated price-->
                    <InputError v-if="priceError !== null" class="mt-2" :message="priceError" />

                    <ul v-if="calculatedPrice !== null"
                        class="flex flex-col gap-2 text-lg bg-teal-600/10 dark:text-gray-300 w-full p-2 rounded-lg">
                        <li>
                            Rental Price: &#8364;{{
                                calculatedPrice.rental_price
                            }}
                        </li>
                        <li>
                            Platform Fee: &#8364;{{
                                calculatedPrice.platform_fee
                            }}
                        </li>
                        <li>
                            Vat: &#8364;{{ calculatedPrice.vat }} ({{
                                calculatedPrice.vat_rate
                            }}%)
                        </li>
                        <li class="border-t-2 border-gray-600 pt-2">
                            Total Price:
                            <span class="font-semibold">
                                &#8364;{{ calculatedPrice.total }}
                            </span>
                            for {{ calculatedPrice.rental_days }} days
                        </li>
                    </ul>
                </div>

                <!-- request to rent action-->
                <div v-if="calculatedPrice" class=" flex flex-col items-start gap-4 justify-center w-full">
                    <!--agree to terms-->
                    <FormInfo>
                        <p class="text-center">
                            {{
                                $t(
                                    "By submitting this form you confirm acceptance of the rent-locally.com",
                                )
                            }}
                            <RouterLink to="/terms" target="_blank" class="underline">{{ $t("terms & conditions")
                                }}</RouterLink>
                        </p>
                    </FormInfo>
                    <button v-if="user && user.can_rent && user.user_address_id" @click="submit()"
                        class="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-black px-8 py-3 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full transition-all ease-in-out duration-300">
                        Request to Rent
                    </button>
                    <button v-if="user && !user.can_rent" href="route('profile.edit')"
                        class="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-black px-8 py-3 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full transition-all ease-in-out duration-300">
                        Please confirm your identity to request rental.
                    </button>
                    <button v-if="user && !user.user_address_id" href="route('address/create')"
                        class="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-black px-8 py-3 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full transition-all ease-in-out duration-300">
                        At least one address is required to request a
                        rental.
                    </button>
                    <router-link v-if="!user" to="/login"
                        class="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-black px-8 py-3 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full transition-all ease-in-out duration-300">
                        Log in or Sign up to Request a rental
                    </router-link>
                </div>

                <!--Additional Details-->
                <section aria-labelledby="details-heading" class="mt-2 w-3/4">
                    <h2 id="details-heading" class="sr-only">
                        Additional details
                    </h2>

                    <div class="divide-y divide-gray-500">
                        <!--Key features-->
                        <Disclosure as="div" v-if="rentalItem.key_features" v-slot="{ open }">
                            <!--plus/minus button-->
                            <h3>
                                <DisclosureButton
                                    class="group relative flex w-full items-center justify-between py-6 text-left">
                                    <span>Key Features</span>
                                    <span class="ml-6 flex items-center">
                                        <PlusIcon v-if="!open"
                                            class="block size-6 group-hover:text-gray-500 transition-all ease-in-out duration-300"
                                            aria-hidden="true" />
                                        <MinusIcon v-else
                                            class="block size-6 group-hover:text-gray-500 transition-all ease-in-out duration-300"
                                            aria-hidden="true" />
                                    </span>
                                </DisclosureButton>
                            </h3>
                            <DisclosurePanel as="div" class="pb-6">
                                <ul role="list" class="list-disc space-y-1 pl-5 text-sm/6">
                                    <li class="pl-2">
                                        {{ rentalItem.key_features }}
                                    </li>
                                </ul>
                            </DisclosurePanel>
                        </Disclosure>

                        <!--Special Handling-->
                        <Disclosure as="div" v-if="rentalItem.special_handling" v-slot="{ open }">
                            <!--plus/minus button-->
                            <h3>
                                <DisclosureButton
                                    class="group relative flex w-full items-center justify-between py-6 text-left">
                                    <span>Special Handling</span>
                                    <span class="ml-6 flex items-center">
                                        <PlusIcon v-if="!open"
                                            class="block size-6 group-hover:text-gray-500 transition-all ease-in-out duration-300"
                                            aria-hidden="true" />
                                        <MinusIcon v-else
                                            class="block size-6 group-hover:text-gray-500 transition-all ease-in-out duration-300"
                                            aria-hidden="true" />
                                    </span>
                                </DisclosureButton>
                            </h3>
                            <DisclosurePanel as="div" class="pb-6">
                                <ul role="list" class="list-disc space-y-1 pl-5 text-sm/6">
                                    <li class="pl-2">
                                        {{ rentalItem.special_handling }}
                                    </li>
                                </ul>
                            </DisclosurePanel>
                        </Disclosure>
                    </div>
                </section>

                <!--Share Options-->
                <div class="border-t border-gray-500 pt-6 w-3/4">
                    <h3 class="text-lg font-medium dark:text-gray-300">
                        Share
                    </h3>
                    <ul role="list" class="mt-4 flex items-center space-x-6">
                        <li>
                            <a href="#"
                                class="flex size-8 items-center justify-center text-gray-500 hover:text-black dark:hover:text-inherit transition-all ease-in-out duration-200">
                                <span class="sr-only">Share on Facebook</span>
                                <svg class="size-8" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"
                                        clip-rule="evenodd" />
                                </svg>
                            </a>
                        </li>
                        <li>
                            <a href="#"
                                class="flex size-8 items-center justify-center text-gray-500 hover:text-black dark:hover:text-inherit transition-all ease-in-out duration-200">
                                <span class="sr-only">Share on Instagram</span>
                                <svg class="size-8" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                                    <path fill-rule="evenodd"
                                        d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                                        clip-rule="evenodd" />
                                </svg>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
