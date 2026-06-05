<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'

const { getAccessTokenSilently } = useAuth0()
const router = useRouter()
const API = import.meta.env.VITE_API_BASE_URL

const trainerart = ref('')
const kontoinhaber = ref('')
const iban = ref('')
const bic = ref('')
const telefonnummer = ref('')
const zitat = ref('')
const profilbildUrl = ref('')
const error = ref('')
const loading = ref(false)

const profilbilder = [
  'https://htwg-in-schneider.github.io/frontend-static-fitness-connect/TrainerImages/IlyasK.png',
  'https://htwg-in-schneider.github.io/frontend-static-fitness-connect/TrainerImages/LisaM.png',
  'https://htwg-in-schneider.github.io/frontend-static-fitness-connect/TrainerImages/MaxS.png',
  'https://htwg-in-schneider.github.io/frontend-static-fitness-connect/TrainerImages/AlidaW.png',
]

async function submit() {
  error.value = ''
  if (!profilbildUrl.value) {
    error.value = 'Bitte wähle ein Profilbild aus.'
    return
  }
  loading.value = true
  try {
    const token = await getAccessTokenSilently()
    const res = await fetch(`${API}/api/nutzer/me/become-trainer`, {
      method: 'POST',
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
    if (!res.ok) {
      error.value = 'Fehler beim Speichern. Bitte erneut versuchen.'
      return
    }
    router.push('/profil')
  } catch (e) {
    error.value = 'Ein Fehler ist aufgetreten.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="become-trainer-wrapper">
    <div class="detail-card">
      <h2 class="detail-section-title">Trainerprofil vervollständigen</h2>
      <p class="hint">Werde Trainer und teile dein Wissen mit anderen.</p>
      <form @submit.prevent="submit" class="profile-form">
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
          <span class="field-label">Profilbild wählen</span>
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
        <p v-if="error" class="error">{{ error }}</p>
        <button type="submit" class="btn-default save-btn" :disabled="loading">
          {{ loading ? 'Wird gespeichert…' : 'Als Trainer registrieren' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.become-trainer-wrapper {
  max-width: 440px;
  margin: 100px auto;
  padding: 0 16px;
}

.detail-card {
  background: #FFFFFF;
  border-radius: 16px;
  padding: 28px 28px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.detail-section-title {
  font-size: 18px;
  font-weight: bold;
  font-family: "Arial Rounded MT Bold", "Arial", sans-serif;
  color: #1E293B;
  margin: 0 0 6px;
}

.hint {
  margin: 0 0 20px;
  color: #64748B;
  font-size: 13px;
  font-family: "Arial", sans-serif;
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

.profile-form input,
.profile-form textarea {
  padding: 10px 14px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  background: #F8FAFC;
  color: #1E293B;
  font-size: 14px;
  font-family: "Arial", sans-serif;
  resize: vertical;
}

.profile-form input:focus,
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

.save-btn {
  margin-top: 8px;
  padding: 12px;
  font-size: 13px;
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  color: #EF4444;
  margin: 0;
  font-size: 13px;
}
</style>
