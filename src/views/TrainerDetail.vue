<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTrainerStore } from '../stores/trainer.js'
import { trainerDisplayName } from '../data.js'
import NavBar from '../components/NavBar.vue'
import Button from '../components/Button.vue'

const route = useRoute()
const router = useRouter()
const trainerStore = useTrainerStore()

onMounted(() => trainerStore.fetchAll())

const t = computed(() => trainerStore.list.find(t => t.id === Number(route.params.id)))

function renderStars(rating) {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - full - (half ? 1 : 0))
}
</script>

<template>
  <NavBar />

  <main class="main-content">
    <div v-if="trainerStore.error" class="not-found">
      <p>⚠️ {{ trainerStore.error }}</p>
      <button class="back-btn" @click="router.push('/')">← Zur Startseite</button>
    </div>
    <div v-else-if="t" class="detail-page">
      <button class="back-btn" @click="router.back()">← Zurück</button>

      <div class="profile-hero">
        <img :src="t.profilbild_pfad" :alt="trainerDisplayName(t)" class="profile-img" />
        <div class="profile-hero-info">
          <h1 class="profile-name">{{ t.kontoinhaber }}</h1>
          <p class="profile-sport">{{ t.trainerart }}</p>
          <p class="profile-stars" :title="t.bewertung + ' / 5'">
            {{ renderStars(t.bewertung) }} <span class="rating-num">{{ t.bewertung }}</span>
          </p>
        </div>
      </div>

      <div class="detail-card">
        <h2 class="detail-section-title">Über mich</h2>
        <blockquote class="trainer-quote">"{{ t.zitat }}"</blockquote>
      </div>

      <div class="detail-card">
        <h2 class="detail-section-title">Kontakt</h2>
        <ul class="info-list">
          <li>
            <span class="info-label">📞 Telefon</span>
            <span class="info-value">{{ t.telefonnummer }}</span>
          </li>
        </ul>
      </div>

      <div class="detail-card">
        <h2 class="detail-section-title">Bankverbindung</h2>
        <ul class="info-list">
          <li>
            <span class="info-label">Kontoinhaber</span>
            <span class="info-value">{{ t.kontoinhaber }}</span>
          </li>
          <li>
            <span class="info-label">IBAN</span>
            <span class="info-value mono">{{ t.iban }}</span>
          </li>
          <li>
            <span class="info-label">BIC</span>
            <span class="info-value mono">{{ t.bic }}</span>
          </li>
        </ul>
      </div>

      <Button @click="router.back()">Zurück zum Dashboard</Button>
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
.profile-hero {
  display: flex;
  gap: 20px;
  align-items: center;
  background: #FFFFFF;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  margin-bottom: 16px;
}

.profile-img {
  width: 100px;
  height: 100px;
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

.profile-name {
  font-size: 20px;
  font-weight: bold;
  font-family: "Arial Rounded MT Bold", "Arial", sans-serif;
  color: #1E293B;
  margin: 0;
}

.profile-sport {
  font-size: 13px;
  color: #64748B;
  font-family: "Arial", sans-serif;
  margin: 0;
}

.profile-stars {
  font-size: 16px;
  color: #F59E0B;
  margin: 4px 0 0;
  font-family: "Arial", sans-serif;
}

.rating-num {
  font-size: 13px;
  color: #64748B;
  margin-left: 6px;
}

/* Cards */
.detail-card {
  background: #FFFFFF;
  border-radius: 16px;
  padding: 18px 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  margin-bottom: 16px;
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

.trainer-quote {
  font-size: 15px;
  font-style: italic;
  color: #334155;
  font-family: "Arial", sans-serif;
  border-left: 3px solid #C00000;
  margin: 0;
  padding-left: 12px;
  line-height: 1.5;
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
  word-break: break-all;
}

.info-value.mono {
  font-family: "Courier New", monospace;
  font-size: 12px;
  letter-spacing: 0.03em;
}

.not-found {
  text-align: center;
  margin-top: 80px;
  font-family: "Arial", sans-serif;
  color: #64748B;
}
</style>
