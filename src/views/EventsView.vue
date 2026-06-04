<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEventsStore } from '../stores/events.js'
import { formatEventDate } from '../data.js'
import NavBar from '../components/NavBar.vue'
import Button from '../components/Button.vue'
import { Calendar, MapPin, Tag, User } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const eventsStore = useEventsStore()

const eingabe = ref(route.query.suche ?? '')
const sportart = ref(route.query.sportart ?? '')

function suchen() {
  const q = eingabe.value.trim()
  const s = sportart.value
  const query = {}
  if (q) query.suche = q
  if (s) query.sportart = s
  router.replace({ path: '/events', query })
}

onMounted(async () => {
  await eventsStore.fetchSportarten()
  await eventsStore.search({ suche: eingabe.value, sportart: sportart.value })
})

watch(() => route.query, async (q) => {
  eingabe.value = q.suche ?? ''
  sportart.value = q.sportart ?? ''
  await eventsStore.search({ suche: eingabe.value, sportart: sportart.value })
})
</script>

<template>
  <NavBar />

  <main class="main-content">
    <div class="events-page">

      <div class="search-header">
        <h1 class="page-title"><Calendar :size="20" /> Events &amp; Kurse</h1>
        <div class="search-row">
          <input
            v-model="eingabe"
            class="search-input"
            type="search"
            placeholder="Event oder Kurs finden…"
            @keyup.enter="suchen"
          />
          <select v-model="sportart" class="filter-select">
            <option value="">Alle Sportarten</option>
            <option v-for="s in eventsStore.sportarten" :key="s" :value="s">{{ s }}</option>
          </select>
          <Button @click="suchen">Suchen</Button>
        </div>
      </div>

      <div v-if="eventsStore.list.length === 0" class="keine-ergebnisse">
        Keine Events oder Kurse gefunden.
      </div>

      <div class="events-grid">
        <div
          class="event-card"
          v-for="event in eventsStore.list"
          :key="event.id"
        >
          <div class="event-card-header">
            <span class="event-emoji">{{ event.emoji }}</span>
            <span class="event-tag" :class="event.preis ? 'tag-price' : 'tag-free'">
              {{ event.preis ? event.preis.toFixed(0) + ' €' : 'Kostenlos' }}
            </span>
          </div>
          <div class="event-card-body">
            <h3 class="event-title">{{ event.name }}</h3>
            <p class="event-detail"><Tag :size="13" /> {{ event.sportart }}</p>
            <p class="event-detail"><MapPin :size="13" /> {{ event.ort?.name }}</p>
            <p class="event-detail"><Calendar :size="13" /> {{ formatEventDate(event.date) }}</p>
            <p v-if="event.trainerName" class="event-detail"><User :size="13" /> {{ event.trainerName }}</p>
            <p class="event-spots">{{ event.freiePlaetze }}/{{ event.anzahlPlaetze }} Plätze frei</p>
            <Button @click="router.push('/event/' + event.id)">
              {{ event.preis ? 'Kurs ansehen' : 'Teilnehmen' }}
            </Button>
          </div>
        </div>
      </div>

    </div>
  </main>
</template>

<style scoped>
.events-page {
  padding: 32px 24px;
  max-width: 1100px;
  margin: 0 auto;
}

.search-header {
  margin-bottom: 32px;
}

.page-title {
  font-size: 22px;
  font-weight: bold;
  font-family: "Arial Rounded MT Bold", "Arial", sans-serif;
  color: #1E293B;
  margin-bottom: 16px;
}

.search-row {
  display: flex;
  gap: 10px;
  align-items: center;
}

.search-input {
  flex: 1;
  max-width: 480px;
  padding: 10px 14px;
  border: 1px solid #CBD5E1;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  background: #F8FAFC;
}

.search-input:focus {
  border-color: #3B82F6;
  background: #fff;
}

.filter-select {
  padding: 10px 12px;
  border: 1px solid #CBD5E1;
  border-radius: 8px;
  font-size: 14px;
  background: #F8FAFC;
  outline: none;
  cursor: pointer;
}

.filter-select:focus {
  border-color: #3B82F6;
  background: #fff;
}

.events-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.event-card {
  flex: 1 1 260px;
  max-width: 360px;
  background: #fff;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px 0;
}

.event-emoji {
  font-size: 28px;
}

.event-tag {
  font-size: 11px;
  font-weight: bold;
  padding: 3px 8px;
  border-radius: 20px;
}

.tag-free {
  background: #DCFCE7;
  color: #16A34A;
}

.tag-price {
  background: #DBEAFE;
  color: #1D4ED8;
}

.event-card-body {
  padding: 10px 14px 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
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
}

.event-spots {
  font-size: 12px;
  color: #94A3B8;
  margin-bottom: 6px;
}

.keine-ergebnisse {
  color: #64748B;
  font-size: 14px;
  padding: 24px 0;
}

@media (max-width: 600px) {
  .search-row {
    flex-direction: column;
    align-items: stretch;
  }

  .search-input,
  .filter-select {
    max-width: 100%;
  }

  .events-grid {
    flex-direction: column;
  }

  .event-card {
    max-width: 100%;
  }
}
</style>
