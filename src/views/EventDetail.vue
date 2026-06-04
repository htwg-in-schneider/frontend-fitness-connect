<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEventsStore } from '../stores/events.js'
import { formatEventDate } from '../data.js'
import NavBar from '../components/NavBar.vue'
import Button from '../components/Button.vue'
import NavigationLink from '../components/NavigationLink.vue'
import { MapPin, Calendar, Armchair, User } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const eventsStore = useEventsStore()

onMounted(() => eventsStore.fetchAll())

const event = computed(() => eventsStore.list.find(e => e.id === Number(route.params.id)))

function renderStars(rating) {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - full - (half ? 1 : 0))
}
</script>

<template>
  <NavBar />

  <main class="main-content">
    <div v-if="event" class="detail-page">

      <!-- 1. Zurück-Link -->
      <div class="back-row">
        <NavigationLink @click="router.back()">← Zurück</NavigationLink>
      </div>

      <!-- Kurs-Layout: Location hero oben, Detail-Card links streckt sich auf Höhe der rechten Cards -->
      <template v-if="event.preis">
        <div class="location-hero-card location-hero-card--clickable" @click="router.push('/ort/' + event.ort.id)">
          <img :src="event.ort.bild_pfad" :alt="event.ort.name" class="location-hero-img" />
          <div class="location-blur-zone"></div>
          <div class="location-hero-overlay">
            <div class="location-hero-info">
              <span class="location-type">{{ event.ort.art }}</span>
              <span class="location-name">{{ event.ort.name }}</span>
            </div>
            <NavigationLink @click.stop="router.push('/ort/' + event.ort.id)">Ort ansehen →</NavigationLink>
          </div>
        </div>

        <div class="detail-grid detail-grid--stretch">
          <!-- Detail-Card (merged, streckt sich) -->
          <div class="detail-card detail-card--full-height">
            <h1 class="event-title">{{ event.name }}</h1>
            <p class="event-sportart">{{ event.sportart }}</p>
            <br>
            <ul class="info-list">
              <li>
                <span class="info-label"><MapPin :size="14" /> Ort</span>
                <span class="info-value">{{ event.ort.adresse }}</span>
              </li>
              <li>
                <span class="info-label"><Calendar :size="14" /> Datum</span>
                <span class="info-value">{{ formatEventDate(event.date) }}</span>
              </li>
              <li>
                <span class="info-label"><Armchair :size="14" /> Plätze</span>
                <span class="info-value">{{ event.freiePlaetze }} / {{ event.anzahlPlaetze }} frei</span>
              </li>
            </ul>
          </div>

          <!-- Rechte Spalte: Trainer + Preis -->
          <div class="col-right">
            <div v-if="event.trainerName" class="detail-card trainer-card">
              <div class="trainer-info">
                <p class="trainer-label"><User :size="14" /> Trainer</p>
                <p class="trainer-name">{{ event.trainerName }}</p>
              </div>
            </div>

            <div class="detail-card">
              <h2 class="detail-section-title">Preisübersicht</h2>
              <div class="price-row">
                <span class="price-label">{{ event.name }}</span>
                <span class="price-value">{{ event.preis.toFixed(2) }} €</span>
              </div>
              <hr class="price-divider" />
              <div class="price-row">
                <span class="price-label price-bold">Gesamtpreis</span>
                <span class="price-value price-bold">{{ event.preis.toFixed(2) }} €</span>
              </div>
              <h2 class="detail-section-title payment-title">Zahlungsmethode</h2>
              <button class="apple-pay-btn">
                <img src="/apple_pay.png" alt="Apple Pay" class="apple-pay-img" />
              </button>
            </div>
          </div>
        </div>

        <Button @click="router.back()">Jetzt bezahlen</Button>
      </template>

      <!-- Event-Layout: Detail-Card links, Location-Hero rechts, gleiche Höhe -->
      <template v-else>
        <div class="detail-grid detail-grid--stretch">
          <div class="detail-card detail-card--full-height">
            <h1 class="event-title">{{ event.name }}</h1>
            <p class="event-sportart">{{ event.sportart }}</p>
            <h2 class="detail-section-title section-title-gap">Event-Details</h2>
            <ul class="info-list">
              <li>
                <span class="info-label"><MapPin :size="14" /> Ort</span>
                <span class="info-value">{{ event.ort.adresse }}</span>
              </li>
              <li>
                <span class="info-label"><Calendar :size="14" /> Datum</span>
                <span class="info-value">{{ formatEventDate(event.date) }}</span>
              </li>
              <li>
                <span class="info-label"><Armchair :size="14" /> Plätze</span>
                <span class="info-value">{{ event.freiePlaetze }} / {{ event.anzahlPlaetze }} frei</span>
              </li>
            </ul>
          </div>

          <div class="location-hero-card location-hero-card--inline" @click="router.push('/ort/' + event.ort.id)">
            <img :src="event.ort.bild_pfad" :alt="event.ort.name" class="location-hero-img" />
            <div class="location-blur-zone"></div>
            <div class="location-hero-overlay">
              <div class="location-hero-info">
                <span class="location-type">{{ event.ort.art }}</span>
                <span class="location-name">{{ event.ort.name }}</span>
              </div>
              <NavigationLink @click="router.push('/ort/' + event.ort.id)">Ort ansehen →</NavigationLink>
            </div>
          </div>
        </div>

        <Button @click="router.back()">Jetzt beitreten</Button>
      </template>

    </div>

    <div v-else class="not-found">
      <p v-if="eventsStore.loading">Lade…</p>
      <p v-else>Event nicht gefunden.</p>
      <button class="back-btn" @click="router.push('/')">← Zur Startseite</button>
    </div>
  </main>
