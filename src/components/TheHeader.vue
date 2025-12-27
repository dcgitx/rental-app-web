    <script setup>
    import { storeToRefs } from 'pinia'
    import { GlobeAltIcon } from "@heroicons/vue/24/outline";

    import AppLogo from "@/components/AppLogo.vue";
    import FacebookLogo from "@/components/FacebookLogo.vue";
    import InstagramLogo from "@/components/InstagramLogo.vue";
    import { useLocaleStore } from "@/stores/localeStore";

    // TEMP auth
    const isLoggedIn = false;

    // TEMP: Hardcoded socials
    const socials = [
        { name: "Facebook", url: "https://facebook.com" },
        { name: "Instagram", url: "https://instagram.com" },
    ];

    const localeStore = useLocaleStore()
    const { locale, available } = storeToRefs(localeStore)

    const localeSelected = (event) => {
        localeStore.setLocale(event.target.value)
    }
</script>
   <template>

    <header
        class="flex w-full flex-col items-center justify-center bg-teal-700/40 py-4 text-black sm:flex-row dark:bg-teal-600/80">

        <!-- Socials desktop -->
        <div class="hidden w-full flex-row items-center justify-center gap-4 sm:flex">
            <div v-for="social in socials" :key="social.name">
                <a :href="social.url" target="_blank">
                    <FacebookLogo v-if="social.name === 'Facebook'" />
                    <InstagramLogo v-else-if="social.name === 'Instagram'" />
                </a>
            </div>
        </div>

        <!-- Logo -->
        <router-link to="/" class="flex w-full flex-row items-center justify-center">
            <AppLogo class="p-4 md:p-0 lg:p-4" />
        </router-link>

        <!-- Socials mobile -->
        <div class="flex w-full flex-row items-center justify-center gap-4 py-6 sm:hidden">
            <div v-for="social in socials" :key="social.name">
                <a :href="social.url" target="_blank">
                    <FacebookLogo v-if="social.name === 'Facebook'" />
                    <InstagramLogo v-else-if="social.name === 'Instagram'" />
                </a>
            </div>
        </div>

        <!-- NAVIGATION -->
        <nav class="w-full">
            <div class="flex flex-col items-center justify-center gap-4 sm:pt-6">

                <!-- Guest Navigation -->
                <div v-if="!isLoggedIn" class="flex w-full flex-col items-center justify-center text-black">
                    <div>
                        <router-link to="/login"
                            class="rounded-md py-2 text-2xl font-medium tracking-normal hover:text-gray-800 transition">
                            {{ $t("Sign In") }}
                        </router-link>

                        <router-link to="/signup"
                            class="ml-4 rounded-lg bg-teal-800 px-3 py-2 text-xl font-thin tracking-wide text-white hover:bg-teal-700 transition">
                            {{ $t("Sign Up") }}
                        </router-link>
                    </div>
                </div>

                <!-- Locale Selector -->
                <div class="flex flex-row justify-center">
                    <div class="flex flex-row mt-2 gap-4 items-center rounded-full px-2">
                        <GlobeAltIcon class="-mr-2 mt-0.5 size-6 text-gray-700" />
                        <select @change="localeSelected($event)" v-model="locale"
                            class="focus-ring-0 border-0 bg-transparent text-lg font-semibold uppercase text-black hover:cursor-pointer focus:border-0 focus:outline-none focus:ring-0">
                            <option v-for="loc in available" :key="loc" :value="loc" :disabled="loc === locale"
                                class="uppercase" :class="{
                                    'text-gray-300':
                                        loc === locale,
                                }">
                                {{ loc }}
                            </option>
                        </select>
                    </div>
                </div>

            </div>
        </nav>
    </header>
</template>

