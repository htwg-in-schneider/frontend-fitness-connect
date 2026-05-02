<script setup>
import { events, orte, trainer } from '../data.js'
import NavBar from '../components/NavBar.vue'
import HeroSection from '../components/HeroSection.vue'
import EventsSection from '../components/EventsSection.vue'
import OrteSection from '../components/OrteSection.vue'
import TrainerSection from '../components/TrainerSection.vue'
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
        <EventsSection :events="events" />
        <OrteSection :orte="orte" />
        <TrainerSection :trainer="trainer" />
    </main>
</template>

<style scoped></style>
