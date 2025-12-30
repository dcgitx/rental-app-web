<script setup>
import { RouterLink } from "vue-router";

const props = defineProps({ conversations: Array });
</script>

<template>
    <div>
        <h1>Your Conversations</h1>
        <ul>
            <li v-for="c in conversations" :key="c.id">
                <RouterLink :to="`/conversations/${c.id}`">
                    Chat with {{ c.renter.username }} / {{ c.lister.username }}
                </RouterLink>
            </li>
        </ul>
    </div>
</template>
