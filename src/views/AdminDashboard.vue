<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { useAdminStore } from '../stores/admin.js'
import { useOrteStore } from '../stores/orte.js'
import NavBar from '../components/NavBar.vue'

const { getAccessTokenSilently } = useAuth0()
const admin = useAdminStore()
const orteStore = useOrteStore()
admin.setTokenGetter(getAccessTokenSilently)

const activeTab = ref('events')
const error = ref('')
const showModal = ref(false)
const modalMode = ref('edit') // 'edit' or 'create'
const modalType = ref('')
const modalData = reactive({})
const modalId = ref(null)
const showAuditLogs = ref(false)
const auditLogsLoading = ref(false)

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
  if (admin.isAdmin) {
    loadTab('events')
    orteStore.fetchAll()
  }
})

async function loadTab(tab) {
  activeTab.value = tab
  error.value = ''
  showAuditLogs.value = false
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
  if (type === 'event') {
    if (!modalData.typ) {
      modalData.typ = modalData.preis !== undefined && modalData.preis !== null ? 'KURS' : 'EVENT'
    }
    modalData.selectedOrtId = modalData.ort?.id || null
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
    Object.assign(modalData, { name: '', sportart: '', emoji: '⚽', anzahlPlaetze: 10, zeit: '', ersteller: '', typ: 'EVENT', selectedOrtId: null, preis: 0 })
  } else if (type === 'ort') {
    Object.assign(modalData, { name: '', adresse: '', art: 'OUTDOOR', bildUrl: '' })
  } else if (type === 'anmeldung') {
    Object.assign(modalData, { nutzerId: '', eventId: '' })
  }
  showModal.value = true
  error.value = ''
}

function buildEventPayload() {
  const zeit = modalData.zeit ? (modalData.zeit.length === 16 ? modalData.zeit + ':00' : modalData.zeit) : ''
  const payload = {
    name: modalData.name,
    sportart: modalData.sportart,
    emoji: modalData.emoji,
    anzahlPlaetze: modalData.anzahlPlaetze,
    zeit,
    ersteller: String(modalData.ersteller),
    typ: modalData.typ || 'EVENT',
    ort: modalData.selectedOrtId ? { id: modalData.selectedOrtId } : (modalData.ort || null),
  }
  if (payload.typ === 'KURS') {
    payload.preis = modalData.preis || 0
  }
  return payload
}

function closeModal() {
  showModal.value = false
  error.value = ''
}

async function saveModal() {
  error.value = ''
  // Validation
  if (modalType.value === 'event') {
    if (!modalData.name?.trim()) { error.value = 'Name ist erforderlich.'; return }
    if (!modalData.sportart?.trim()) { error.value = 'Sportart ist erforderlich.'; return }
    if (!modalData.zeit) { error.value = 'Zeit ist erforderlich.'; return }
    if (!modalData.anzahlPlaetze || modalData.anzahlPlaetze < 1) { error.value = 'Anzahl Plätze muss mindestens 1 sein.'; return }
    if (!String(modalData.ersteller ?? '').trim()) { error.value = 'Ersteller-ID ist erforderlich.'; return }
    if (modalData.typ === 'KURS' && (modalData.preis == null || modalData.preis < 0)) { error.value = 'Preis darf nicht negativ sein.'; return }
  }
  if (modalType.value === 'ort') {
    if (!modalData.name?.trim()) { error.value = 'Name ist erforderlich.'; return }
    if (!modalData.adresse?.trim()) { error.value = 'Adresse ist erforderlich.'; return }
    if (!modalData.bildUrl?.trim()) { error.value = 'Bild URL ist erforderlich.'; return }
    if (modalData.bildUrl.length > 255) { error.value = 'Bild URL darf maximal 255 Zeichen lang sein.'; return }
  }
  if (modalType.value === 'nutzer') {
    if (!modalData.vorname?.trim()) { error.value = 'Vorname ist erforderlich.'; return }
    if (!modalData.nachname?.trim()) { error.value = 'Nachname ist erforderlich.'; return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(modalData.email || '')) { error.value = 'Bitte eine gültige E-Mail-Adresse eingeben.'; return }
  }
  if (modalType.value === 'anmeldung') {
    if (!modalData.nutzerId || modalData.nutzerId < 1) { error.value = 'Nutzer-ID ist erforderlich (min. 1).'; return }
    if (!modalData.eventId || modalData.eventId < 1) { error.value = 'Event-ID ist erforderlich (min. 1).'; return }
  }
  try {
    if (modalMode.value === 'edit') {
      if (modalType.value === 'event') await admin.updateEvent(modalId.value, buildEventPayload())
      else if (modalType.value === 'ort') await admin.updateOrt(modalId.value, modalData)
      else if (modalType.value === 'nutzer') await admin.updateNutzer(modalId.value, modalData)
    } else {
      if (modalType.value === 'event') await admin.createEvent(buildEventPayload())
      else if (modalType.value === 'ort') await admin.createOrt(modalData)
      else if (modalType.value === 'anmeldung') await admin.createAnmeldung({ nutzerId: Number(modalData.nutzerId), eventId: Number(modalData.eventId) })
    }
    closeModal()
  } catch (e) {
    error.value = e.message
  }
}

