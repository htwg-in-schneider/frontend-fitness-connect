<script setup>
import { useRouter } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'
import { formatEventDate } from '../utils.js'
import Button from './Button.vue'
import NavigationLink from './NavigationLink.vue'
import { MapPin, Calendar } from 'lucide-vue-next'

const router = useRouter()
const { isAuthenticated } = useAuth0()

defineProps({
    events: {
        type: Array,
        required: true,
    },
})

function handleEventClick(eventId) {
  if (isAuthenticated.value) {
    router.push('/event/' + eventId)
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
</script>

<template>
    <section class="page-section section-events">
        <div class="section-header">
            <h2 class="section-title">Events</h2>
            <NavigationLink v-if="isAuthenticated" @click="router.push('/events')">Alle anzeigen →</NavigationLink>
        </div>
        <div class="events-row">
            <div class="event-card" v-for="event in events" :key="event.id">
                <div class="event-card-header">
                    <span class="event-emoji">{{ event.emoji }}</span>
                    <span class="event-tag" :class="event.preis ? 'tag-price' : 'tag-free'">
                        {{ event.preis ? event.preis.toFixed(0) + ' €' : 'Kostenlos' }}
                    </span>
                </div>
                <div class="event-card-body">
                    <h3 class="event-title">{{ event.name }}</h3>
                    <p class="event-detail"><MapPin :size="13" /> {{ event.ort.name }}</p>
                    <p class="event-detail"><Calendar :size="13" /> {{ formatEventDate(event.date) }}</p>
                    <p class="event-spots">{{ event.anzahlPlaetze - event.anzahlAnmeldungen }}/{{ event.anzahlPlaetze }} Plätze frei</p>
                    <Button @click="handleEventClick(event.id)">Ansehen</Button>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.section-events {
    background: #F8FAFC;
    scroll-margin-top: 60px;
}

.events-row {
    display: flex;
    gap: 16px;
}

.event-card {
    flex: 1;
    background: #FFFFFF;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.event-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.14);
}

.event-card-header {
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    background: #FFE8E8;
}

.event-emoji {
    font-size: 36px;
}

.event-tag {
    position: absolute;
    bottom: 8px;
    left: 12px;
    padding: 3px 10px;
    border-radius: 12px;
    font-size: 10px;
    font-weight: bold;
    font-family: "Arial", sans-serif;
    color: #FFFFFF;
}

.tag-free {
    background: #4CAF50;
}

.tag-price {
    background: #FF9800;
}

.event-card-body {
    padding: 12px 14px 14px;
}

.event-title {
    font-size: 14px;
    font-weight: bold;
    font-family: "Arial Rounded MT Bold", "Arial", sans-serif;
    color: #1E293B;
    margin-bottom: 4px;
}

.event-detail {
    font-size: 12px;
    color: #64748B;
    font-family: "Arial", sans-serif;
    margin-bottom: 3px;
}

.event-spots {
    font-size: 12px;
    font-weight: bold;
    font-family: "Arial", sans-serif;
    margin: 6px 0 10px;
    color: #4CAF50;
}

@media (max-width: 768px) {
    .events-row {
        flex-direction: column;
    }
}
</style>
