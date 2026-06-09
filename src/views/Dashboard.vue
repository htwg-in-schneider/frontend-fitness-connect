<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'
import { useTrainerStore } from '../stores/trainer.js'
import { useOrteStore } from '../stores/orte.js'
import { useEventsStore } from '../stores/events.js'
import NavBar from '../components/NavBar.vue'
import HeroSection from '../components/HeroSection.vue'
import EventsSection from '../components/EventsSection.vue'
import OrteSection from '../components/OrteSection.vue'
import TrainerSection from '../components/TrainerSection.vue'
import ContactSection from '../components/ContactSection.vue'

const router = useRouter()
const { isAuthenticated, getAccessTokenSilently } = useAuth0()
const trainerStore = useTrainerStore()
const orteStore = useOrteStore()
const eventsStore = useEventsStore()
const API = import.meta.env.VITE_API_BASE_URL

const vorname = ref('')
const nachname = ref('')
const profilFarbe = ref('#EF4444')
const trainerProfilbild = ref('')
const rolle = ref('')

const initialen = computed(() => {
  const v = vorname.value?.trim()
  const n = nachname.value?.trim()
  return ((v?.[0] || '') + (n?.[0] || '')).toUpperCase()
})

async function loadProfile() {
  try {
    const token = await getAccessTokenSilently()
    const res = await fetch(`${API}/api/nutzer/me`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
    if (res.ok) {
      const data = await res.json()
      vorname.value = data.vorname
      nachname.value = data.nachname
      profilFarbe.value = data.profilFarbe || '#EF4444'
      rolle.value = data.rolle
    }
    const trainerRes = await fetch(`${API}/api/nutzer/me/trainer`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
    if (trainerRes.ok) {
      const td = await trainerRes.json()
      trainerProfilbild.value = td.profilbildUrl || ''
    }
  } catch (e) { /* ignore */ }
}

onMounted(() => {
  trainerStore.fetchAll()
  orteStore.fetchAll()
  eventsStore.fetchAll()
  if (isAuthenticated.value) loadProfile()
})

watch(isAuthenticated, (authenticated) => {
  if (authenticated) loadProfile()
})
</script>

<template>
    <NavBar />

    <main class="main-content">
        <header class="content-header">
            <div class="header-mid">
                <div class="welcome-container">
                    <h1 class="welcome-title">Willkommen!</h1>
                    <p class="welcome-subtitle">Finde dein nächstes Training in Konstanz</p>
                </div>
            </div>
            <div class="header-right">
                <button v-if="isAuthenticated" class="create-event-btn" @click="router.push('/event-erstellen')">
                    Erstelle dein Event
                </button>
                <button v-if="isAuthenticated" class="create-event-btn" @click="router.push('/meine-events')">
                    Meine Events
                </button>
                <button v-if="isAuthenticated && trainerProfilbild" class="profile-avatar trainer-img-btn" @click="router.push('/profil')">
                    <img :src="trainerProfilbild" alt="Profil" class="trainer-img" />
                </button>
                <button v-else-if="isAuthenticated" class="profile-avatar" @click="router.push('/profil')" :style="{ background: profilFarbe + '33', borderColor: profilFarbe }">
                    <span :style="{ color: profilFarbe }">{{ initialen }}</span>
                </button>
            </div>
        </header>



        <HeroSection />
        <p v-if="eventsStore.error" class="fetch-error">⚠️ {{ eventsStore.error }}</p>
        <EventsSection v-else :events="eventsStore.list.slice(0, 4)" />
        <p v-if="orteStore.error" class="fetch-error">⚠️ {{ orteStore.error }}</p>
        <OrteSection v-else :orte="orteStore.list.slice(0, 4)" />
        <p v-if="trainerStore.error" class="fetch-error">⚠️ {{ trainerStore.error }}</p>
        <TrainerSection v-else :trainer="trainerStore.list" />
        <ContactSection />
    </main>
</template>

<style scoped>
.fetch-error {
    padding: 12px 24px;
    color: #C00000;
    font-size: 13px;
}

.profile-avatar {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    border: 2px solid;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 0.85rem;
    font-weight: 700;
    letter-spacing: 0.5px;
    transition: transform 0.15s;
}

.profile-avatar:hover {
    transform: scale(1.1);
}

.trainer-img-btn {
    border: none;
    background: none;
    padding: 0;
    overflow: hidden;
}

.trainer-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
}

.create-event-btn {
    padding: 8px 14px;
    background: #C00000;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 10px;
    font-weight: bold;
    font-family: "Arial Rounded MT", "Arial", sans-serif;
    cursor: pointer;
    transition: background 0.15s;
}

.create-event-btn:hover {
    background: #A00000;
}
</style>

<style scoped></style>
