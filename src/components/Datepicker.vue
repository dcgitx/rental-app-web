<script setup>
import { ref, computed, watch } from 'vue'
import dayjs from 'dayjs'
import minMax from 'dayjs/plugin/minMax'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'

dayjs.extend(minMax)

const props = defineProps({
    bookedDates: {
        type: Array,
        default: () => [],
    },
})

const model = defineModel();

const today = dayjs()
const hour = today.hour()

// If after 20:00, require booking from day after tomorrow
const minSelectableDate = computed(() => {
    const base = today.clone().startOf('day')
    return hour >= 20 ? base.add(2, 'day') : base.add(1, 'day')
})

const currentMonth = ref(today.clone().startOf('month'))

const startDate = ref(null)
const endDate = ref(null)
const hoveredDate = ref(null)

watch(() => model.value, (newVal) => {
    if (!newVal?.start && !newVal?.end) {
        startDate.value = null
        endDate.value = null
        hoveredDate.value = null
    }
})

const isInRange = (date) => {
    if (startDate.value && !endDate.value && hoveredDate.value) {
        const from = dayjs.min(startDate.value, hoveredDate.value)
        const to = dayjs.max(startDate.value, hoveredDate.value)
        return date.isAfter(from, 'day') && date.isBefore(to, 'day')
    }

    if (startDate.value && endDate.value) {
        return date.isAfter(startDate.value, 'day') && date.isBefore(endDate.value, 'day')
    }

    return false
}

const isBooked = (date) => {
    if (!Array.isArray(props.bookedDates)) return false

    const formatted = date.format('YYYY-MM-DD')
    return props.bookedDates.includes(formatted) && !date.isBefore(today, 'day')
}

const isUnavailable = (date) => {
    return isBooked(date) || date.isBefore(minSelectableDate.value, 'day')
}

const isSelected = (date) => {
    return startDate.value?.isSame(date, 'day') || endDate.value?.isSame(date, 'day')
}

const selectDate = (date) => {
    if (isUnavailable(date)) return

    if (!startDate.value || (startDate.value && endDate.value)) {
        startDate.value = date
        endDate.value = null
    } else if (date.isBefore(startDate.value, 'day')) {
        const proposedRangeInvalid = doesRangeIncludeUnavailable(date, startDate.value)
        if (proposedRangeInvalid) return
        endDate.value = startDate.value
        startDate.value = date
    } else {
        const proposedRangeInvalid = doesRangeIncludeUnavailable(startDate.value, date)

        const isSameDay = date.isSame(startDate.value, 'day')
        if (proposedRangeInvalid || isSameDay) return

        endDate.value = date
    }

    if (startDate.value && endDate.value) {
        model.value = {
            start: startDate.value.format('YYYY-MM-DD'),
            end: endDate.value.format('YYYY-MM-DD'),
        }
    }
}

const displayedDates = computed(() => {
    const start = currentMonth.value.startOf('month').startOf('week')
    return Array.from({ length: 42 }, (_, i) => start.add(i, 'day'))
})

const nextMonth = () => {
    currentMonth.value = currentMonth.value.add(1, 'month')
}

const prevMonth = () => {
    currentMonth.value = currentMonth.value.subtract(1, 'month')
}

const doesRangeIncludeUnavailable = (from, to) => {
    let date = from.clone().add(1, 'day') // skip start because it's already unavailable
    while (date.isBefore(to, 'day')) {
        if (isUnavailable(date)) return true
        date = date.add(1, 'day')
    }
    return false
}

const isBookedInRange = (date) => {
    return isInRange(date) && isBooked(date)
}

</script>

<template>
    <div class="inline-block w-80 p-4 bg-white/50 dark:bg-gray-900 border border-teal-600/50 rounded-lg">
        <div class="flex items-center justify-between mb-2">
            <button @click="prevMonth" class="text-sm text-teal-600 hover:underline">
                <ChevronLeftIcon class="size-4 stroke-2" />
            </button>
            <div class="text-center font-medium">
                {{ currentMonth.format('MMMM YYYY') }}
            </div>
            <button @click="nextMonth" class="text-sm text-teal-600 hover:underline">
                <ChevronRightIcon class="size-4 stroke-2" />
            </button>
        </div>

        <div class="grid grid-cols-7 text-xs text-gray-500 mb-1">
            <div v-for="d in ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']" :key="d" class="text-center">{{ d }}</div>
        </div>

        <div class="grid grid-cols-7 gap-1">
            <button v-for="date in displayedDates" :key="date.format('YYYY-MM-DD')" :disabled="isUnavailable(date)"
                @click="selectDate(date)" @mouseenter="hoveredDate = date" @mouseleave="hoveredDate = null"
                class="text-sm aspect-square rounded-full flex items-center justify-center transition" :class="{
                    'bg-teal-600 text-white': isSelected(date),
                    'bg-red-600/40 text-white font-bold': isBookedInRange(date),
                    'bg-teal-600/20 text-teal-800': isInRange(date) && !isBooked(date),
                    'text-black font-extrabold font-comic text-lg bg-teal-600/50': isBooked(date) && !isInRange(date),
                    'line-through text-gray-400 bg-gray-200 dark:bg-gray-800 pointer-events-none italic': isUnavailable(date) && !isBooked(date),
                    'text-gray-400': date.month() !== currentMonth.month(),
                    'hover:bg-teal-600': !isUnavailable(date)
                }">
                {{ isBooked(date) ? 'R' : date.date() }}
            </button>
        </div>
    </div>
</template>
