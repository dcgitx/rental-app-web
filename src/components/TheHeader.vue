    <script setup>
    import { storeToRefs } from 'pinia'
    import { GlobeAltIcon } from "@heroicons/vue/24/outline";
    import { useAuthStore } from '@/stores/auth'

    import AppLogo from "@/components/AppLogo.vue";
    import FacebookLogo from "@/components/FacebookLogo.vue";
    import InstagramLogo from "@/components/InstagramLogo.vue";
    import { useLocaleStore } from "@/stores/localeStore";
    import Dropdown from './Dropdown.vue';
    import DropdownLink from './DropdownLink.vue';
    import { useRouter } from 'vue-router';

    const auth = useAuthStore()
    const router = useRouter()

    const logout = async () => {
        await auth.logout()
        router.push({ name: 'home' })
    }

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
                <div v-if="!auth.isAuthenticated" class="flex w-full flex-col items-center justify-center text-black">
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

                <!-- Settings Dropdown -->
                <div v-else class="flex w-full flex-row items-center justify-center">
                    <Dropdown align="right" width="48">
                        <template #trigger>
                            <span class="inline-flex rounded-md">
                                <button type="button"
                                    class="inline-flex items-center justify-end rounded-md text-right text-xl font-medium leading-4 text-black transition duration-200 ease-in-out">
                                    {{ auth.user.name }}

                                    <svg class="-me-0.5 ms-2 h-6 w-6" xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd"
                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                            clip-rule="evenodd" />
                                    </svg>
                                </button>
                            </span>
                        </template>

                        <template #content class="z-50">
                            <DropdownLink to="{ name: 'profile.edit' }">
                                {{ $t("Profile") }}
                            </DropdownLink>
                            <DropdownLink to="{ name: 'addresses.index' }">
                                {{ "My Addresses" }}
                            </DropdownLink>
                            <DropdownLink @click="logout">{{ $t("Log Out") }}
                            </DropdownLink>
                            <div v-if="auth.user.is_admin">
                                <a href="/dashboard"
                                    class="block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                                    target="_blank" method="get" as="button">{{ $t("Admin") }}</a>
                            </div>
                        </template>
                    </Dropdown>
                </div>

                <!-- Locale Selector -->
                <div class="flex flex-row justify-center">
                    <div class="flex flex-row items-center justify-center rounded-full">
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

