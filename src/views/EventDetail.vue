<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'
import { useEventsStore } from '../stores/events.js'
import { formatEventDate } from '../utils.js'
import NavBar from '../components/NavBar.vue'
import Button from '../components/Button.vue'
import NavigationLink from '../components/NavigationLink.vue'
import { MapPin, Calendar, Armchair, User } from 'lucide-vue-next'
import applePayIcon from '../assets/icons/applepay.svg'
import googlePayIcon from '../assets/icons/googlepay.svg'
import paypalIcon from '../assets/icons/paypal.svg'
import mastercardIcon from '../assets/icons/mastercard.svg'

const API = import.meta.env.VITE_API_BASE_URL

const route = useRoute()
const router = useRouter()
const { isAuthenticated, getAccessTokenSilently } = useAuth0()
const eventsStore = useEventsStore()
const trainer = ref(null)
const bereitsAngemeldet = ref(false)
const showKursModal = ref(false)
const selectedPayment = ref(null)
const meineNutzerId = ref(null)

const paymentMethods = [
  { id: 'applepay', name: 'Apple Pay', icon: applePayIcon },
  { id: 'googlepay', name: 'Google Pay', icon: googlePayIcon },
  { id: 'paypal', name: 'PayPal', icon: paypalIcon },
  { id: 'mastercard', name: 'Mastercard', icon: mastercardIcon },
]

// Mastercard form
const cardNumber = ref('')
const cardHolder = ref('')
const cardExpiry = ref('')
const cardCvc = ref('')
const cardErrors = ref({})

function formatCardNumber(e) {
  let val = e.target.value.replace(/\D/g, '').slice(0, 16)
  cardNumber.value = val.replace(/(\d{4})(?=\d)/g, '$1 ')
}

function formatExpiry(e) {
  let val = e.target.value.replace(/\D/g, '').slice(0, 4)
  if (val.length >= 3) val = val.slice(0, 2) + '/' + val.slice(2)
  cardExpiry.value = val
}

function validateCard() {
  const errors = {}
  const num = cardNumber.value.replace(/\s/g, '')
  if (!/^\d{16}$/.test(num)) errors.cardNumber = 'Ungültige Kartennummer'
  if (!cardHolder.value.trim() || cardHolder.value.trim().length < 2) errors.cardHolder = 'Name erforderlich'
  const [mm, yy] = (cardExpiry.value || '').split('/')
  const month = parseInt(mm, 10)
  const year = parseInt('20' + yy, 10)
  const now = new Date()
  if (!mm || !yy || month < 1 || month > 12 || year < now.getFullYear() ||
      (year === now.getFullYear() && month < now.getMonth() + 1)) {
    errors.cardExpiry = 'Ungültiges Ablaufdatum'
  }
  if (!/^\d{3}$/.test(cardCvc.value)) errors.cardCvc = 'Ungültiger CVC'
  cardErrors.value = errors
  return Object.keys(errors).length === 0
}

function resetCardForm() {
  cardNumber.value = ''
  cardHolder.value = ''
  cardExpiry.value = ''
  cardCvc.value = ''
  cardErrors.value = {}
}

function handleModalConfirm() {
  if (selectedPayment.value?.id === 'mastercard') {
    if (validateCard()) beitreten()
  } else {
    beitreten()
  }
}

onMounted(async () => {
  await eventsStore.fetchAll()
  await fetchTrainer()
  await checkAnmeldung()
  await fetchMeineId()
})

