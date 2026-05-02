<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { orte } from '../data.js'
import NavBar from '../components/NavBar.vue'
import Button from '../components/Button.vue'

const route = useRoute()
const router = useRouter()

const ort = computed(() => orte.find(o => o.id === Number(route.params.id)))
</script>

<template>
  <NavBar />

  <main class="main-content">
    <div v-if="ort" class="detail-page">
      <button class="back-btn" @click="router.back()">← Zurück</button>

      <div class="ort-hero">
        <img :src="ort.bild_pfad" :alt="ort.name" class="ort-hero-img" />
        <div class="ort-hero-badge">{{ ort.art }}</div>
      </div>

      <div class="detail-card">
        <h1 class="ort-title">{{ ort.name }}</h1>
        <ul class="info-list">
          <li>
            <span class="info-label">🏷️ Art</span>
            <span class="info-value">{{ ort.art }}</span>
          </li>
          <li>
            <span class="info-label">📍 Adresse</span>
            <span class="info-value">{{ ort.adresse }}</span>
          </li>
        </ul>
      </div>

      <Button @click="router.back()">Zurück zum Dashboard</Button>
    </div>

    <div v-else class="not-found">
      <p>Ort nicht gefunden.</p>
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

/* Hero image */
.ort-hero {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}

.ort-hero-img {
  width: 100%;
  height: 220px;
  object-fit: cover;
  display: block;
}

.ort-hero-badge {
  position: absolute;
  bottom: 12px;
  left: 16px;
  background: rgba(0, 0, 0, 0.55);
  color: #FFFFFF;
  font-size: 12px;
  font-weight: bold;
  font-family: "Arial", sans-serif;
  padding: 4px 12px;
  border-radius: 12px;
  backdrop-filter: blur(4px);
}

/* Info card */
.detail-card {
  background: #FFFFFF;
  border-radius: 16px;
  padding: 18px 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  margin-bottom: 16px;
}

.ort-title {
  font-size: 20px;
  font-weight: bold;
  font-family: "Arial Rounded MT Bold", "Arial", sans-serif;
  color: #1E293B;
  margin: 0 0 16px;
}

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
  align-items: flex-start;
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
