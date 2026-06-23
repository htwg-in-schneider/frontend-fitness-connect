<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'
import { formatEventDate } from '../utils.js'
import NavBar from '../components/NavBar.vue'
import NavigationLink from '../components/NavigationLink.vue'
import { Pencil, Calendar, Trash2, LogOut, Plus } from 'lucide-vue-next'

const API = import.meta.env.VITE_API_BASE_URL
const router = useRouter()
const { getAccessTokenSilently } = useAuth0()

const events = ref([])
const anmeldungen = ref([])
const showDeleteModal = ref(false)
const eventToDelete = ref(null)

function askDelete(event) {
  eventToDelete.value = event
  showDeleteModal.value = true
}

function cancelDelete() {
  showDeleteModal.value = false
  eventToDelete.value = null
}

async function confirmDelete() {
  const event = eventToDelete.value
  showDeleteModal.value = false
  eventToDelete.value = null
  try {
    const token = await getAccessTokenSilently()
    const res = await fetch(`${API}/api/events/${event.id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    })
    if (res.ok) {
      events.value = events.value.filter(e => e.id !== event.id)
    }
  } catch (_) {}
}

async function abmelden(eventId) {
  try {
    const token = await getAccessTokenSilently()
    const res = await fetch(`${API}/api/anmeldungen/${eventId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    })
    if (res.ok) {
      anmeldungen.value = anmeldungen.value.filter(e => e.id !== eventId)
    }
  } catch (_) {}
}

onMounted(async () => {
  try {
    const token = await getAccessTokenSilently()
    const meRes = await fetch(`${API}/api/nutzer/me`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
    if (!meRes.ok) return
    const me = await meRes.json()

    const res = await fetch(`${API}/api/events/meine?ersteller=${me.id}`)
    if (res.ok) {
      const data = await res.json()
      events.value = data.map(e => ({
        ...e,
        date: new Date(e.zeit),
        ort: e.ort ? { ...e.ort, bild_pfad: e.ort.bildUrl } : null,
      }))
    }

    // Fetch anmeldungen
    const anmRes = await fetch(`${API}/api/anmeldungen/meine`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
    if (anmRes.ok) {
      const data = await anmRes.json()
      anmeldungen.value = data.map(e => ({
        ...e,
        date: new Date(e.zeit),
      }))
    }
  } catch (_) {}
})
</script>

<template>
  <NavBar />

  <main class="main-content">
    <div class="meine-events-page">

      <div class="back-row">
        <NavigationLink @click="router.back()">← Zurück</NavigationLink>
      </div>

      <div class="page-title-row">
        <h1 class="page-title"><Calendar :size="20" /> Meine Events</h1>
        <button class="add-btn" @click="router.push('/event-erstellen')" title="Event erstellen">
          <Plus :size="18" />
        </button>
      </div>

      <div v-if="events.length === 0" class="keine-ergebnisse">
        Du hast noch keine Events erstellt.
      </div>

      <div class="event-list">
        <div class="event-row" v-for="event in events" :key="event.id">
          <span class="event-emoji">{{ event.emoji }}</span>
          <div class="event-row-info">
            <span class="event-row-name">{{ event.name }}</span>
            <span class="event-row-meta">{{ event.sportart }} · {{ formatEventDate(event.date) }}</span>
          </div>
          <button class="edit-btn" @click="router.push('/event-bearbeiten/' + event.id)" title="Bearbeiten">
            <Pencil :size="16" />
          </button>
          <button class="delete-btn" @click="askDelete(event)" title="Löschen">
            <Trash2 :size="16" />
          </button>
        </div>
      </div>

      <!-- Delete confirmation modal -->
      <div v-if="showDeleteModal" class="modal-overlay" @click.self="cancelDelete">
        <div class="modal-card">
          <p class="modal-text">Soll Event <strong>{{ eventToDelete?.name }}</strong> wirklich gelöscht werden?</p>
          <div class="modal-actions">
            <button class="modal-btn modal-btn--cancel" @click="cancelDelete">Abbrechen</button>
            <button class="modal-btn modal-btn--confirm" @click="confirmDelete">Ja, löschen</button>
          </div>
        </div>
      </div>

      <!-- Meine Anmeldungen -->
      <h2 class="section-title"><Calendar :size="18" /> Meine Anmeldungen</h2>

      <div v-if="anmeldungen.length === 0" class="keine-ergebnisse">
        Du bist noch bei keinem Event angemeldet.
      </div>

      <div class="event-list">
        <div class="event-row" v-for="anmeldung in anmeldungen" :key="anmeldung.id">
          <span class="event-emoji">{{ anmeldung.emoji }}</span>
          <div class="event-row-info" @click="router.push('/event/' + anmeldung.id)" style="cursor: pointer;">
            <span class="event-row-name">{{ anmeldung.name }}</span>
            <span class="event-row-meta">{{ anmeldung.sportart }} · {{ formatEventDate(anmeldung.date) }}</span>
          </div>
          <button class="delete-btn" @click="abmelden(anmeldung.id)" title="Abmelden">
            <LogOut :size="16" />
          </button>
        </div>
      </div>

    </div>
  </main>
</template>

<style scoped>
.meine-events-page {
  max-width: 700px;
  margin: 32px auto;
  padding: 0 16px 40px;
}

.back-row {
  margin-bottom: 12px;
}

.page-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.page-title {
  font-size: 22px;
  font-weight: bold;
  font-family: "Arial Rounded MT Bold", "Arial", sans-serif;
  color: #1E293B;
  margin-bottom: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.add-btn {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: none;
  background: #C00000;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s;
}

.add-btn:hover {
  background: #A00000;
}

.keine-ergebnisse {
  color: #64748B;
  font-size: 14px;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  font-family: "Arial Rounded MT Bold", "Arial", sans-serif;
  color: #1E293B;
  margin-top: 36px;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.event-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.event-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.event-emoji {
  font-size: 24px;
}

.event-row-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.event-row-name {
  font-size: 14px;
  font-weight: 600;
  color: #1E293B;
}

.event-row-meta {
  font-size: 12px;
  color: #64748B;
}

.edit-btn {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: none;
  background: #FEE2E2;
  color: #EF4444;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
}

.edit-btn:hover {
  background: #FECACA;
}

.delete-btn {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: none;
  background: #FEE2E2;
  color: #EF4444;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
}

.delete-btn:hover {
  background: #FECACA;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px 28px;
  max-width: 380px;
  width: 90%;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}

.modal-text {
  font-size: 14px;
  color: #1E293B;
  margin-bottom: 20px;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.modal-btn {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: background 0.15s;
}

.modal-btn--cancel {
  background: #E2E8F0;
  color: #475569;
}

.modal-btn--cancel:hover {
  background: #CBD5E1;
}

.modal-btn--confirm {
  background: #C00000;
  color: #fff;
}

.modal-btn--confirm:hover {
  background: #A00000;
}
</style>
