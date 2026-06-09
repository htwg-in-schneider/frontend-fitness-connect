<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { useAdminStore } from '../stores/admin.js'
import NavBar from '../components/NavBar.vue'

const { getAccessTokenSilently } = useAuth0()
const admin = useAdminStore()
admin.setTokenGetter(getAccessTokenSilently)

const activeTab = ref('events')
const error = ref('')
const showModal = ref(false)
const modalMode = ref('edit') // 'edit' or 'create'
const modalType = ref('')
const modalData = reactive({})
const modalId = ref(null)

// Search filters per tab
const searchEvents = reactive({ name: '', sportart: '', ersteller: '' })
const searchOrte = reactive({ name: '', adresse: '', art: '' })
const searchNutzer = reactive({ vorname: '', nachname: '', email: '', rolle: '' })
const searchAnmeldungen = reactive({ nutzer: '', event: '' })

const tabs = [
  { key: 'events', label: 'Events' },
  { key: 'orte', label: 'Orte' },
  { key: 'nutzer', label: 'Nutzer' },
  { key: 'anmeldungen', label: 'Anmeldungen' },
  { key: 'bewerbungen', label: 'Bewerbungen' },
]

onMounted(async () => {
  await admin.checkAdmin()
  if (admin.isAdmin) loadTab('events')
})

async function loadTab(tab) {
  activeTab.value = tab
  error.value = ''
  if (tab === 'events') await admin.fetchEvents()
  else if (tab === 'orte') await admin.fetchOrte()
  else if (tab === 'nutzer') await admin.fetchNutzer()
  else if (tab === 'anmeldungen') await admin.fetchAnmeldungen()
  else if (tab === 'bewerbungen') await admin.fetchBewerbungen()
}

// Filtered lists
const filteredEvents = computed(() => {
  return admin.events.filter(e =>
    (!searchEvents.name || (e.name || '').toLowerCase().includes(searchEvents.name.toLowerCase())) &&
    (!searchEvents.sportart || (e.sportart || '').toLowerCase().includes(searchEvents.sportart.toLowerCase())) &&
    (!searchEvents.ersteller || String(e.ersteller || '').toLowerCase().includes(searchEvents.ersteller.toLowerCase()))
  )
})
const filteredOrte = computed(() => {
  return admin.orte.filter(o =>
    (!searchOrte.name || (o.name || '').toLowerCase().includes(searchOrte.name.toLowerCase())) &&
    (!searchOrte.adresse || (o.adresse || '').toLowerCase().includes(searchOrte.adresse.toLowerCase())) &&
    (!searchOrte.art || (o.art || '').toLowerCase().includes(searchOrte.art.toLowerCase()))
  )
})
const filteredNutzer = computed(() => {
  return admin.nutzer.filter(n =>
    (!searchNutzer.vorname || (n.vorname || '').toLowerCase().includes(searchNutzer.vorname.toLowerCase())) &&
    (!searchNutzer.nachname || (n.nachname || '').toLowerCase().includes(searchNutzer.nachname.toLowerCase())) &&
    (!searchNutzer.email || (n.email || '').toLowerCase().includes(searchNutzer.email.toLowerCase())) &&
    (!searchNutzer.rolle || (n.rolle || '').toLowerCase().includes(searchNutzer.rolle.toLowerCase()))
  )
})
const filteredAnmeldungen = computed(() => {
  return admin.anmeldungen.filter(a =>
    (!searchAnmeldungen.nutzer || (a.nutzer?.email || '').toLowerCase().includes(searchAnmeldungen.nutzer.toLowerCase())) &&
    (!searchAnmeldungen.event || (a.event?.name || '').toLowerCase().includes(searchAnmeldungen.event.toLowerCase()))
  )
})

