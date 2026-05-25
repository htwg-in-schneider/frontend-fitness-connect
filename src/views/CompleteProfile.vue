<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'

const { getAccessTokenSilently, user } = useAuth0()
const router = useRouter()

const vorname = ref('')
const nachname = ref('')
const email = ref('')
const error = ref('')
const loading = ref(false)

async function submit() {
  error.value = ''
  loading.value = true
  try {
    const token = await getAccessTokenSilently()
    const res = await fetch('http://localhost:8081/api/nutzer/me/complete-profile', {
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
  <div class="complete-profile">
    <h1>Profil vervollständigen</h1>
    <p>Bitte gib noch ein paar Daten ein, um dein Konto einzurichten.</p>
    <form @submit.prevent="submit" class="profile-form">
      <label>
        E-Mail
        <input v-model="email" type="email" required placeholder="E-Mail-Adresse" />
      </label>
      <label>
        Vorname
        <input v-model="vorname" type="text" required placeholder="Vorname" />
      </label>
      <label>
        Nachname
        <input v-model="nachname" type="text" required placeholder="Nachname" />
      </label>
      <p v-if="error" class="error">{{ error }}</p>
      <button type="submit" :disabled="loading">
        {{ loading ? 'Wird gespeichert…' : 'Speichern' }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.complete-profile {
  max-width: 400px;
  margin: 80px auto;
  padding: 32px;
  background: #1E293B;
  border-radius: 12px;
  color: #fff;
}

h1 {
  margin-bottom: 8px;
  font-size: 1.5rem;
}

p {
  margin-bottom: 24px;
  color: #94A3B8;
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.875rem;
  color: #CBD5E1;
}

input {
  padding: 10px 12px;
  border: 1px solid #334155;
  border-radius: 6px;
  background: #0F172A;
  color: #fff;
  font-size: 1rem;
}

input::placeholder {
  color: #475569;
}

button {
  padding: 12px;
  background: #3B82F6;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  color: #EF4444;
  margin: 0;
}
</style>
