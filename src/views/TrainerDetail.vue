<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTrainerStore } from '../stores/trainer.js'
import { useEventsStore } from '../stores/events.js'
import { trainerDisplayName } from '../data.js'
import NavBar from '../components/NavBar.vue'
import Button from '../components/Button.vue'
import NavigationLink from '../components/NavigationLink.vue'

const route = useRoute()
const router = useRouter()
const trainerStore = useTrainerStore()
const eventsStore = useEventsStore()

onMounted(() => {
  trainerStore.fetchAll()
  eventsStore.fetchAll()
})

const t = computed(() => trainerStore.list.find(t => t.id === Number(route.params.id)))

const coursesByTrainer = computed(() =>
  eventsStore.list.filter(e => e.trainer?.id === Number(route.params.id))
)

function renderStars(rating) {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - full - (half ? 1 : 0))
}
</script>

<template>
  <NavBar />

  <main class="main-content">
    <div v-if="t" class="detail-page">

      <!-- Zurück-Link -->
      <div class="back-row">
        <NavigationLink @click="router.back()">← Zurück</NavigationLink>
      </div>

      <!-- Profile Hero Card -->
      <div class="profile-hero-card">
        <img :src="t.profilbild_pfad" :alt="trainerDisplayName(t)" class="profile-avatar" />
        <div class="profile-hero-info">
          <p class="profile-sport">{{ t.trainerart }}</p>
          <h1 class="profile-name">{{ t.kontoinhaber }}</h1>
          <p class="profile-stars" :title="t.bewertung + ' / 5'">
            {{ renderStars(t.bewertung) }}
            <span class="rating-num">{{ t.bewertung }}</span>
          </p>
        </div>
      </div>

      <!-- Quote + Kontakt grid -->
      <div class="detail-grid detail-grid--stretch">
        <!-- Über mich -->
        <div class="detail-card detail-card--full-height">
          <h2 class="detail-section-title">Über mich</h2>
          <blockquote class="trainer-quote">"{{ t.zitat }}"</blockquote>
        </div>

        <!-- Kontakt -->
        <div class="detail-card detail-card--full-height">
          <h2 class="detail-section-title">Kontakt</h2>
          <ul class="info-list">
            <li>
              <span class="info-label">📞 Telefon</span>
              <span class="info-value">{{ t.telefonnummer }}</span>
            </li>
            <li>
              <span class="info-label">🏋️ Disziplin</span>
              <span class="info-value">{{ t.trainerart }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Kurse by this trainer -->
      <div v-if="coursesByTrainer.length" class="detail-card">
        <h2 class="detail-section-title">Kurse von {{ trainerDisplayName(t) }}</h2>
        <ul class="event-list">
          <li
            v-for="e in coursesByTrainer"
            :key="e.id"
            class="event-list-item"
            @click="router.push('/event/' + e.id)"
          >
            <span class="event-emoji">{{ e.emoji }}</span>
            <div class="event-list-info">
              <span class="event-list-name">{{ e.name }}</span>
              <span class="event-list-sport">{{ e.sportart }} · {{ e.preis?.toFixed(2) }} €</span>
            </div>
            <NavigationLink @click.stop="router.push('/event/' + e.id)">ansehen →</NavigationLink>
          </li>
        </ul>
      </div>

      <Button @click="router.back()">Zurück</Button>
    </div>

    <div v-else class="not-found">
      <p v-if="trainerStore.loading">Lade…</p>
      <p v-else>Trainer nicht gefunden.</p>
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

/* back row */
.back-row {
  display: flex;
  justify-content: flex-start;
}

/* Profile hero */
.profile-hero-card {
  display: flex;
  align-items: center;
  gap: 20px;
  background: #FFFFFF;
  border-radius: 20px;
  padding: 24px 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.profile-avatar {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.profile-hero-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.profile-sport {
  font-size: 11px;
  font-weight: bold;
  font-family: "Arial", sans-serif;
  color: #94A3B8;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin: 0;
}

.profile-name {
  font-size: 22px;
  font-weight: bold;
  font-family: "Arial Rounded MT Bold", "Arial", sans-serif;
  color: #1E293B;
  margin: 0;
}

.profile-stars {
  font-size: 16px;
  color: #F59E0B;
  margin: 2px 0 0;
  font-family: "Arial", sans-serif;
}

.rating-num {
  font-size: 13px;
  color: #64748B;
  margin-left: 6px;
}

/* Grid */
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

@media (max-width: 768px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }

  .detail-card--full-height {
    height: auto;
  }
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

.trainer-quote {
  font-size: 14px;
  font-style: italic;
  color: #334155;
  font-family: "Arial", sans-serif;
  border-left: 3px solid #C00000;
  margin: 0;
  padding-left: 12px;
  line-height: 1.6;
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

/* Event / Course list */
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

