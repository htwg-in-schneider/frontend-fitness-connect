<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'
import { useEventsStore } from '../stores/events.js'
import { formatEventDate } from '../utils.js'
import ListPage from '../components/ListPage.vue'
import Button from '../components/Button.vue'
import { Calendar, MapPin, Tag, Plus, List, ArrowRight } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const { isAuthenticated } = useAuth0()
const eventsStore = useEventsStore()

const eingabe = ref(route.query.suche ?? '')
const sportart = ref(route.query.sportart ?? '')

const filterOptions = computed(() =>
  eventsStore.sportarten.map(s => ({ value: s, label: s }))
)

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
  <ListPage
    title="Events & Kurse"
    placeholder="Event finden…"
    :filterOptions="filterOptions"
    filterLabel="Alle Sportarten"
    emptyText="Keine Events gefunden."
    :isEmpty="eventsStore.list.length === 0"
    v-model:eingabe="eingabe"
    v-model:filter="sportart"
    @search="suchen"
  >
    <template #icon><Calendar :size="20" /></template>

    <template #actions>
      <button v-if="isAuthenticated" class="add-btn" @click="router.push('/meine-events')" title="Meine Events">
        <List :size="20" />
      </button>
      <button v-if="isAuthenticated" class="add-btn" @click="router.push('/event-erstellen')" title="Event erstellen">
        <Plus :size="20" />
      </button>
    </template>

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
        <p class="event-spots">{{ event.anzahlPlaetze - event.anzahlAnmeldungen }}/{{ event.anzahlPlaetze }} Plätze frei</p>
        <Button @click="router.push('/event/' + event.id)">Ansehen</Button>
      </div>
    </div>
  </ListPage>
</template>

<style scoped>
.add-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: #C00000;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s;
}

.add-btn:hover {
  background: #A00000;
}

.event-card {
  flex: 1 1 260px;
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

@media (max-width: 600px) {
  .event-card {
    max-width: 100%;
  }
}
</style>
