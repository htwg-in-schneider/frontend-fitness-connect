<script setup>
import { ref, onMounted } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { useTrainerStore } from '../stores/trainer.js'
import { useOrteStore } from '../stores/orte.js'
import { useEventsStore } from '../stores/events.js'
import NavBar from '../components/NavBar.vue'
import HeroSection from '../components/HeroSection.vue'
import EventsSection from '../components/EventsSection.vue'
import OrteSection from '../components/OrteSection.vue'
import TrainerSection from '../components/TrainerSection.vue'

const { loginWithRedirect } = useAuth0()
const email = ref('')

const trainerStore = useTrainerStore()
const orteStore = useOrteStore()
const eventsStore = useEventsStore()

onMounted(() => {
  trainerStore.fetchAll()
  orteStore.fetchAll()
  eventsStore.fetchAll()
})
</script>

<template>
    <NavBar />

    <main class="main-content">
        <header class="content-header">
            <div class="header-mid">
                <div class="welcome-container">
                    <h1 class="welcome-title">Willkommen! 👋</h1>
                    <p class="welcome-subtitle">Finde dein nächstes Training in Konstanz</p>
                </div>
            </div>
            <div class="header-right">
                <div class="search-bar">
                    <input type="text" placeholder="Nach Sportart suchen…">
                </div>
                <button class="profile-icon">👤</button>
            </div>
        </header>



        <HeroSection />
        <p v-if="eventsStore.error" class="fetch-error">⚠️ {{ eventsStore.error }}</p>
        <EventsSection v-else :events="eventsStore.list" />
        <p v-if="orteStore.error" class="fetch-error">⚠️ {{ orteStore.error }}</p>
        <OrteSection v-else :orte="orteStore.list" />
        <p v-if="trainerStore.error" class="fetch-error">⚠️ {{ trainerStore.error }}</p>
        <TrainerSection v-else :trainer="trainerStore.list" />
    </main>
</template>

<style scoped>
.fetch-error {
    padding: 12px 24px;
    color: #C00000;
    font-size: 13px;
}
</style>

<style scoped></style>
