<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { events, formatEventDate, trainerDisplayName } from '../data.js'
import NavBar from '../components/NavBar.vue'
import Button from '../components/Button.vue'

const route = useRoute()
const router = useRouter()

const event = computed(() => events.find(e => e.id === Number(route.params.id)))
</script>

<template>
  <NavBar />

  <main class="main-content">
    <div v-if="event" class="detail-page">
      <button class="back-btn" @click="router.back()">← Zurück</button>

      <!-- Hero -->
      <div class="event-hero">
        <span class="detail-emoji">{{ event.emoji }}</span>
        <span class="event-tag" :class="event.preis ? 'tag-price' : 'tag-free'">
          {{ event.preis ? event.preis.toFixed(2) + ' €' : 'Kostenlos' }}
        </span>
      </div>

      <!-- Titel -->
      <div class="detail-card">
        <h1 class="event-title">{{ event.name }}</h1>
        <p class="event-sportart">{{ event.sportart }}</p>
      </div>

      <!-- Details -->
      <div class="detail-card">
        <h2 class="detail-section-title">Details</h2>
        <ul class="info-list">
          <li>
            <span class="info-label">📍 Ort</span>
            <span class="info-value">{{ event.ortName }}</span>
          </li>
          <li>
            <span class="info-label">📅 Datum</span>
            <span class="info-value">{{ formatEventDate(event.date) }}</span>
          </li>
          <li>
            <span class="info-label">🪑 Plätze</span>
            <span class="info-value">{{ event.freiePlaetze }} / {{ event.anzahlPlaetze }} frei</span>
          </li>
          <li v-if="event.trainer">
            <span class="info-label">🏋️ Trainer</span>
            <span class="info-value">{{ trainerDisplayName(event.trainer) }}</span>
          </li>
        </ul>
      </div>

      <Button @click="router.back()">Jetzt teilnehmen</Button>
    </div>

    <div v-else class="not-found">
      <p>Event nicht gefunden.</p>
      <button class="back-btn" @click="router.push('/')">← Zur Startseite</button>
    </div>
  </main>
</template>

<style scoped>
.detail-page {
  max-width: 620px;
  margin: 32px auto;
  padding: 0 16px 40px;
}

.back-btn {
  background: none;
  border: none;
  color: #C00000;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  padding: 0;
  margin-bottom: 24px;
  font-family: "Arial", sans-serif;
}

.back-btn:hover {
  text-decoration: underline;
}

/* Hero */
.event-hero {
  height: 140px;
  background: #FFE8E8;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.detail-emoji {
  font-size: 64px;
}

.event-tag {
  position: absolute;
  bottom: 12px;
  left: 16px;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  font-family: "Arial", sans-serif;
  color: #FFFFFF;
}

.tag-free { background: #4CAF50; }
.tag-price { background: #FF9800; }

/* Cards */
.detail-card {
  background: #FFFFFF;
  border-radius: 16px;
  padding: 18px 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  margin-bottom: 16px;
}

.event-title {
  font-size: 20px;
  font-weight: bold;
  font-family: "Arial Rounded MT Bold", "Arial", sans-serif;
  color: #1E293B;
  margin: 0 0 4px;
}

.event-sportart {
  font-size: 13px;
  color: #64748B;
  font-family: "Arial", sans-serif;
  margin: 0;
}

.detail-section-title {
  font-size: 13px;
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

.not-found {
  text-align: center;
  margin-top: 80px;
  font-family: "Arial", sans-serif;
  color: #64748B;
}
</style>

