<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrteStore } from '../stores/orte.js'
import ListPage from '../components/ListPage.vue'
import Button from '../components/Button.vue'
import { MapPin, Tag, Building } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const orteStore = useOrteStore()

const eingabe = ref(route.query.suche ?? '')
const art = ref(route.query.art ?? '')

function toFirstUppercase(value) {
  if (!value || typeof value !== 'string') return value
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
}

const filterOptions = computed(() =>
  orteStore.arten.map(a => ({ value: a, label: toFirstUppercase(a) }))
)

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
  <ListPage
    title="Sportanlagen"
    placeholder="Sportanlage finden…"
    :filterOptions="filterOptions"
    filterLabel="Alle Arten"
    emptyText="Keine Sportanlagen gefunden."
    :isEmpty="orteStore.list.length === 0"
    v-model:eingabe="eingabe"
    v-model:filter="art"
    @search="suchen"
  >
    <template #icon><Building :size="20" /></template>

    <div class="ort-card" v-for="ort in orteStore.list" :key="ort.id">
      <img :src="ort.bild_pfad" :alt="ort.name" class="ort-image">
      <div class="ort-card-body">
        <h3 class="ort-title">{{ ort.name }}</h3>
        <p class="ort-address"><MapPin :size="13" /> {{ ort.adresse }}</p>
        <p class="ort-art"><Tag :size="13" /> {{ ort.art }}</p>
        <Button @click="router.push('/ort/' + ort.id)">Ansehen</Button>
      </div>
    </div>
  </ListPage>
</template>

<style scoped>
.ort-card {
  flex: 1 1 280px;
  background: #fff;
  border-radius: 12px;
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
  border-radius: 12px 12px 0 0;
}

.ort-card-body {
  padding: 14px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.ort-title {
  font-size: 15px;
  font-weight: bold;
  font-family: "Arial Rounded MT Bold", "Arial", sans-serif;
  color: #1E293B;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.ort-address,
.ort-art {
  font-size: 12px;
  color: #64748B;
  font-family: "Arial", sans-serif;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

@media (max-width: 600px) {
  .ort-card {
    max-width: 100%;
    flex-basis: 100%;
  }
}
</style>
