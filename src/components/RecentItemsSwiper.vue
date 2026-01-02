<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, Navigation } from "swiper/modules";
import { MapPinIcon } from "@heroicons/vue/24/solid";

import "swiper/css";
import "swiper/css/navigation";

defineProps({
    items: {
        type: Array,
        required: true,
    },
});

const modules = [Autoplay, Navigation];
</script>

<template>
    <Swiper :modules="modules" :loop="true" :speed="2000" :space-between="30" :autoplay="{
        delay: 4000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
    }" :breakpoints="{
        200: { slidesPerView: 1, spaceBetween: 10 },
        380: { slidesPerView: 2, spaceBetween: 10 },
        640: { slidesPerView: 2, spaceBetween: 20 },
        768: { slidesPerView: 3, spaceBetween: 20 },
        1024: { slidesPerView: 4, spaceBetween: 20 },
        1280: { slidesPerView: 5, spaceBetween: 20 },
    }" class="relative">
        <SwiperSlide v-for="item in items" :key="item.id" class="p-4 border border-gray-200 dark:border-gray-700 rounded-xl
             hover:shadow-lg hover:border-teal-400 dark:hover:border-teal-500
             transition-all duration-300 bg-white dark:bg-gray-800">
            <RouterLink :to="{ name: 'item.show', params: { slug: item.slug } }"
                class="flex flex-col items-center h-full">
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3
                 text-center line-clamp-2 h-10">
                    {{ item.title }}
                </h3>

                <!-- Image -->
                <img v-if="item.image" :src="item.image.src" :alt="item.image.alt || 'Item image'"
                    class="w-full h-32 object-cover rounded-lg mb-3" />

                <!-- Placeholder -->
                <div v-else class="w-full h-32 flex items-center justify-center
                 bg-gray-100 dark:bg-gray-700 rounded-lg mb-3">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 3L6 6M21 21L19.8 19.8M9.7 4.1C9.8 4 9.9 4 10 4H13.5
                 C13.8 4 14 4 14.2 4.1C14.8 4.2 15.3 4.5 15.6 5
                 C15.7 5.1 15.8 5.3 16 5.7L16.8 6H17.8
                 C18.9 6 19.5 6 19.9 6.2
                 C20.3 6.4 20.6 6.7 20.8 7.1
                 C21 7.5 21 8.1 21 9.2V15.3M19.8 19.8
                 C19.4 20 18.9 20 17.8 20H6.2
                 C5.1 20 4.5 20 4.1 19.8
                 C3.7 19.6 3.4 19.3 3.2 18.9
                 C3 18.5 3 17.9 3 16.8V9.2
                 C3 8.1 3 7.5 3.2 7.1
                 C3.4 6.7 3.7 6.4 4.1 6.2
                 C4.5 6 5 6 6 6" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </div>

                <!-- Distance -->
                <div class="flex items-center gap-1 text-xs
                 text-gray-600 dark:text-gray-400 mt-auto">
                    <MapPinIcon class="w-4 h-4 text-teal-600" />
                    <span>
                        {{
                            item.distance_km < 1 ? item.distance_m + "m" : item.distance_km + "km" }} </span>
                </div>
            </RouterLink>
        </SwiperSlide>
    </Swiper>
</template>

<style scoped>
/* Swiper navigation buttons */
:deep(.swiper-button-prev),
:deep(.swiper-button-next) {
    color: #0d9488;
    /* teal-600 */
    width: 2rem;
    height: 4rem;
    top: 60%;
}

:deep(.swiper-button-prev) {
    left: 0.5rem;
}

:deep(.swiper-button-next) {
    right: 0.5rem;
}
</style>