function openEdit(item, type) {
  modalMode.value = 'edit'
  modalType.value = type
  modalId.value = item.id
  Object.keys(modalData).forEach(k => delete modalData[k])
  Object.assign(modalData, JSON.parse(JSON.stringify(item)))
  // Format zeit for datetime-local input
  if (type === 'event' && modalData.zeit) {
    modalData.zeit = modalData.zeit.substring(0, 16)
  }
  showModal.value = true
  error.value = ''
}

function openCreate(type) {
  modalMode.value = 'create'
  modalType.value = type
  modalId.value = null
  Object.keys(modalData).forEach(k => delete modalData[k])
  if (type === 'event') {
    Object.assign(modalData, { name: '', sportart: '', emoji: '', anzahlPlaetze: 10, zeit: '', ersteller: '', typ: 'EVENT' })
  } else if (type === 'ort') {
    Object.assign(modalData, { name: '', adresse: '', art: 'OUTDOOR', bildUrl: '' })
  } else if (type === 'anmeldung') {
    Object.assign(modalData, { nutzerId: '', eventId: '' })
  }
  showModal.value = true
  error.value = ''
}

function closeModal() {
  showModal.value = false
  error.value = ''
}

async function saveModal() {
  error.value = ''
  try {
    if (modalMode.value === 'edit') {
      if (modalType.value === 'event') await admin.updateEvent(modalId.value, modalData)
      else if (modalType.value === 'ort') await admin.updateOrt(modalId.value, modalData)
      else if (modalType.value === 'nutzer') await admin.updateNutzer(modalId.value, modalData)
    } else {
      if (modalType.value === 'event') await admin.createEvent(modalData)
      else if (modalType.value === 'ort') await admin.createOrt(modalData)
      else if (modalType.value === 'anmeldung') await admin.createAnmeldung({ nutzerId: Number(modalData.nutzerId), eventId: Number(modalData.eventId) })
    }
    closeModal()
  } catch (e) {
    error.value = e.message
  }
}

async function handleDelete(type, id) {
  if (!confirm('Wirklich löschen?')) return
  error.value = ''
  try {
    if (type === 'event') await admin.deleteEvent(id)
    else if (type === 'ort') await admin.deleteOrt(id)
    else if (type === 'nutzer') await admin.deleteNutzer(id)
    else if (type === 'anmeldung') await admin.deleteAnmeldung(id)
  } catch (e) {
    error.value = e.message
  }
}

function formatDate(ts) {
  if (!ts) return '-'
  const d = new Date(ts)
  return d.toLocaleString('de-DE')
}

async function handleAnnehmen(id) {
  error.value = ''
  try {
    await admin.bewerbungAnnehmen(id)
  } catch (e) {
    error.value = e.message
  }
}

async function handleAblehnen(id) {
  error.value = ''
  try {
    await admin.bewerbungAblehnen(id)
  } catch (e) {
    error.value = e.message
  }
}
</script>

