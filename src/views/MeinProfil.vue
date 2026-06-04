<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import NavBar from '../components/NavBar.vue'

const { getAccessTokenSilently } = useAuth0()

const vorname = ref('')
const nachname = ref('')
const email = ref('')
const profilFarbe = ref('#EF4444')
const loading = ref(true)
const saving = ref(false)
const error = ref('')
const success = ref('')

const farben = [
  '#EF4444', '#F97316', '#F59E0B', '#10B981',
  '#14B8A6', '#3B82F6', '#6366F1', '#8B5CF6',
  '#EC4899', '#64748B', '#06B6D4', '#84CC16',
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
    const res = await fetch('http://localhost:8081/api/nutzer/me', {
      headers: { 'Authorization': `Bearer ${token}` },
    })
    if (res.ok) {
      const data = await res.json()
      vorname.value = data.vorname
      nachname.value = data.nachname
      email.value = data.email
      profilFarbe.value = data.profilFarbe || '#EF4444'
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
    const res = await fetch('http://localhost:8081/api/nutzer/me', {
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

onMounted(loadProfile)
</script>

<template>
  <NavBar />
  <main class="main-content">
    <div class="detail-page">

      <!-- Hero Card like TrainerDetail -->
      <div class="profile-hero-card">
        <div class="avatar" :style="{ background: profilFarbe + '25', borderColor: profilFarbe }">
          <span class="avatar-initials" :style="{ color: profilFarbe }">{{ initialen }}</span>
        </div>
        <div class="profile-hero-info">
          <p class="profile-sport">Persönliches Profil</p>
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
      </div>

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
</style>
