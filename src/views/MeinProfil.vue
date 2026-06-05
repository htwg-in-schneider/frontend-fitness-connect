<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import NavBar from '../components/NavBar.vue'

const { getAccessTokenSilently, logout } = useAuth0()

function handleLogout() {
  logout({ logoutParams: { returnTo: window.location.origin + import.meta.env.BASE_URL } })
}


const API = import.meta.env.VITE_API_BASE_URL

const vorname = ref('')
const nachname = ref('')
const email = ref('')
const profilFarbe = ref('#EF4444')
const rolle = ref('USER')
const loading = ref(true)
const saving = ref(false)
const savingTrainer = ref(false)
const error = ref('')
const success = ref('')

// Trainer fields
const trainerart = ref('')
const kontoinhaber = ref('')
const iban = ref('')
const bic = ref('')
const telefonnummer = ref('')
const zitat = ref('')
const profilbildUrl = ref('')

const isTrainer = computed(() => rolle.value === 'TRAINER')

const farben = [
  '#EF4444', '#F97316', '#F59E0B', '#10B981',
  '#14B8A6', '#3B82F6', '#6366F1', '#8B5CF6',
  '#EC4899', '#64748B', '#06B6D4', '#84CC16',
]

const profilbilder = [
  'https://htwg-in-schneider.github.io/frontend-static-fitness-connect/TrainerImages/IlyasK.png',
  'https://htwg-in-schneider.github.io/frontend-static-fitness-connect/TrainerImages/LisaM.png',
  'https://htwg-in-schneider.github.io/frontend-static-fitness-connect/TrainerImages/MaxS.png',
  'https://htwg-in-schneider.github.io/frontend-static-fitness-connect/TrainerImages/AlidaW.png',
]

const initialen = computed(() => {
  const v = vorname.value?.trim()
  const n = nachname.value?.trim()
  return ((v?.[0] || '') + (n?.[0] || '')).toUpperCase()
})

async function loadProfile() {
  loading.value = true
  try {
    const token = await getAccessTokenSilently()
    const res = await fetch(`${API}/api/nutzer/me`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
    if (res.ok) {
      const data = await res.json()
      vorname.value = data.vorname
      nachname.value = data.nachname
      email.value = data.email
      profilFarbe.value = data.profilFarbe || '#EF4444'
      rolle.value = data.rolle
    }
    // Load trainer data if trainer
    const trainerRes = await fetch(`${API}/api/nutzer/me/trainer`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
    if (trainerRes.ok) {
      const td = await trainerRes.json()
      trainerart.value = td.trainerart || ''
      kontoinhaber.value = td.kontoinhaber || ''
      iban.value = td.iban || ''
      bic.value = td.bic || ''
      telefonnummer.value = td.telefonnummer || ''
      zitat.value = td.zitat || ''
      profilbildUrl.value = td.profilbildUrl || ''
    }
  } catch (e) {
    error.value = 'Profil konnte nicht geladen werden.'
  } finally {
    loading.value = false
  }
}

async function saveProfile() {
  error.value = ''
  success.value = ''
  saving.value = true
  try {
    const token = await getAccessTokenSilently()
    const res = await fetch(`${API}/api/nutzer/me`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        vorname: vorname.value,
        nachname: nachname.value,
        email: email.value,
        profilFarbe: profilFarbe.value,
      }),
    })
    if (res.ok) {
      success.value = 'Profil erfolgreich gespeichert.'
    } else {
      error.value = 'Fehler beim Speichern.'
    }
  } catch (e) {
    error.value = 'Ein Fehler ist aufgetreten.'
  } finally {
    saving.value = false
  }
}

async function saveTrainerProfile() {
  error.value = ''
  success.value = ''
  savingTrainer.value = true
  try {
    const token = await getAccessTokenSilently()
    const res = await fetch(`${API}/api/nutzer/me/trainer`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        trainerart: trainerart.value,
        kontoinhaber: kontoinhaber.value,
        iban: iban.value,
        bic: bic.value,
        telefonnummer: telefonnummer.value,
        zitat: zitat.value,
        profilbildUrl: profilbildUrl.value,
      }),
    })
    if (res.ok) {
      success.value = 'Trainerprofil erfolgreich gespeichert.'
    } else {
      error.value = 'Fehler beim Speichern.'
    }
  } catch (e) {
    error.value = 'Ein Fehler ist aufgetreten.'
  } finally {
    savingTrainer.value = false
  }
}

