<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTrainerStore } from '../stores/trainer.js'
import ListPage from '../components/ListPage.vue'
import Button from '../components/Button.vue'
import { Users, Star } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const trainerStore = useTrainerStore()

const eingabe = ref(route.query.suche ?? '')
const art = ref(route.query.art ?? '')

const filterOptions = computed(() =>
  trainerStore.arten.map(a => ({ value: a, label: a }))
)

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
  <ListPage
    title="Trainer"
    placeholder="Trainer suchen…"
    :filterOptions="filterOptions"
    filterLabel="Alle Trainerarten"
    emptyText="Keine Trainer gefunden."
    :isEmpty="trainerStore.list.length === 0"
    v-model:eingabe="eingabe"
    v-model:filter="art"
    @search="suchen"
  >
    <template #icon><Users :size="20" /></template>

    <div class="trainer-card" v-for="t in trainerStore.list" :key="t.id">
      <img :src="t.profilbild_pfad" :alt="t.name" class="trainer-image">
      <div class="trainer-card-body">
        <h3 class="trainer-name">{{ t.name }}</h3>
        <p class="trainer-art">{{ t.trainerart }}</p>
        <p class="trainer-rating"><Star :size="13" /> {{ t.bewertung }}</p>
        <Button @click="router.push('/trainer/' + t.id)">Profil ansehen</Button>
      </div>
    </div>
  </ListPage>
</template>

<style scoped>
.trainer-card {
  flex: 1 1 280px;
  background: #fff;
  border-radius: 12px;
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
  border-radius: 12px 12px 0 0;
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

@media (max-width: 768px) {
  .trainer-card {
    max-width: 100%;
    flex-basis: 100%;
  }
}
</style>