async function fetchMeineId() {
  if (!isAuthenticated.value) return
  try {
    const token = await getAccessTokenSilently()
    const res = await fetch(`${API}/api/nutzer/me`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
    if (res.ok) {
      const data = await res.json()
      meineNutzerId.value = data.id
    }
  } catch (_) {}
}

watch(() => route.params.id, async () => {
  await fetchTrainer()
  await checkAnmeldung()
})

async function fetchTrainer() {
  trainer.value = null
  const id = route.params.id
  if (!id) return
  try {
    const res = await fetch(`${API}/api/events/${id}/trainer`)
    if (res.ok) trainer.value = await res.json()
  } catch (_) {}
}

async function checkAnmeldung() {
  bereitsAngemeldet.value = false
  if (!isAuthenticated.value) return
  try {
    const token = await getAccessTokenSilently()
    const res = await fetch(`${API}/api/anmeldungen/check/${route.params.id}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
    if (res.ok) bereitsAngemeldet.value = await res.json()
  } catch (_) {}
}

const event = computed(() => eventsStore.list.find(e => e.id === Number(route.params.id)))
const istVoll = computed(() => event.value && event.value.anzahlAnmeldungen >= event.value.anzahlPlaetze)
const istVergangen = computed(() => event.value && event.value.date < new Date())
const istEigenes = computed(() => event.value && meineNutzerId.value && event.value.ersteller === String(meineNutzerId.value))

function handleTeilnehmen() {
  if (event.value?.preis) {
    showKursModal.value = true
  } else {
    beitreten()
  }
}

async function beitreten() {
  showKursModal.value = false
  resetCardForm()
  try {
    const token = await getAccessTokenSilently()
    const res = await fetch(`${API}/api/anmeldungen/${route.params.id}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    })
    if (res.ok) {
      bereitsAngemeldet.value = true
      // refresh event data
      await eventsStore.search({})
    }
  } catch (_) {}
}