onMounted(loadProfile)
</script>

<template>
  <NavBar />
  <main class="main-content">
    <div class="detail-page">

      <!-- Hero Card like TrainerDetail -->
      <div class="profile-hero-card">
        <img v-if="isTrainer && profilbildUrl" class="trainer-avatar" :src="profilbildUrl" alt="Profilbild" />
        <div v-else class="avatar" :style="{ background: profilFarbe + '25', borderColor: profilFarbe }">
          <span class="avatar-initials" :style="{ color: profilFarbe }">{{ initialen }}</span>
        </div>
        <div class="profile-hero-info">
          <p class="profile-sport">{{ isTrainer ? 'Trainer · ' + trainerart : 'Persönliches Profil' }}</p>
          <h1 class="profile-name">{{ vorname }} {{ nachname }}</h1>
          <p class="profile-email">{{ email }}</p>
        </div>
      </div>

      <div v-if="loading" class="detail-card loading">Laden…</div>

      <!-- Form Card -->
      <div v-else class="detail-card">
        <h2 class="detail-section-title">Daten bearbeiten</h2>
        <form @submit.prevent="saveProfile" class="profile-form">
          <label>
            <span class="field-label">Vorname</span>
            <input v-model="vorname" type="text" required placeholder="Vorname" />
          </label>
          <label>
            <span class="field-label">Nachname</span>
            <input v-model="nachname" type="text" required placeholder="Nachname" />
          </label>
          <label>
            <span class="field-label">E-Mail</span>
            <input v-model="email" type="email" required placeholder="E-Mail-Adresse" />
          </label>

          <div class="color-section">
            <span class="field-label">Profilfarbe</span>
            <div class="color-palette">
              <button
                v-for="farbe in farben"
                :key="farbe"
                type="button"
                class="color-swatch"
                :class="{ active: profilFarbe === farbe }"
                :style="{ background: farbe }"
                @click="profilFarbe = farbe"
              />
            </div>
          </div>

          <p v-if="error" class="msg error-msg">{{ error }}</p>
          <p v-if="success" class="msg success-msg">{{ success }}</p>

          <button type="submit" class="btn-default save-btn" :disabled="saving">
            {{ saving ? 'Wird gespeichert…' : 'Änderungen speichern' }}
          </button>
        </form>
        <div v-if="!isTrainer" class="trainer-link">
          <a href="#" @click.prevent="$router.push('/become-trainer')">Als Trainer registrieren →</a>
        </div>
        <div class="trainer-link">
          <a href="#" @click.prevent="$router.push('/meine-events')">Meine Events →</a>
        </div>
      </div>

      <!-- Trainer Card -->
      <div v-if="isTrainer" class="detail-card">
        <h2 class="detail-section-title">Trainerprofil bearbeiten</h2>
        <form @submit.prevent="saveTrainerProfile" class="profile-form">
          <label>
            <span class="field-label">Trainerart</span>
            <input v-model="trainerart" type="text" required placeholder="z. B. Fitness, Yoga, Fußball" />
          </label>
          <label>
            <span class="field-label">Kontoinhaber</span>
            <input v-model="kontoinhaber" type="text" required placeholder="Kontoinhaber" />
          </label>
          <label>
            <span class="field-label">IBAN</span>
            <input v-model="iban" type="text" required placeholder="DE..." />
          </label>
          <label>
            <span class="field-label">BIC</span>
            <input v-model="bic" type="text" required placeholder="BIC" />
          </label>
          <label>
            <span class="field-label">Telefonnummer</span>
            <input v-model="telefonnummer" type="tel" required placeholder="+49..." />
          </label>
          <label>
            <span class="field-label">Persönliches Zitat</span>
            <textarea v-model="zitat" rows="3" placeholder="Ein persönliches Zitat…"></textarea>
          </label>
          <div class="image-selection">
            <span class="field-label">Profilbild</span>
            <div class="image-grid">
              <div
                v-for="bild in profilbilder"
                :key="bild"
                class="image-option"
                :class="{ selected: profilbildUrl === bild }"
                @click="profilbildUrl = bild"
              >
                <img :src="bild" alt="Profilbild" />
              </div>
            </div>
          </div>
          <button type="submit" class="btn-default save-btn" :disabled="savingTrainer">
            {{ savingTrainer ? 'Wird gespeichert…' : 'Trainerprofil speichern' }}
          </button>
        </form>
      </div>

      <button class="btn-logout" @click="handleLogout">Abmelden</button>

    </div>
  </main>
