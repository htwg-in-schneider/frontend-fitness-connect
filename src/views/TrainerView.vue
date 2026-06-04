<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTrainerStore } from '../stores/trainer.js'
import { trainerDisplayName } from '../data.js'
import NavBar from '../components/NavBar.vue'
import Button from '../components/Button.vue'
import { Users, Star } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const trainerStore = useTrainerStore()

const eingabe = ref(route.query.suche ?? '')
const art = ref(route.query.art ?? '')

function suchen() {
  const q = eingabe.value.trim()
  const a = art.value
  const query = {}
  if (q) query.suche = q
  if (a) query.art = a
  router.replace({ path: '/trainer', query })
}

onMounted(async () => {
  await trainerStore.fetchArten()
  await trainerStore.search({ suche: eingabe.value, art: art.value })
})

watch(() => route.query, async (q) => {
  eingabe.value = q.suche ?? ''
  art.value = q.art ?? ''
  await trainerStore.search({ suche: eingabe.value, art: art.value })
})
</script>

<template>
  <NavBar />

  <main class="main-content">
    <div class="trainer-page">

      <div class="search-header">
        <h1 class="page-title"><Users :size="20" /> Trainer</h1>
        <div class="search-row">
          <input
            v-model="eingabe"
            class="search-input"
            type="search"
            placeholder="Trainer suchen…"
            @keyup.enter="suchen"
          />
          <select v-model="art" class="filter-select">
            <option value="">Alle Trainerarten</option>
            <option v-for="a in trainerStore.arten" :key="a" :value="a">{{ a }}</option>
          </select>
          <Button @click="suchen">Suchen</Button>
        </div>
      </div>

      <div v-if="trainerStore.list.length === 0" class="keine-ergebnisse">
        Keine Trainer gefunden.
      </div>

      <div class="trainer-grid">
        <div class="trainer-card" v-for="t in trainerStore.list" :key="t.id">
          <img :src="t.profilbild_pfad" :alt="trainerDisplayName(t)" class="trainer-image">
          <div class="trainer-card-body">
            <h3 class="trainer-name">{{ trainerDisplayName(t) }}</h3>
            <p class="trainer-art">{{ t.trainerart }}</p>
            <p class="trainer-rating"><Star :size="13" /> {{ t.bewertung }}</p>
            <Button @click="$router.push('/trainer/' + t.id)">Profil ansehen</Button>
          </div>
        </div>
      </div>

    </div>
  </main>
</template>

<style scoped>
.trainer-page {
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
  display: flex;
  align-items: center;
  gap: 8px;
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

.keine-ergebnisse {
  text-align: center;
  color: #94A3B8;
  padding: 40px 0;
  font-size: 14px;
}

.trainer-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.trainer-card {
  flex: 1 1 280px;
  max-width: 360px;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.trainer-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.14);
}

.trainer-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
}

.trainer-card-body {
  padding: 14px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.trainer-name {
  font-size: 15px;
  font-weight: bold;
  font-family: "Arial Rounded MT Bold", "Arial", sans-serif;
  color: #1E293B;
  margin: 0;
}

.trainer-art {
  font-size: 13px;
  color: #64748B;
  margin: 0;
}

.trainer-rating {
  font-size: 13px;
  color: #F59E0B;
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 0;
}
</style>