async function abmelden() {
  try {
    const token = await getAccessTokenSilently()
    const res = await fetch(`${API}/api/anmeldungen/${route.params.id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    })
    if (res.ok) {
      bereitsAngemeldet.value = false
      await eventsStore.search({})
    }
  } catch (_) {}
}

function renderStars(rating) {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - full - (half ? 1 : 0))
}
</script>

<template>
  <NavBar />

  <main class="main-content">
    <div v-if="event" class="detail-page">

      <!-- 1. Zurück-Link -->
      <div class="back-row">
        <NavigationLink @click="router.back()">← Zurück</NavigationLink>
      </div>

      <!-- Kurs-Layout: Location hero oben, Detail-Card links streckt sich auf Höhe der rechten Cards -->
      <template v-if="event.preis">
        <div class="location-hero-card location-hero-card--clickable" @click="router.push('/ort/' + event.ort.id)">
          <img :src="event.ort.bild_pfad" :alt="event.ort.name" class="location-hero-img" />
          <div class="location-blur-zone"></div>
          <div class="location-hero-overlay">
            <div class="location-hero-info">
              <span class="location-type">{{ event.ort.art }}</span>
              <span class="location-name">{{ event.ort.name }}</span>
            </div>
            <NavigationLink @click.stop="router.push('/ort/' + event.ort.id)">Ort ansehen →</NavigationLink>
          </div>
        </div>

        <div class="detail-grid detail-grid--stretch">
          <!-- Detail-Card (merged, streckt sich) -->
          <div class="detail-card detail-card--full-height">
            <h1 class="event-title">{{ event.name }}</h1>
            <p class="event-sportart">{{ event.sportart }}</p>
            <br>
            <ul class="info-list">
              <li>
                <span class="info-label"><MapPin :size="14" /> Ort</span>
                <span class="info-value">{{ event.ort.adresse }}</span>
              </li>
              <li>
                <span class="info-label"><Calendar :size="14" /> Datum</span>
                <span class="info-value">{{ formatEventDate(event.date) }}</span>
              </li>
              <li>
                <span class="info-label"><Armchair :size="14" /> Plätze</span>
                <span class="info-value">{{ event.anzahlPlaetze - event.anzahlAnmeldungen }} / {{ event.anzahlPlaetze }} frei</span>
              </li>
            </ul>
          </div>

          <!-- Rechte Spalte: Trainer + Preis -->
          <div class="col-right">
            <div v-if="trainer" class="detail-card trainer-card">
              <div class="trainer-card-top">
                <img :src="trainer.profilbildUrl" :alt="trainer.name" class="trainer-img" />
                <div class="trainer-info">
                  <p class="trainer-label"><User :size="14" /> Trainer</p>
                  <p class="trainer-name">{{ trainer.name }}</p>
                </div>
              </div>
              <Button @click="router.push('/trainer/' + trainer.id)">Profil ansehen</Button>
            </div>

            <div class="detail-card">
              <h2 class="detail-section-title">Preisübersicht</h2>
              <div class="price-row">
                <span class="price-label">{{ event.name }}</span>
                <span class="price-value">{{ event.preis.toFixed(2) }} €</span>
              </div>
              <hr class="price-divider" />
              <div class="price-row">
                <span class="price-label price-bold">Gesamtpreis</span>
                <span class="price-value price-bold">{{ event.preis.toFixed(2) }} €</span>
              </div>
              <template v-if="!bereitsAngemeldet">
                <p class="detail-section-title payment-title">Zahlungsmethode</p>
                <div class="payment-methods">
                  <button
                    v-for="method in paymentMethods"
                    :key="method.id"
                    class="payment-method-btn"
                    :class="{ 'payment-method-btn--selected': selectedPayment?.id === method.id }"
                    @click="selectedPayment = method"
                  >
                  <img :src="method.icon" :alt="method.name" class="payment-icon" />
                </button>
              </div>
              </template>
            </div>
          </div>
        </div>

        <div v-if="bereitsAngemeldet" class="anmeldung-actions">
          <Button variant="secondary" :disabled="true">Bereits angemeldet</Button>
          <Button variant="danger" @click="abmelden">Abmelden</Button>
        </div>
        <Button v-else :disabled="istVoll || istVergangen || istEigenes || !selectedPayment" @click="handleTeilnehmen">
          {{ istVergangen ? 'Event bereits vorbei' : istEigenes ? 'Eigenes Event' : istVoll ? 'Ausgebucht' : (selectedPayment ? 'Jetzt bezahlen' : 'Zahlungsmethode wählen') }}
        </Button>
      </template>

      <!-- Event-Layout: Detail-Card links, Location-Hero rechts, gleiche Höhe -->
      <template v-else>
        <div class="detail-grid detail-grid--stretch">
          <div class="detail-card detail-card--full-height">
            <h1 class="event-title">{{ event.name }}</h1>
            <p class="event-sportart">{{ event.sportart }}</p>
            <h2 class="detail-section-title section-title-gap">Event-Details</h2>
            <ul class="info-list">
              <li>
                <span class="info-label"><MapPin :size="14" /> Ort</span>
                <span class="info-value">{{ event.ort.adresse }}</span>
              </li>
              <li>
                <span class="info-label"><Calendar :size="14" /> Datum</span>
                <span class="info-value">{{ formatEventDate(event.date) }}</span>
              </li>
              <li>
                <span class="info-label"><Armchair :size="14" /> Plätze</span>
                <span class="info-value">{{ event.anzahlPlaetze - event.anzahlAnmeldungen }} / {{ event.anzahlPlaetze }} frei</span>
              </li>
            </ul>
          </div>

          <div class="location-hero-card location-hero-card--inline" @click="router.push('/ort/' + event.ort.id)">
            <img :src="event.ort.bild_pfad" :alt="event.ort.name" class="location-hero-img" />
            <div class="location-blur-zone"></div>
            <div class="location-hero-overlay">
              <div class="location-hero-info">
                <span class="location-type">{{ event.ort.art }}</span>
                <span class="location-name">{{ event.ort.name }}</span>
              </div>
              <NavigationLink @click="router.push('/ort/' + event.ort.id)">Ort ansehen →</NavigationLink>
            </div>
          </div>
        </div>

        <div v-if="bereitsAngemeldet" class="anmeldung-actions">
          <Button variant="secondary" :disabled="true">Bereits angemeldet</Button>
          <Button variant="danger" @click="abmelden">Abmelden</Button>
        </div>
        <Button v-else :disabled="istVoll || istVergangen || istEigenes" @click="handleTeilnehmen">
          {{ istVergangen ? 'Event bereits vorbei' : istEigenes ? 'Eigenes Event' : istVoll ? 'Ausgebucht' : 'Teilnehmen' }}
        </Button>
      </template>

      <!-- Kurs beitreten Modal -->
      <div v-if="showKursModal" class="modal-overlay" @click.self="showKursModal = false">
        <div class="modal-card">
          <div class="modal-header">
            <img :src="selectedPayment.icon" :alt="selectedPayment.name" class="modal-header-icon" />
            <span class="modal-header-title">{{ selectedPayment.name }}</span>
          </div>
          <p class="modal-text">{{ event.preis.toFixed(2) }} € kostenpflichtig beitreten?</p>

          <!-- Mastercard form -->
          <template v-if="selectedPayment.id === 'mastercard'">
            <div class="card-form">
              <div class="card-field">
                <label class="card-label">Kartennummer</label>
                <input
                  class="card-input"
                  :class="{ 'card-input--error': cardErrors.cardNumber }"
                  :value="cardNumber"
                  @input="formatCardNumber"
                  placeholder="1234 5678 9012 3456"
                  maxlength="19"
                />
                <span v-if="cardErrors.cardNumber" class="card-error">{{ cardErrors.cardNumber }}</span>
              </div>
              <div class="card-field">
                <label class="card-label">Karteninhaber</label>
                <input
                  class="card-input"
                  :class="{ 'card-input--error': cardErrors.cardHolder }"
                  v-model="cardHolder"
                  placeholder="Max Mustermann"
                />
                <span v-if="cardErrors.cardHolder" class="card-error">{{ cardErrors.cardHolder }}</span>
              </div>
              <div class="card-row">
                <div class="card-field">
                  <label class="card-label">Ablaufdatum</label>
                  <input
                    class="card-input"
                    :class="{ 'card-input--error': cardErrors.cardExpiry }"
                    :value="cardExpiry"
                    @input="formatExpiry"
                    placeholder="MM/JJ"
                    maxlength="5"
                  />
                  <span v-if="cardErrors.cardExpiry" class="card-error">{{ cardErrors.cardExpiry }}</span>
                </div>
                <div class="card-field">
                  <label class="card-label">CVC</label>
                  <input
                    class="card-input"
                    :class="{ 'card-input--error': cardErrors.cardCvc }"
                    v-model="cardCvc"
                    placeholder="123"
                    maxlength="3"
                    inputmode="numeric"
                  />
                  <span v-if="cardErrors.cardCvc" class="card-error">{{ cardErrors.cardCvc }}</span>
                </div>
              </div>
            </div>
          </template>

          <div class="modal-actions">
            <button class="modal-btn modal-btn--cancel" @click="showKursModal = false; resetCardForm()">Abbrechen</button>
            <button class="modal-btn modal-btn--confirm" @click="handleModalConfirm">
              <img :src="selectedPayment.icon" :alt="selectedPayment.name" class="modal-payment-icon" />
              {{ selectedPayment.name }}
            </button>
          </div>
        </div>
      </div>

    </div>

    <div v-else class="not-found">
      <p v-if="eventsStore.loading">Lade…</p>
      <p v-else>Event nicht gefunden.</p>
      <button class="back-btn" @click="router.push('/')">← Zur Startseite</button>
    </div>
  </main>
</template>

<style scoped>
.anmeldung-actions {
  display: flex;
  gap: 12px;
}

.detail-page {
  max-width: 1000px;
  padding: 0 16px 40px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  align-items: start;
}

.detail-grid--stretch {
  align-items: stretch;
}

.detail-card--full-height {
  height: 100%;
  box-sizing: border-box;
}

.col-right {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
}

/* Location card when used inline in the grid */
.location-hero-card--inline {
  height: 100%;
  min-height: 200px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.location-hero-card--inline:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.14);
}

.location-hero-card--inline .location-hero-img {
  height: 100%;
  min-height: 200px;
}

@media (max-width: 768px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }

  .detail-card--full-height,
  .location-hero-card--inline {
    height: auto;
  }

  .location-hero-card--inline .location-hero-img {
    height: 200px;
  }
}

/* back row */
.back-row {
  display: flex;
  justify-content: flex-start;
}

/* 2. Location Hero Card */
.location-hero-card {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}

.location-hero-card--clickable {
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.location-hero-card--clickable:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.14);
}

.location-hero-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
}

/* Blur zone: bottom ~40% of the image gets a backdrop-filter blur,
   fading in via a mask so the top stays sharp */
.location-blur-zone {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 70%);
  mask-image: linear-gradient(to bottom, transparent 0%, black 70%);
  pointer-events: none;
}

.location-hero-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 16px;
  background: linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 100%);
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}

.location-hero-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.location-type {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.8);
  font-family: "Arial", sans-serif;
}

.location-name {
  font-size: 16px;
  font-weight: bold;
  color: #FFFFFF;
  font-family: "Arial Rounded MT Bold", "Arial", sans-serif;
}

/* Cards */
.detail-card {
  background: #FFFFFF;
  border-radius: 16px;
  padding: 18px 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.event-title {
  font-size: 20px;
  font-weight: bold;
  font-family: "Arial Rounded MT Bold", "Arial", sans-serif;
  color: #1E293B;
  margin: 0 0 4px;
}

.event-sportart {
  font-size: 13px;
  color: #64748B;
  font-family: "Arial", sans-serif;
  margin: 0;
}

.detail-section-title {
  font-size: 11px;
  font-weight: bold;
  font-family: "Arial", sans-serif;
  color: #94A3B8;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin: 0 0 12px;
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
}

/* 5. Trainer Card */
.trainer-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.trainer-card-top {
  display: flex;
  align-items: center;
  gap: 14px;
}

.trainer-img {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.trainer-info {
  flex: 1;
  min-width: 0;
}

.trainer-btn-wrap {
  flex-shrink: 0;
  width: 52px;
}

.trainer-name {
  font-size: 14px;
  font-weight: bold;
  font-family: "Arial Rounded MT Bold", "Arial", sans-serif;
  color: #1E293B;
  margin: 0 0 2px;
}

.trainer-sport {
  font-size: 12px;
  color: #64748B;
  font-family: "Arial", sans-serif;
  margin: 0 0 2px;
}

.trainer-rating {
  font-size: 12px;
  color: #F59E0B;
  font-family: "Arial", sans-serif;
  margin: 0;
}

.rating-num {
  color: #64748B;
}

/* 6. Price Card */
.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: "Arial", sans-serif;
  font-size: 13px;
  margin-bottom: 10px;
}

.price-label {
  color: #1E293B;
}

.price-value {
  color: #1E293B;
}

.price-bold {
  font-weight: bold;
  font-size: 14px;
}

.price-divider {
  border: none;
  border-top: 1px solid #E2E8F0;
  margin: 0 0 10px;
}

.payment-title {
  margin-top: 16px;
}

.payment-methods {
  display: flex;
  gap: 8px;
}

.payment-method-btn {
  flex: 1;
  background: #F8FAFC;
  border: 2px solid #E2E8F0;
  border-radius: 12px;
  padding: 8px 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.15s, background 0.15s;
}

.payment-method-btn:hover {
  border-color: #94A3B8;
  background: #F1F5F9;
}

.payment-method-btn--selected {
  border-color: #C00000;
  background: #FFF5F5;
}

.payment-icon {
  height: 28px;
  object-fit: contain;
}

.modal-payment-icon {
  height: 18px;
  object-fit: contain;
  vertical-align: middle;
  margin-right: 6px;
}

/* Not found */
.not-found {
  text-align: center;
  margin-top: 80px;
  font-family: "Arial", sans-serif;
  color: #64748B;
}

.back-btn {
  background: none;
  border: none;
  color: #C00000;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  padding: 0;
  font-family: "Arial", sans-serif;
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

.modal-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.modal-header-icon {
  height: 28px;
  object-fit: contain;
}

.modal-header-title {
  font-size: 16px;
  font-weight: bold;
  font-family: "Arial Rounded MT Bold", "Arial", sans-serif;
  color: #1E293B;
}

/* Card form */
.card-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.card-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.card-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.card-label {
  font-size: 11px;
  font-weight: bold;
  font-family: "Arial", sans-serif;
  color: #64748B;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.card-input {
  padding: 9px 11px;
  border: 1.5px solid #E2E8F0;
  border-radius: 8px;
  font-size: 13px;
  font-family: "Arial", sans-serif;
  color: #1E293B;
  outline: none;
  transition: border-color 0.15s;
  background: #F8FAFC;
}

.card-input:focus {
  border-color: #94A3B8;
  background: #fff;
}

.card-input--error {
  border-color: #C00000;
}

.card-error {
  font-size: 11px;
  color: #C00000;
  font-family: "Arial", sans-serif;
}
</style>