async function handleDelete(type, id) {
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
  if (Array.isArray(ts)) {
    const [y, m, d, h = 0, min = 0, s = 0] = ts
    return new Date(y, m - 1, d, h, min, s).toLocaleString('de-DE')
  }
  const d = new Date(ts)
  if (isNaN(d.getTime())) return '-'
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

const tabEntityType = { events: 'Event', orte: 'Ort', nutzer: 'Nutzer', anmeldungen: 'Anmeldung' }

async function toggleAuditLogs() {
  if (showAuditLogs.value) {
    showAuditLogs.value = false
    return
  }
  const entityType = tabEntityType[activeTab.value]
  if (!entityType) return
  auditLogsLoading.value = true
  await admin.fetchAuditLogs(entityType)
  auditLogsLoading.value = false
  showAuditLogs.value = true
}

function statusLabel(s) {
  if (s === 'SUCCESS') return 'Erfolg'
  if (s === 'FAILURE') return 'Fehlgeschlagen'
  return 'Ausstehend'
}
function statusClass(s) {
  if (s === 'SUCCESS') return 'status-badge status-success'
  if (s === 'FAILURE') return 'status-badge status-failure'
  return 'status-badge status-pending'
}

function hasAuditDetails(log) {
  return typeof log?.details === 'string' && log.details.trim().length > 0
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

      <!-- Audit Logs Toggle -->
      <div v-if="activeTab !== 'bewerbungen'" class="audit-section">
        <button class="btn-audit-toggle" @click="toggleAuditLogs">
          {{ showAuditLogs ? '▾ Audit Logs ausblenden' : '▸ Audit Logs anzeigen' }}
        </button>
        <div v-if="auditLogsLoading" style="color:#64748B;font-size:12px;margin-top:8px;">Lade...</div>
        <div v-if="showAuditLogs && !auditLogsLoading" class="audit-logs-wrap">
          <table v-if="admin.auditLogs.length" class="admin-table audit-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Zeitpunkt</th>
                <th>Nutzer</th>
                <th>Aktion</th>
                <th>Entity Type</th>
                <th>Entity ID</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="log in admin.auditLogs" :key="log.id">
                <td>{{ log.id }}</td>
                <td>{{ formatDate(log.timestamp) }}</td>
                <td class="audit-userid">{{ log.nutzer ? (log.nutzer.vorname + ' ' + log.nutzer.nachname) : '-' }}</td>
                <td class="audit-action-cell">
                  <span>{{ log.action }}</span>
                  <span v-if="hasAuditDetails(log)" class="audit-info" aria-label="Details vorhanden" tabindex="0">
                    i
                    <span class="audit-info-tooltip">{{ log.details }}</span>
                  </span>
                </td>
                <td>{{ log.entityType }}</td>
                <td>{{ log.entityId ?? '-' }}</td>
                <td><span :class="statusClass(log.status)">{{ statusLabel(log.status) }}</span></td>
              </tr>
            </tbody>
          </table>
          <p v-else style="color:#64748B;font-size:12px;margin-top:8px;">Keine Audit Logs vorhanden.</p>
        </div>
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
          <label>Typ
            <select v-model="modalData.typ">
              <option value="EVENT">Event</option>
              <option value="KURS">Kurs</option>
            </select>
          </label>
          <label>Name <input v-model="modalData.name" required /></label>
          <label>Sportart <input v-model="modalData.sportart" required /></label>
          <label>Emoji <input v-model="modalData.emoji" /></label>
          <label>Anzahl Plätze <input type="number" min="1" v-model.number="modalData.anzahlPlaetze" required /></label>
          <label>Zeit <input type="datetime-local" v-model="modalData.zeit" required /></label>
          <label>Ort
            <select v-model="modalData.selectedOrtId">
              <option :value="null">– Kein Ort –</option>
              <option v-for="ort in orteStore.list" :key="ort.id" :value="ort.id">{{ ort.name }}</option>
            </select>
          </label>
          <label>Ersteller (Nutzer-ID) <input v-model="modalData.ersteller" required /></label>
          <label v-if="modalData.typ === 'KURS'">Preis <input type="number" step="0.01" min="0" v-model.number="modalData.preis" required /></label>
        </template>

        <!-- Ort fields -->
        <template v-if="modalType === 'ort'">
          <label>Name <input v-model="modalData.name" required /></label>
          <label>Adresse <input v-model="modalData.adresse" required /></label>
          <label>Art
            <select v-model="modalData.art">
              <option v-for="a in ['FITNESSSTUDIO','OUTDOOR','SPORTPLATZ','FUSSBALLPLATZ','WIESE','FAHRRADSTRECKE','LAUFSTRECKE','TURNHALLE']" :key="a" :value="a">{{ a }}</option>
            </select>
          </label>
          <label>Bild URL <input v-model="modalData.bildUrl" required maxlength="255" /></label>
        </template>

        <!-- Nutzer fields (edit only) -->
        <template v-if="modalType === 'nutzer'">
          <label>Vorname <input v-model="modalData.vorname" required /></label>
          <label>Nachname <input v-model="modalData.nachname" required /></label>
          <label>Email <input type="email" v-model="modalData.email" required disabled/></label>
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
          <label>Nutzer-ID <input type="number" min="1" v-model.number="modalData.nutzerId" required /></label>
          <label>Event-ID <input type="number" min="1" v-model.number="modalData.eventId" required /></label>
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
  width: 100%;
  max-width: 1400px;
  box-sizing: border-box;
  margin: 0 auto;
  min-height: calc(100vh - 120px);
  overflow-x: hidden;
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
  max-width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
}
.admin-tabs::-webkit-scrollbar { height: 4px; }
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
.admin-table-wrap {
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
}
.admin-table {
  width: max-content;
  min-width: 100%;
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
.audit-section {
  margin-top: 20px;
  border-top: 1px solid #E2E8F0;
  padding-top: 12px;
}
.btn-audit-toggle {
  padding: 6px 14px;
  font-size: 12px;
  font-weight: 600;
  background: #F1F5F9;
  color: #475569;
  border: 1px solid #E2E8F0;
  border-radius: 4px;
  cursor: pointer;
}
.btn-audit-toggle:hover { background: #E2E8F0; }
.audit-logs-wrap {
  margin-top: 10px;
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
}
.audit-table .audit-userid {
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.audit-action-cell {
  overflow: visible !important;
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
}
.status-badge {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.02em;
}
.status-success {
  background: #DCFCE7;
  color: #16A34A;
}
.status-failure {
  background: #FEE2E2;
  color: #DC2626;
}
.status-pending {
  background: #FEF9C3;
  color: #CA8A04;
}
.audit-info {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1px solid #C00000;
  color: #C00000;
  font-size: 11px;
  font-weight: 700;
  cursor: help;
  background: #FFF1F2;
  user-select: none;
}
.audit-info-tooltip {
  position: absolute;
  left: 50%;
  bottom: calc(100% + 8px);
  transform: translateX(-50%);
  min-width: 180px;
  max-width: 320px;
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid #FECACA;
  background: #FEF2F2;
  color: #7F1D1D;
  font-size: 11px;
  line-height: 1.4;
  white-space: normal;
  box-shadow: 0 8px 24px rgba(127, 29, 29, 0.15);
  z-index: 5;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}
.audit-info:hover .audit-info-tooltip,
.audit-info:focus-visible .audit-info-tooltip {
  opacity: 1;
  visibility: visible;
}
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

@media (max-width: 768px) {
  .admin-wrap {
    padding: 18px 16px;
  }
}
</style>
