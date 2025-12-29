<script setup>
import { onMounted } from "vue";
import { RouterLink } from "vue-router";

import { useCategories } from '@/composables/useCategories'
import { useRecentItems } from '@/composables/useRecentItems'

import CategoryCard from "@/components/CategoryCard.vue";
import HomePageCard from "@/components/HomePageCard.vue";
import ItemSearchBar from "@/components/ItemSearchBar.vue";
import RecentItemsSwiper from "@/components/RecentItemsSwiper.vue";
import api from '@/lib/api'
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore()

const {
  categories,
  loading: categoriesLoading,
  error: categoriesError,
  load: loadCategories,
} = useCategories()

const {
  items: recentItems,
  loading: recentLoading,
  error: recentError,
  load: loadRecentItems,
} = useRecentItems()

onMounted(() => {
  loadCategories()
  loadRecentItems()
})

</script>

<template>
  <!-- Hero Section -->
  <section
    class="relative bg-gradient-to-br from-teal-600/30 via-teal-600/10 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto text-center">
      <!-- Main Headline -->
      <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
        {{ $t("Why buy when you can rent") }}<span class="animate-blink text-teal-600"
          style="animation-delay: 0.5s">.</span>
        <span class="animate-blink text-teal-600" style="animation-delay: 0.75s">.</span>
        <span class="animate-blink text-teal-600" style="animation-delay: 1s">.</span>
      </h1>

      <!-- Subtitle -->
      <p class="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
        Discover a smarter way to access <span class="font-bold text-teal-600">what</span> you
        need, <span class="font-bold text-teal-600">when</span> you need it. Whether it's tools,
        gear, or everyday essentials, renting gives you freedom, flexibility, and saves you money
        <span class="font-bold text-teal-600">without</span> the clutter and
        <span class="font-bold text-teal-600">with</span> all the environmental benefits...
      </p>

      <!-- Search Bar -->
      <div class="max-w-3xl mx-auto">
        <ItemSearchBar placeholder="Search for items to rent..." href="#" class="w-full" />
      </div>
    </div>
  </section>

  <!-- Recent Items Section -->

  <section v-if="recentItems.length > 0"
    class="py-6 mt-2 px-4 sm:px-8  bg-white shadow-lg dark:bg-gray-900 max-w-7xl mx-auto">
    <RecentItemsSwiper :items="recentItems" />
  </section>

  <!-- Features Section (Why Rent + How It Works) -->
  <section class="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Why Rent -->
        <div>
          <h2 class="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Why Rent?
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <HomePageCard title="Save Money">
              <span>
                Renting is often cheaper than buying. Find great deals on items you need for
                short-term use.
              </span>
            </HomePageCard>

            <HomePageCard title="Earn Extra Cash">
              <span>
                Have items lying around? List them on our platform and turn them into a steady
                stream of income.
              </span>
            </HomePageCard>

            <HomePageCard title="Eco-Friendly">
              <span>
                Renting reduces waste and promotes a circular economy. Use only what you need
                and return it when you're done.
              </span>
            </HomePageCard>

            <HomePageCard title="Wide Selection">
              <span>
                From power tools to party supplies, electronics to sporting gear, we have a
                diverse range of items available for rent.
              </span>
            </HomePageCard>
          </div>
        </div>

        <!-- How It Works -->
        <div>
          <h2 class="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-white mb-8">
            How it works
          </h2>
          <div class="space-y-6">
            <HomePageCard title="Browse Listings">
              <span>
                Search for items you need from our vast community of renters. Filter by category,
                location, and availability.
              </span>
            </HomePageCard>

            <HomePageCard title="Request to Rent">
              <span>
                Once you find the perfect item, send a rental request for your dates/times.
              </span>
            </HomePageCard>

            <HomePageCard title="Payment">
              <span>
                Once the lister has accepted your request to rent you make payment.
              </span>
            </HomePageCard>

            <HomePageCard title="Arrange Pick-up">
              <span>
                Co-ordinate with the lister for pick-up.
              </span>
            </HomePageCard>

            <HomePageCard title="Use & Return">
              <span>
                Enjoy your rental! When you're done, return it in the same condition as when you
                received it.
              </span>
            </HomePageCard>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Categories Section -->
  <section v-if="categories.length > 0" class="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
    <div class="max-w-7xl mx-auto">
      <h2 class="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
        Browse by Category
      </h2>
      <div class="flex flex-wrap justify-center gap-6">
        <div v-for="category in categories" :key="category.category">
          <CategoryCard :category="category" />
        </div>
      </div>
    </div>
  </section>

  <!-- Why Choose Us Section -->
  <section class="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
    <div class="max-w-7xl mx-auto">
      <h2 class="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
        Why Choose rent-locally.com?
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <HomePageCard title="Trusted Community">
          <span>
            Enjoy your rental! When you're done, return it in the same condition as when you
            received it.
          </span>
        </HomePageCard>

        <HomePageCard title="Secure Transactions">
          <span>
            We use the latest technology to keep your personal and payment information safe.
          </span>
        </HomePageCard>

        <HomePageCard title="24/7 Support">
          <span>
            Our customer service team is always here to help with any questions or issues.
          </span>
        </HomePageCard>
      </div>
    </div>
  </section>

  <!-- CTA Section -->
  <section v-if="!auth.isAuthenticated"
    class="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-teal-600 to-teal-700 dark:from-teal-700 dark:to-teal-800">
    <div class="max-w-4xl mx-auto text-center">
      <h2 class="text-3xl sm:text-5xl font-bold text-white mb-6">
        Get Started Today!
      </h2>
      <p class="text-xl text-teal-50 mb-10 leading-relaxed">
        Whether you need something for a day, a week, or longer, rent-locally.com makes renting
        simple, affordable, and sustainable. Join our community and start renting smarter today.
      </p>
      <RouterLink to="/signup"
        class="inline-block bg-white text-teal-600 hover:bg-gray-100 focus:bg-gray-50 active:bg-gray-200 font-bold py-4 px-10 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
        Sign Up
      </RouterLink>
    </div>
  </section>
</template>
