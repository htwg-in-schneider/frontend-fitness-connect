<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'

const { getAccessTokenSilently, user } = useAuth0()
const router = useRouter()
const API = import.meta.env.VITE_API_BASE_URL

const vorname = ref('')
const nachname = ref('')
const email = ref('')

onMounted(() => {
  if (user.value?.email) {
    email.value = user.value.email
  }
})
const error = ref('')
const loading = ref(false)

async function submit() {
  error.value = ''
  loading.value = true
  try {
    const token = await getAccessTokenSilently()
    const res = await fetch(`${API}/api/nutzer/me/complete-profile`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        vorname: vorname.value,
        nachname: nachname.value,
        email: email.value || user.value?.email,
      }),
    })
    if (!res.ok) {
      error.value = 'Fehler beim Speichern. Bitte erneut versuchen.'
      return
    }
    router.push('/')
  } catch (e) {
    error.value = 'Ein Fehler ist aufgetreten.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="complete-profile-wrapper">
    <div class="detail-card">
      <h2 class="detail-section-title">Profil vervollständigen</h2>
      <p class="hint">Bitte gib noch ein paar Daten ein, um dein Konto einzurichten.</p>
      <form @submit.prevent="submit" class="profile-form">
        <label>
          <span class="field-label">E-Mail</span>
          <input v-model="email" type="email" required placeholder="E-Mail-Adresse" disabled />
        </label>
        <label>
          <span class="field-label">Vorname</span>
          <input v-model="vorname" type="text" required placeholder="Vorname" />
        </label>
        <label>
          <span class="field-label">Nachname</span>
          <input v-model="nachname" type="text" required placeholder="Nachname" />
        </label>
        <p v-if="error" class="error">{{ error }}</p>
        <button type="submit" class="btn-default save-btn" :disabled="loading">
          {{ loading ? 'Wird gespeichert…' : 'Speichern' }}
        </button>
      </form>
      <div class="trainer-link">
        <a href="#" @click.prevent="router.push('/become-trainer')">Als Trainer registrieren →</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.complete-profile-wrapper {
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

.profile-form input {
  padding: 10px 14px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  background: #F8FAFC;
  color: #1E293B;
  font-size: 14px;
  font-family: "Arial", sans-serif;
}

.profile-form input:focus {
  outline: none;
  border-color: #C00000;
}

.profile-form input:disabled {
  opacity: 0.7;
  cursor: not-allowed;
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
</style>
