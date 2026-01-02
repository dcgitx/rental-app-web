<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'

//import SearchBar from "@/components/SearchBar.vue"
import SmallItemCard from "@/components/SmallItemCard.vue"
import PrimaryButton from "@/components/PrimaryButton.vue"

import { fetchMyitems } from "@/api/rentalItems"
import LoadingState from '@/components/LoadingState.vue'

const router = useRouter()

const items = ref([])
const page = ref(1)
const lastPage = ref(null)
const total = ref(0)

const isLoading = ref(false)

const hasMore = computed(() => {
    return lastPage.value === null || page.value <= lastPage.value
})


const fetchItems = async () => {
    if (isLoading.value || !hasMore.value) return

    isLoading.value = true

    try {
        const { data } = await fetchMyitems({
            page: page.value,
        })

        items.value.push(...data.data)
        total.value = data.meta.total
        lastPage.value = data.meta.last_page
        page.value++
    } finally {
        isLoading.value = false
    }
}

const loadMoreTrigger = ref(null)

onMounted(async () => {
    await nextTick()
    fetchItems()
    const observer = new IntersectionObserver(
        ([entry]) => {
            if (entry.isIntersecting) {
                fetchItems()
            }
        },
        {
            root: null,
            rootMargin: '100px',
            threshold: 0,
        }
    )
    if (loadMoreTrigger.value) {
        observer.observe(loadMoreTrigger.value)
    }
})

const isInitialLoading = computed(() => {
    return isLoading.value && items.value.length === 0
})

const isLoadingMore = computed(() => {
    return isLoading.value && items.value.length > 0
})
</script>

<template>

    <div class="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div class="max-w-7xl mx-auto">
            <!-- Header -->
            <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
                <div>
                    <h1 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {{ $t("My Listings") }}
                    </h1>
                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {{ $t("Manage your rental items.") }}
                        <span v-if="total > 0"
                            class="ml-1 inline-flex items-center rounded-full bg-teal-600/30 dark:bg-teal-900/30 px-2.5 py-0.5 text-xs font-medium text-teal-600 dark:text-teal-300">
                            {{ total }}
                        </span>
                    </p>
                </div>

                <div class="flex items-center gap-4">
                    <button @click="router.push({ name: 'lister.rentalItem.create' })">
                        <PrimaryButton class="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                                class="w-5 h-5">
                                <path
                                    d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                            </svg>
                            {{ $t("Create New") }}
                        </PrimaryButton>
                    </button>
                </div>
            </div>

            <!-- Search & Content -->
            <div class="flex flex-col items-center w-full">
                <!--<div class="w-full max-w-xl mb-8">
                    <SearchBar placeholder="Search your listings..." class="w-full" />
                </div>-->

                <LoadingState v-if="isInitialLoading" />

                <!-- Listings -->
                <div v-else-if="items.length > 0" class="w-full">
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <router-link v-for="item in items" :key="item.id"
                            :to="{ name: 'lister.rentalItem.show', params: { slug: item.slug } }"
                            class="group relative flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md hover:border-teal-500/50 dark:hover:border-teal-500/50 transition-all duration-200">
                            <div class="p-4 flex-1">
                                <SmallItemCard :item="item" />
                            </div>

                            <!-- Status Badge -->
                            <div
                                class="px-4 py-2 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center text-xs">
                                <span class="text-gray-500 dark:text-gray-400">
                                    {{ $t("Created") }}:
                                    {{ new Date(item.created_at).toLocaleDateString() }}
                                </span>
                                <span class="px-2 py-0.5 rounded-full font-medium" :class="{
                                    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400': item.status === 'Active',
                                    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400': item.status === 'Pending Review',
                                    'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300': item.status === 'Inactive',
                                    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400': item.status === 'On Rental'
                                }">
                                    {{ item.status }}
                                </span>
                            </div>
                        </router-link>

                    </div>
                    <div v-if="isLoadingMore" class="flex justify-center py-6 col-auto">
                        <LoadingState />
                    </div>
                </div>

                <!-- Empty State -->
                <div v-else-if="!isLoading" class="text-center py-12">
                    <div
                        class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-8 h-8 text-gray-400">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                        </svg>
                    </div>
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                        {{ $t("No listings found") }}
                    </h3>
                    <p class="mt-1 text-gray-500 dark:text-gray-400">
                        {{ $t("Get started by creating your first rental item.") }}
                    </p>
                    <div class="mt-6">
                        <button @click="router.push({ name: 'lister.rentalItem.create' })">
                            <PrimaryButton>
                                {{ $t("Create New Listing") }}
                            </PrimaryButton>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Infinite scroll trigger -->
    <div ref="loadMoreTrigger" class="h-1"></div>
</template>