</template>

<style scoped>
.detail-page {
  max-width: 1000px;
  margin: 32px auto;
  padding: 0 16px 40px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  align-items: start;
}

.detail-grid--stretch {
  align-items: stretch;
}

.detail-card--full-height {
  height: 100%;
  box-sizing: border-box;
}

.col-right {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
}

/* Location card when used inline in the grid */
.location-hero-card--inline {
  height: 100%;
  min-height: 200px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.location-hero-card--inline:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.14);
}

.location-hero-card--inline .location-hero-img {
  height: 100%;
  min-height: 200px;
}

@media (max-width: 768px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }

  .detail-card--full-height,
  .location-hero-card--inline {
    height: auto;
  }

  .location-hero-card--inline .location-hero-img {
    height: 200px;
  }
}

/* back row */
.back-row {
  display: flex;
  justify-content: flex-start;
}

/* 2. Location Hero Card */
.location-hero-card {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}

.location-hero-card--clickable {
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.location-hero-card--clickable:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.14);
}

.location-hero-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
}

/* Blur zone: bottom ~40% of the image gets a backdrop-filter blur,
   fading in via a mask so the top stays sharp */
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
  font-size: 16px;
  font-weight: bold;
  color: #FFFFFF;
  font-family: "Arial Rounded MT Bold", "Arial", sans-serif;
}

/* Cards */
.detail-card {
  background: #FFFFFF;
  border-radius: 16px;
  padding: 18px 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
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

/* 5. Trainer Card */
.trainer-card {
  display: flex;
  align-items: center;
  gap: 14px;
}

.trainer-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.trainer-info {
  flex: 1;
  min-width: 0;
}

.trainer-btn-wrap {
  flex-shrink: 0;
  width: 52px;
}

.trainer-name {
  font-size: 14px;
  font-weight: bold;
  font-family: "Arial Rounded MT Bold", "Arial", sans-serif;
  color: #1E293B;
  margin: 0 0 2px;
}

.trainer-sport {
  font-size: 12px;
  color: #64748B;
  font-family: "Arial", sans-serif;
  margin: 0 0 2px;
}

.trainer-rating {
  font-size: 12px;
  color: #F59E0B;
  font-family: "Arial", sans-serif;
  margin: 0;
}

.rating-num {
  color: #64748B;
}

/* 6. Price Card */
.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: "Arial", sans-serif;
  font-size: 13px;
  margin-bottom: 10px;
}

.price-label {
  color: #1E293B;
}

.price-value {
  color: #1E293B;
}

.price-bold {
  font-weight: bold;
  font-size: 14px;
}

.price-divider {
  border: none;
  border-top: 1px solid #E2E8F0;
  margin: 0 0 10px;
}

.payment-title {
  margin-top: 16px;
}

.apple-pay-btn {
  width: 100%;
  background: #FFFFFF;
  border: 2px solid #1E293B;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.apple-pay-img {
  height: 50px;
  object-fit: contain;
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
</style>

