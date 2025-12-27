<script setup async>
import { onMounted, ref } from 'vue';

import { fetchFaqs } from '@/api/faqs'
import { MinusIcon, PlusIcon } from '@heroicons/vue/24/solid';
import LoadingState from '@/components/LoadingState.vue';

const faqs = ref([])
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
    try {
        const res = await fetchFaqs()
        faqs.value = res.data
    } catch (e) {
        console.error(e)
        error.value = 'Failed to load FAQs'
    } finally {
        loading.value = false
    }
})

const openFaqs = ref({});

function toggleFaq(id) {
    openFaqs.value[id] = !openFaqs.value[id];
}


</script>

<template>
    <LoadingState v-if="loading" />
    <div v-else class="w-full">
        <div class="max-w-2xl mx-auto flex flex-col w-full gap-2 pt-4 pb-12">
            <h1 class="font-semibold text-3xl py-6 text-center">
                Frequently Asked Questions
            </h1>

            <div v-if="faqs.length >= 1">

                <div v-for="faq in faqs" :key="faq.question" class="py-4 border-b border-gray-400">

                    <div class="flex flex-row gap-3 cursor-pointer w-full" @click="toggleFaq(faq.question)">

                        <div class="w-6 h-6 flex items-center justify-center text-gray-700 dark:text-inherit pt-1">
                            <MinusIcon v-if="openFaqs[faq.question]" class="size-7" />
                            <PlusIcon v-else class="size-7" />
                        </div>

                        <h1 class="text-xl font-semibold text-gray-800 dark:text-inherit">
                            {{ faq.question }}
                        </h1>
                    </div>
                    <transition name="fade">
                        <p v-if="openFaqs[faq.question]"
                            class="mt-3 ml-9 text-gray-700 dark:text-gray-400 leading-relaxed">
                            {{ faq.answer }}
                        </p>
                    </transition>
                </div>
            </div>
            <div v-else class="text-center text-lg">No FAQs available at this time.</div>
        </div>
    </div>

</template>