<template>
  <NavBar />
  <div class="admin-wrap">
    <div v-if="!admin.isAdmin" class="admin-denied">
      <p>Zugriff verweigert. Nur Administratoren haben Zugang.</p>
    </div>
    <template v-else>
      <h1 class="admin-title">Admin Dashboard</h1>

      <!-- Tabs -->
      <div class="admin-tabs">
        <button v-for="tab in tabs" :key="tab.key"
          :class="['tab-btn', { active: activeTab === tab.key }]"
          @click="loadTab(tab.key)">{{ tab.label }}</button>
      </div>

      <!-- Error -->
      <div v-if="error" class="admin-error">{{ error }}</div>

      <!-- Events Tab -->
      <div v-if="activeTab === 'events'" class="admin-table-wrap">
        <div class="table-actions">
          <button class="btn-create" @click="openCreate('event')">+ Event erstellen</button>
        </div>
        <table class="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th><span>Name</span><input v-model="searchEvents.name" placeholder="🔍" class="col-search"></th>
              <th><span>Sportart</span><input v-model="searchEvents.sportart" placeholder="🔍" class="col-search"></th>
              <th>Zeit</th>
              <th>Plätze</th>
              <th>Anm.</th>
              <th><span>Ersteller</span><input v-model="searchEvents.ersteller" placeholder="🔍" class="col-search"></th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="ev in filteredEvents" :key="ev.id">
              <td>{{ ev.id }}</td>
              <td>{{ ev.name }}</td>
              <td>{{ ev.sportart }}</td>
              <td>{{ formatDate(ev.zeit) }}</td>
              <td>{{ ev.anzahlPlaetze }}</td>
              <td>{{ ev.anzahlAnmeldungen }}</td>
              <td>{{ ev.ersteller }}</td>
              <td class="actions">
                <button class="btn-edit" @click="openEdit(ev, 'event')">Ändern</button>
                <button class="btn-del" @click="handleDelete('event', ev.id)">Löschen</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Orte Tab -->
      <div v-if="activeTab === 'orte'" class="admin-table-wrap">
        <div class="table-actions">
          <button class="btn-create" @click="openCreate('ort')">+ Ort erstellen</button>
        </div>
        <table class="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th><span>Name</span><input v-model="searchOrte.name" placeholder="🔍" class="col-search"></th>
              <th><span>Adresse</span><input v-model="searchOrte.adresse" placeholder="🔍" class="col-search"></th>
              <th><span>Art</span><input v-model="searchOrte.art" placeholder="🔍" class="col-search"></th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="ort in filteredOrte" :key="ort.id">
              <td>{{ ort.id }}</td>
              <td>{{ ort.name }}</td>
              <td>{{ ort.adresse }}</td>
              <td>{{ ort.art }}</td>
              <td class="actions">
                <button class="btn-edit" @click="openEdit(ort, 'ort')">Ändern</button>
                <button class="btn-del" @click="handleDelete('ort', ort.id)">Löschen</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Nutzer Tab -->
      <div v-if="activeTab === 'nutzer'" class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th><span>Vorname</span><input v-model="searchNutzer.vorname" placeholder="🔍" class="col-search"></th>
              <th><span>Nachname</span><input v-model="searchNutzer.nachname" placeholder="🔍" class="col-search"></th>
              <th><span>Email</span><input v-model="searchNutzer.email" placeholder="🔍" class="col-search"></th>
              <th><span>Rolle</span><input v-model="searchNutzer.rolle" placeholder="🔍" class="col-search"></th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="n in filteredNutzer" :key="n.id">
              <td>{{ n.id }}</td>
              <td>{{ n.vorname }}</td>
              <td>{{ n.nachname }}</td>
              <td>{{ n.email }}</td>
              <td>{{ n.rolle }}</td>
              <td class="actions">
                <button class="btn-edit" @click="openEdit(n, 'nutzer')">Ändern</button>
                <button class="btn-del" @click="handleDelete('nutzer', n.id)">Löschen</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Anmeldungen Tab -->
      <div v-if="activeTab === 'anmeldungen'" class="admin-table-wrap">
        <div class="table-actions">
          <button class="btn-create" @click="openCreate('anmeldung')">+ Anmeldung erstellen</button>
        </div>
        <table class="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th><span>Nutzer</span><input v-model="searchAnmeldungen.nutzer" placeholder="🔍" class="col-search"></th>
              <th><span>Event</span><input v-model="searchAnmeldungen.event" placeholder="🔍" class="col-search"></th>
              <th>Zeitpunkt</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="a in filteredAnmeldungen" :key="a.id">
              <td>{{ a.id }}</td>
              <td>{{ a.nutzer?.email || a.nutzer?.id }}</td>
              <td>{{ a.event?.name || a.event?.id }}</td>
              <td>{{ formatDate(a.zeitpunkt) }}</td>
              <td class="actions">
                <button class="btn-del" @click="handleDelete('anmeldung', a.id)">Löschen</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Bewerbungen Tab -->
      <div v-if="activeTab === 'bewerbungen'" class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Vorname</th>
              <th>Nachname</th>
              <th>Email</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="b in admin.bewerbungen" :key="b.id">
              <td>{{ b.id }}</td>
              <td>{{ b.vorname }}</td>
              <td>{{ b.nachname }}</td>
              <td>{{ b.email }}</td>
              <td class="actions">
                <button class="btn-edit" @click="handleAnnehmen(b.id)">Annehmen</button>
                <button class="btn-del" @click="handleAblehnen(b.id)">Ablehnen</button>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-if="admin.bewerbungen.length === 0" style="color:#64748B;font-size:13px;margin-top:12px;">Keine offenen Bewerbungen.</p>
      </div>

      <!-- Modal -->
    </template>
  </div>
  <Teleport to="body">
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="admin-modal">
        <h3>{{ modalMode === 'create' ? 'Neu erstellen' : 'Bearbeiten' }} – {{ modalType === 'event' ? 'Event' : modalType === 'ort' ? 'Ort' : modalType === 'nutzer' ? 'Nutzer' : 'Anmeldung' }}
          <span v-if="modalMode === 'edit'">(ID: {{ modalId }})</span>
        </h3>
        <div v-if="error" class="admin-error modal-error">{{ error }}</div>

        <!-- Event fields -->
        <template v-if="modalType === 'event'">
          <label>Name <input v-model="modalData.name" /></label>
          <label>Sportart <input v-model="modalData.sportart" /></label>
          <label>Emoji <input v-model="modalData.emoji" /></label>
          <label>Anzahl Plätze <input type="number" v-model.number="modalData.anzahlPlaetze" /></label>
          <label>Zeit <input type="datetime-local" v-model="modalData.zeit" /></label>
          <label>Ersteller (Nutzer-ID) <input v-model="modalData.ersteller" /></label>
          <label v-if="modalData.preis !== undefined || modalMode === 'create'">Preis (leer = kein Kurs) <input type="number" step="0.01" v-model.number="modalData.preis" /></label>
        </template>

        <!-- Ort fields -->
        <template v-if="modalType === 'ort'">
          <label>Name <input v-model="modalData.name" /></label>
          <label>Adresse <input v-model="modalData.adresse" /></label>
          <label>Art
            <select v-model="modalData.art">
              <option v-for="a in ['FITNESSSTUDIO','OUTDOOR','SPORTPLATZ','FUSSBALLPLATZ','WIESE','FAHRRADSTRECKE','LAUFSTRECKE','TURNHALLE']" :key="a" :value="a">{{ a }}</option>
            </select>
          </label>
          <label>Bild URL <input v-model="modalData.bildUrl" /></label>
        </template>

        <!-- Nutzer fields (edit only) -->
        <template v-if="modalType === 'nutzer'">
          <label>Vorname <input v-model="modalData.vorname" /></label>
          <label>Nachname <input v-model="modalData.nachname" /></label>
          <label>Email <input v-model="modalData.email" /></label>
          <label>Rolle
            <select v-model="modalData.rolle">
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </label>
          <label>Profilfarbe <input type="color" v-model="modalData.profilFarbe" /></label>
        </template>

        <!-- Anmeldung fields (create only) -->
        <template v-if="modalType === 'anmeldung'">
          <label>Nutzer-ID <input type="number" v-model.number="modalData.nutzerId" /></label>
          <label>Event-ID <input type="number" v-model.number="modalData.eventId" /></label>
        </template>

        <div class="modal-actions">
          <button class="btn-save" @click="saveModal">{{ modalMode === 'create' ? 'Erstellen' : 'Speichern' }}</button>
          <button class="btn-cancel" @click="closeModal">Abbrechen</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.admin-wrap {
  padding: 24px 32px;
  max-width: 1400px;
  margin: 0 auto;
  min-height: calc(100vh - 120px);
}
.admin-denied {
  text-align: center;
  padding: 80px 0;
  color: #64748B;
  font-size: 16px;
}
.admin-title {
  font-size: 20px;
  font-weight: bold;
  color: #1E293B;
  margin-bottom: 16px;
}
.admin-tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 16px;
  border-bottom: 2px solid #E2E8F0;
}
.tab-btn {
  padding: 8px 18px;
  border: none;
  background: transparent;
  font-size: 13px;
  font-weight: 600;
  color: #64748B;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
}
.tab-btn.active { color: #C00000; border-bottom-color: #C00000; }
.tab-btn:hover { color: #1E293B; }
.admin-error {
  background: #FEF2F2;
  color: #DC2626;
  border: 1px solid #FECACA;
  padding: 8px 12px;
  border-radius: 4px;
  margin-bottom: 12px;
  font-size: 12px;
}
.table-actions {
  margin-bottom: 10px;
}
.btn-create {
  padding: 6px 14px;
  font-size: 12px;
  font-weight: 600;
  background: #1E293B;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.btn-create:hover { background: #334155; }
.admin-table-wrap { overflow-x: auto; }
.admin-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}
.admin-table th {
  background: #F1F5F9;
  padding: 6px 10px;
  text-align: left;
  font-weight: 600;
  color: #475569;
  border-bottom: 1px solid #E2E8F0;
  white-space: nowrap;
  vertical-align: bottom;
}
.admin-table th span { display: block; margin-bottom: 3px; }
.col-search {
  display: block;
  width: 100%;
  padding: 3px 6px;
  border: 1px solid #E2E8F0;
  border-radius: 3px;
  font-size: 11px;
  background: #fff;
  margin-top: 2px;
}
.col-search:focus { outline: none; border-color: #C00000; }
.admin-table td {
  padding: 6px 10px;
  border-bottom: 1px solid #F1F5F9;
  color: #1E293B;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.admin-table tbody tr:hover { background: #F8FAFC; }
.actions { display: flex; gap: 4px; white-space: nowrap; }
.btn-edit {
  padding: 3px 8px; font-size: 11px;
  background: #1E293B; color: #fff;
  border: none; border-radius: 3px; cursor: pointer;
}
.btn-edit:hover { background: #334155; }
.btn-del {
  padding: 3px 8px; font-size: 11px;
  background: #DC2626; color: #fff;
  border: none; border-radius: 3px; cursor: pointer;
}
.btn-del:hover { background: #B91C1C; }
</style>

<style>
/* Modal - unscoped because Teleport renders outside component */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000;
}
.admin-modal {
  background: #fff; border-radius: 8px; padding: 24px;
  width: 440px; max-width: 90vw; max-height: 80vh; overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0,0,0,0.15);
}
.admin-modal h3 { font-size: 15px; margin-bottom: 16px; color: #1E293B; }
.admin-modal label {
  display: flex; flex-direction: column; gap: 3px;
  font-size: 12px; color: #475569; margin-bottom: 10px; font-weight: 600;
}
.admin-modal input, .admin-modal select {
  padding: 6px 10px; border: 1px solid #E2E8F0; border-radius: 4px;
  font-size: 13px; color: #1E293B; font-weight: 400;
}
.admin-modal input:focus, .admin-modal select:focus { outline: none; border-color: #C00000; }
.modal-actions { display: flex; gap: 8px; margin-top: 16px; justify-content: flex-end; }
.modal-error { margin-top: 8px; }
.btn-save {
  padding: 7px 16px; background: #C00000; color: #fff;
  border: none; border-radius: 4px; font-size: 12px; font-weight: 600; cursor: pointer;
}
.btn-save:hover { background: #A00000; }
.btn-cancel {
  padding: 7px 16px; background: #F1F5F9; color: #475569;
  border: 1px solid #E2E8F0; border-radius: 4px; font-size: 12px; cursor: pointer;
}
.btn-cancel:hover { background: #E2E8F0; }
</style>
