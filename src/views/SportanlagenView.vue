<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrteStore } from '../stores/orte.js'
import NavBar from '../components/NavBar.vue'
import Button from '../components/Button.vue'

const route = useRoute()
const router = useRouter()
const orteStore = useOrteStore()

const eingabe = ref(route.query.suche ?? '')
const art = ref(route.query.art ?? '')

function toFirstUppercase(value) {
  if (!value || typeof value !== 'string') return value
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
}

function suchen() {
  const q = eingabe.value.trim()
  const a = art.value
  const query = {}
  if (q) query.suche = q
  if (a) query.art = a
  router.replace({ path: '/orte', query })
}

onMounted(async () => {
  await orteStore.fetchArten()
  await orteStore.search({ suche: eingabe.value, art: art.value })
})

watch(() => route.query, async (q) => {
  eingabe.value = q.suche ?? ''
  art.value = q.art ?? ''
  await orteStore.search({ suche: eingabe.value, art: art.value })
})
</script>

<template>
  <NavBar />

  <main class="main-content">
    <div class="sportanlagen-page">

      <div class="search-header">
        <h1 class="page-title">🏟️ Sportanlagen</h1>
        <div class="search-row">
          <input
            v-model="eingabe"
            class="search-input"
            type="search"
            placeholder="Sportanlage finden…"
            @keyup.enter="suchen"
          />
          <select v-model="art" class="filter-select">
            <option value="">Alle Arten</option>
            <option v-for="a in orteStore.arten" :key="a" :value="a">{{ toFirstUppercase(a) }}</option>
          </select>
          <Button @click="suchen">Suchen</Button>
        </div>
      </div>

      <div v-if="orteStore.list.length === 0" class="keine-ergebnisse">
        Keine Sportanlagen gefunden.
      </div>

      <div class="orte-grid">
        <div class="ort-card" v-for="ort in orteStore.list" :key="ort.id">
          <img :src="ort.bild_pfad" :alt="ort.name" class="ort-image">
          <div class="ort-card-body">
            <h3 class="ort-title">{{ ort.name }}</h3>
            <p class="ort-address">📍 {{ ort.adresse }}</p>
            <p class="ort-art">🏷️ {{ ort.art }}</p>
            <Button @click="$router.push('/ort/' + ort.id)">Ansehen</Button>
          </div>
        </div>
      </div>

    </div>
  </main>
</template>

<style scoped>
.sportanlagen-page {
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

.orte-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.ort-card {
  flex: 1 1 280px;
  max-width: 360px;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.ort-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.14);
}

.ort-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  display: block;
}

.ort-card-body {
  padding: 14px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ort-title {
  font-size: 15px;
  font-weight: bold;
  font-family: "Arial Rounded MT Bold", "Arial", sans-serif;
  color: #1E293B;
}

.ort-address,
.ort-art {
  font-size: 12px;
  color: #64748B;
  font-family: "Arial", sans-serif;
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

  .orte-grid {
    flex-direction: column;
  }

  .ort-card {
    max-width: 100%;
  }
}
</style>
