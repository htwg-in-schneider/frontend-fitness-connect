<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrteStore } from '../stores/orte.js'
import { useEventsStore } from '../stores/events.js'
import NavBar from '../components/NavBar.vue'
import Button from '../components/Button.vue'
import NavigationLink from '../components/NavigationLink.vue'
import { MapPin, Tag } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const orteStore = useOrteStore()
const eventsStore = useEventsStore()

onMounted(() => {
  orteStore.fetchAll()
  eventsStore.fetchAll()
})

const ort = computed(() => orteStore.list.find(o => o.id === Number(route.params.id)))

const eventsAtOrt = computed(() =>
  eventsStore.list.filter(e => e.ort?.id === Number(route.params.id))
)

const mapCoords = ref(null)

const mapsEmbedUrl = computed(() => {
  if (!mapCoords.value) return null
  const { lat, lon } = mapCoords.value
  const delta = 0.005
  const bbox = `${lon - delta},${lat - delta},${lon + delta},${lat + delta}`
  return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${lat}%2C${lon}`
})

const mapsFullUrl = computed(() => {
  if (!ort.value?.adresse) return null
  if (mapCoords.value) {
    const { lat, lon } = mapCoords.value
    return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=17/${lat}/${lon}`
  }
  const q = encodeURIComponent(`${ort.value.adresse}, Konstanz`)
  return `https://www.openstreetmap.org/search?query=${q}`
})

watch(
  () => ort.value?.adresse,
  async (address) => {
    if (!address) {
      mapCoords.value = null
      return
    }

    const query = encodeURIComponent(`${address}, Konstanz`)

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${query}`
      )

      if (!response.ok) {
        mapCoords.value = null
        return
      }

      const data = await response.json()
      const firstResult = data?.[0]
      if (!firstResult) {
        mapCoords.value = null
        return
      }

      mapCoords.value = {
        lat: Number(firstResult.lat),
        lon: Number(firstResult.lon)
      }
    } catch {
      mapCoords.value = null
    }
  },
  { immediate: true }
)
</script>

<template>
  <NavBar />

  <main class="main-content">
    <div v-if="ort" class="detail-page">

      <!-- Zurück-Link -->
      <div class="back-row">
        <NavigationLink @click="router.back()">← Zurück</NavigationLink>
      </div>

      <!-- Hero Image -->
      <div class="location-hero-card">
        <img :src="ort.bild_pfad" :alt="ort.name" class="location-hero-img" />
        <div class="location-blur-zone"></div>
        <div class="location-hero-overlay">
          <div class="location-hero-info">
            <span class="location-type">{{ ort.art }}</span>
            <span class="location-name">{{ ort.name }}</span>
          </div>
        </div>
      </div>

      <!-- Map Card -->
      <div v-if="mapsEmbedUrl || mapsFullUrl" class="map-card">
        <iframe
          v-if="mapsEmbedUrl"
          :src="mapsEmbedUrl"
          class="maps-iframe"
          frameborder="0"
          allowfullscreen
          referrerpolicy="strict-origin-when-cross-origin"
        />
        <a
          :href="mapsFullUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="maps-link"
        >In OpenStreetMap öffnen →</a>
      </div>

      <!-- Info Card -->
      <div class="detail-card">
        <h2 class="detail-section-title">Standort-Details</h2>
        <ul class="info-list">
          <li>
            <span class="info-label"><Tag :size="14" /> Art</span>
            <span class="info-value">{{ ort.art }}</span>
          </li>
          <li>
            <span class="info-label"><MapPin :size="14" /> Adresse</span>
            <span class="info-value">{{ ort.adresse }}</span>
          </li>
        </ul>
      </div>

      <!-- Events at this location -->
      <div v-if="eventsAtOrt.length" class="detail-card">
        <h2 class="detail-section-title">Aktivitäten hier</h2>
        <ul class="event-list">
          <li
            v-for="e in eventsAtOrt"
            :key="e.id"
            class="event-list-item"
            @click="router.push('/event/' + e.id)"
          >
            <span class="event-emoji">{{ e.emoji }}</span>
            <div class="event-list-info">
              <span class="event-list-name">{{ e.name }}</span>
              <span class="event-list-sport">{{ e.sportart }}</span>
            </div>
            <NavigationLink @click.stop="router.push('/event/' + e.id)">ansehen →</NavigationLink>
          </li>
        </ul>
      </div>

      <Button @click="router.back()">Zurück</Button>
    </div>

    <div v-else class="not-found">
      <p v-if="orteStore.loading">Lade…</p>
      <p v-else>Ort nicht gefunden.</p>
      <button class="back-btn" @click="router.push('/')">← Zur Startseite</button>
    </div>
  </main>
</template>

<style scoped>
.detail-page {
  max-width: 1000px;
  padding: 0 16px 40px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* back row */
.back-row {
  display: flex;
  justify-content: flex-start;
}

/* Hero Card */
.location-hero-card {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}

.location-hero-img {
  width: 100%;
  height: 220px;
  object-fit: cover;
  display: block;
}

.location-blur-zone {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 70%);
  mask-image: linear-gradient(to bottom, transparent 0%, black 70%);
  pointer-events: none;
}

.location-hero-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 16px;
  background: linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 100%);
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}

.location-hero-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.location-type {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.8);
  font-family: "Arial", sans-serif;
}

.location-name {
  font-size: 20px;
  font-weight: bold;
  color: #FFFFFF;
  font-family: "Arial Rounded MT Bold", "Arial", sans-serif;
}

/* Map Card */
.map-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  background: #FFFFFF;
}

.maps-iframe {
  width: 100%;
  height: 220px;
  display: block;
  border: none;
}

.maps-link {
  display: block;
  padding: 10px 16px;
  font-size: 12px;
  font-family: "Arial", sans-serif;
  font-weight: bold;
  color: #C00000;
  text-decoration: none;
  border-top: 1px solid #F1F5F9;
}

.maps-link:hover {
  text-decoration: underline;
}

/* Cards */
.detail-card {
  background: #FFFFFF;
  border-radius: 16px;
  padding: 18px 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.detail-section-title {
  font-size: 11px;
  font-weight: bold;
  font-family: "Arial", sans-serif;
  color: #94A3B8;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin: 0 0 12px;
}

/* Info list */
.info-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.info-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: "Arial", sans-serif;
  font-size: 13px;
  gap: 12px;
}

.info-label {
  color: #64748B;
  flex-shrink: 0;
}

.info-value {
  color: #1E293B;
  font-weight: 600;
  text-align: right;
}

/* Event list */
.event-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.event-list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background: #F8FAFC;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.15s ease;
}

.event-list-item:hover {
  background: #F1F5F9;
}

.event-emoji {
  font-size: 20px;
  flex-shrink: 0;
}

.event-list-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.event-list-name {
  font-size: 13px;
  font-weight: bold;
  font-family: "Arial Rounded MT Bold", "Arial", sans-serif;
  color: #1E293B;
}

.event-list-sport {
  font-size: 11px;
  color: #64748B;
  font-family: "Arial", sans-serif;
}

/* Not found */
.not-found {
  text-align: center;
  margin-top: 80px;
  font-family: "Arial", sans-serif;
  color: #64748B;
}

.back-btn {
  background: none;
  border: none;
  color: #C00000;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  padding: 0;
  font-family: "Arial", sans-serif;
}

.back-btn:hover {
  text-decoration: underline;
}
</style>
