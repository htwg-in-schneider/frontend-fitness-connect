<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'
import { useOrteStore } from '../stores/orte.js'
import NavBar from '../components/NavBar.vue'
import Button from '../components/Button.vue'
import NavigationLink from '../components/NavigationLink.vue'

const API = import.meta.env.VITE_API_BASE_URL

const router = useRouter()
const { getAccessTokenSilently } = useAuth0()
const orteStore = useOrteStore()

const isTrainer = ref(false)
const isKurs = ref(false)

const name = ref('')
const sportart = ref('')
const datum = ref('')
const uhrzeit = ref('')
const anzahlPlaetze = ref(10)
const preis = ref(0)
const selectedOrtId = ref(null)
const selectedEmoji = ref('⚽')

const emojis = ['⚽', '🧘', '💪', '🏃', '🚴']

const selectedOrt = computed(() =>
  orteStore.list.find(o => o.id === selectedOrtId.value)
)

async function loadRole() {
  try {
    const token = await getAccessTokenSilently()
    const res = await fetch(`${API}/api/nutzer/me`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
    if (res.ok) {
      const data = await res.json()
      isTrainer.value = data.rolle === 'TRAINER'
    }
  } catch (_) {}
}

onMounted(() => {
  orteStore.fetchAll()
  loadRole()
})

async function submit() {
  if (!name.value || !sportart.value || !datum.value || !uhrzeit.value || !selectedOrtId.value) return

  const token = await getAccessTokenSilently()

  // Get own user ID
  const meRes = await fetch(`${API}/api/nutzer/me`, {
    headers: { 'Authorization': `Bearer ${token}` },
  })
  if (!meRes.ok) return
  const me = await meRes.json()

  const zeit = `${datum.value}T${uhrzeit.value}:00`
  const typ = isKurs.value ? 'KURS' : 'EVENT'

  const body = {
    name: name.value,
    sportart: sportart.value,
    zeit,
    anzahlPlaetze: anzahlPlaetze.value,
    emoji: selectedEmoji.value,
    ersteller: String(me.id),
    typ,
    ort: { id: selectedOrtId.value },
  }

  if (isKurs.value) {
    body.preis = preis.value
  }

  const res = await fetch(`${API}/api/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  })

  if (res.ok) {
    router.push('/events')
  }
}
</script>

<template>
  <NavBar />

  <main class="main-content">
    <div class="create-page">

      <div class="back-row">
        <NavigationLink @click="router.back()">← Zurück</NavigationLink>
      </div>

      <h1 class="page-title">{{ isKurs ? 'Kurs erstellen' : 'Event erstellen' }}</h1>

      <!-- Trainer toggle -->
      <div v-if="isTrainer" class="toggle-row">
        <span :class="{ active: !isKurs }">Event</span>
        <label class="switch">
          <input type="checkbox" v-model="isKurs" />
          <span class="slider"></span>
        </label>
        <span :class="{ active: isKurs }">Kurs</span>
      </div>

      <form class="create-form" @submit.prevent="submit">

        <div class="form-group">
          <label>Name</label>
          <input v-model="name" type="text" required placeholder="z.B. Fußball am See" />
        </div>

        <div class="form-group">
          <label>Sportart</label>
          <input v-model="sportart" type="text" required placeholder="z.B. Fußball" />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Datum</label>
            <input v-model="datum" type="date" required />
          </div>
          <div class="form-group">
            <label>Uhrzeit</label>
            <input v-model="uhrzeit" type="time" required />
          </div>
        </div>

        <div class="form-group">
          <label>Anzahl Plätze</label>
          <input v-model.number="anzahlPlaetze" type="number" min="1" required />
        </div>

        <div v-if="isKurs" class="form-group">
          <label>Preis (€)</label>
          <input v-model.number="preis" type="number" min="0" step="0.01" required />
        </div>

        <div class="form-group">
          <label>Ort</label>
          <select v-model="selectedOrtId" required>
            <option :value="null" disabled>Ort auswählen…</option>
            <option v-for="o in orteStore.list" :key="o.id" :value="o.id">{{ o.name }}</option>
          </select>
          <div v-if="selectedOrt" class="ort-preview">
            <img :src="selectedOrt.bildUrl" :alt="selectedOrt.name" class="ort-preview-img" />
            <span class="ort-preview-name">{{ selectedOrt.name }}</span>
          </div>
        </div>

        <div class="form-group">
          <label>Emoji</label>
          <div class="emoji-picker">
            <button
              v-for="e in emojis"
              :key="e"
              type="button"
              class="emoji-btn"
              :class="{ selected: selectedEmoji === e }"
              @click="selectedEmoji = e"
            >{{ e }}</button>
          </div>
        </div>

        <Button type="submit">{{ isKurs ? 'Kurs erstellen' : 'Event erstellen' }}</Button>
      </form>

    </div>
  </main>
</template>

<style scoped>
.create-page {
  max-width: 600px;
  margin: 32px auto;
  padding: 0 16px 40px;
}

.back-row {
  margin-bottom: 12px;
}

.page-title {
  font-size: 22px;
  font-weight: bold;
  font-family: "Arial Rounded MT Bold", "Arial", sans-serif;
  color: #1E293B;
  margin-bottom: 20px;
}

.toggle-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  font-size: 14px;
  color: #64748B;
}

.toggle-row .active {
  color: #1E293B;
  font-weight: bold;
}

.switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background: #CBD5E1;
  border-radius: 24px;
  transition: 0.3s;
}

.slider::before {
  content: "";
  position: absolute;
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background: #fff;
  border-radius: 50%;
  transition: 0.3s;
}

.switch input:checked + .slider {
  background: #EF4444;
}

.switch input:checked + .slider::before {
  transform: translateX(20px);
}

.create-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 13px;
  font-weight: 600;
  color: #475569;
}

.form-group input,
.form-group select {
  padding: 10px 14px;
  border: 1px solid #CBD5E1;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  background: #F8FAFC;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #EF4444;
  background: #fff;
}

.form-row {
  display: flex;
  gap: 12px;
}

.form-row .form-group {
  flex: 1;
}

.ort-preview {
  margin-top: 8px;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

.ort-preview-img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  display: block;
}

.ort-preview-name {
  position: absolute;
  bottom: 8px;
  left: 10px;
  color: #fff;
  font-size: 13px;
  font-weight: bold;
  text-shadow: 0 1px 4px rgba(0,0,0,0.6);
}

.emoji-picker {
  display: flex;
  gap: 8px;
}

.emoji-btn {
  font-size: 28px;
  padding: 6px 10px;
  border: 2px solid transparent;
  border-radius: 10px;
  background: #F1F5F9;
  cursor: pointer;
  transition: border-color 0.2s;
}

.emoji-btn.selected {
  border-color: #EF4444;
  background: #FEF2F2;
}
</style>