</template>

<style scoped>
.detail-page {
  max-width: 600px;
  margin: 32px auto;
  padding: 0 16px 40px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.profile-hero-card {
  display: flex;
  align-items: center;
  gap: 20px;
  background: #FFFFFF;
  border-radius: 20px;
  padding: 24px 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid;
  flex-shrink: 0;
}

.avatar-initials {
  font-size: 1.6rem;
  font-weight: 700;
  letter-spacing: 1px;
  font-family: "Arial Rounded MT Bold", "Arial", sans-serif;
}

.profile-hero-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.profile-sport {
  font-size: 11px;
  font-weight: bold;
  font-family: "Arial", sans-serif;
  color: #94A3B8;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin: 0;
}

.profile-name {
  font-size: 22px;
  font-weight: bold;
  font-family: "Arial Rounded MT Bold", "Arial", sans-serif;
  color: #1E293B;
  margin: 0;
}

.profile-email {
  font-size: 13px;
  color: #64748B;
  margin: 2px 0 0;
  font-family: "Arial", sans-serif;
}

.detail-card {
  background: #FFFFFF;
  border-radius: 16px;
  padding: 20px 24px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.detail-section-title {
  font-size: 11px;
  font-weight: bold;
  font-family: "Arial", sans-serif;
  color: #94A3B8;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin: 0 0 16px;
}

.loading {
  color: #94A3B8;
  text-align: center;
  padding: 24px 0;
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.profile-form label {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-size: 12px;
  font-weight: 600;
  color: #64748B;
  font-family: "Arial", sans-serif;
}

.profile-form input {
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid #E2E8F0;
  background: #F8FAFC;
  color: #1E293B;
  font-size: 14px;
  font-family: "Arial", sans-serif;
  transition: border-color 0.2s;
}

.profile-form input:focus {
  outline: none;
  border-color: #C00000;
}

.color-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.color-palette {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.color-swatch {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 3px solid transparent;
  cursor: pointer;
  transition: transform 0.15s, border-color 0.15s, box-shadow 0.15s;
}

.color-swatch:hover {
  transform: scale(1.15);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.color-swatch.active {
  border-color: #1E293B;
  transform: scale(1.15);
}

.save-btn {
  margin-top: 8px;
  padding: 12px;
  font-size: 13px;
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.msg {
  margin: 0;
  font-size: 13px;
  font-family: "Arial", sans-serif;
}

.error-msg {
  color: #EF4444;
}

.success-msg {
  color: #10B981;
}

.trainer-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.profile-form textarea {
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid #E2E8F0;
  background: #F8FAFC;
  color: #1E293B;
  font-size: 14px;
  font-family: "Arial", sans-serif;
  resize: vertical;
}

.profile-form textarea:focus {
  outline: none;
  border-color: #C00000;
}

.image-selection {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.image-option {
  border-radius: 12px;
  border: 3px solid transparent;
  cursor: pointer;
  overflow: hidden;
  transition: border-color 0.2s;
}

.image-option img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  display: block;
}

.image-option.selected {
  border-color: #C00000;
}

.image-option:hover:not(.selected) {
  border-color: #E2E8F0;
}

.trainer-link {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #E2E8F0;
  text-align: center;
}

.trainer-link a {
  color: #C00000;
  font-size: 13px;
  font-weight: 600;
  font-family: "Arial", sans-serif;
  text-decoration: none;
}

.trainer-link a:hover {
  text-decoration: underline;
}

.btn-logout {
  width: 100%;
  padding: 12px;
  background: #C00000;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-logout:hover {
  background: #A00000;
}
</style>
