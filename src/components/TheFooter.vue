<script setup>
import FacebookLogo from "./FacebookLogo.vue";
import InstagramLogo from "./InstagramLogo.vue";

// TEMPORARY until API + Pinia store is ready
const socials = [
    { name: "Facebook", url: "https://facebook.com" },
    { name: "Instagram", url: "https://instagram.com" }
];

// You can update these when router paths are final
const footerLinks = [
    { name: "About Us", path: "/about", external: false },
    { name: "FAQs", path: "/faqs", external: false },
    { name: "Contact Us", path: "/contact-us", external: false },
    { name: "Terms & Conditions", path: "/terms", external: true },
    { name: "Privacy Policy", path: "/privacy", external: true }
];
</script>

<template>
    <footer class="lg:py-36 py-12 text-center text-lg bg-black min-w-full text-gray-200">
        <!-- Socials -->
        <div class="w-full flex flex-row-reverse justify-center lg:-mt-12 pb-6 gap-4">
            <div v-for="social in socials" :key="social.name">
                <a :href="social.url" target="_blank">
                    <InstagramLogo v-if="social.name === 'Instagram'" />
                    <FacebookLogo v-else-if="social.name === 'Facebook'" />
                </a>
            </div>
        </div>

        <!-- Copyright -->
        <p>
            &copy; {{ new Date().getFullYear() }} rent-locally.com — All Rights Reserved.
        </p>

        <!-- Footer Navigation -->
        <nav class="mt-4">
            <template v-for="link in footerLinks" :key="link.name">
                <!-- Internal link -->
                <router-link v-if="!link.external" :to="link.path" class="text-gray-400 hover:text-white mx-2">
                    {{ link.name }}
                </router-link>

                <!-- External link -->
                <a v-else :href="link.path" target="_blank" class="text-gray-400 hover:text-white mx-2">
                    {{ link.name }}
                </a>
            </template>
        </nav>
    </footer>
</template>
