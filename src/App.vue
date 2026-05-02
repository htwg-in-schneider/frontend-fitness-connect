<script setup>
import logoLight from './assets/logos/LogoFitnessConnectLight.png'
import { events, orte, trainer, formatEventDate, trainerDisplayName } from './data.js'
</script>

<template>
    <nav class="topnav">
        <div class="topnav-logo">
            <img :src="logoLight" alt="Fitness Connect Logo" class="topnav-logo-image">
        </div>
        <hr class="topnav-divider">
        <ul class="topnav-nav">
            <li class="nav-item active">
                <button class="nav-link active"><span class="nav-emoji">📊</span><span class="nav-label"> Dashboard</span></button>
            </li>
            <li class="nav-item">
                <button class="nav-link"><span class="nav-emoji">📅</span><span class="nav-label"> Events</span></button>
            </li>
            <li class="nav-item">
                <button class="nav-link"><span class="nav-emoji">🎓</span><span class="nav-label"> Kurse</span></button>
            </li>
            <li class="nav-item">
                <button class="nav-link"><span class="nav-emoji">🏟️</span><span class="nav-label"> Sportanlagen</span></button>
            </li>
            <li class="nav-item">
                <button class="nav-link"><span class="nav-emoji">👥</span><span class="nav-label"> Trainer</span></button>
            </li>
            <li class="nav-item">
                <button class="nav-link"><span class="nav-emoji">👤</span><span class="nav-label"> Mein Profil</span></button>
            </li>
            <li class="nav-item">
                <button class="nav-link"><span class="nav-emoji">⚙️</span><span class="nav-label"> Einstellungen</span></button>
            </li>
        </ul>
    </nav>

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

        <section class="page-section section-hero">
            <div class="hero-card">
                <div class="hero-text">
                    <h2 class="hero-title">Dein Sport. Deine Stadt.</h2>
                    <p class="hero-subtitle">FitnessConnect verbindet dich mit Events, Sportanlagen und Trainern in Konstanz – alles an einem Ort.</p>
                </div>
                <div class="hero-divider"></div>
                <div class="login-form">
                    <h3 class="login-title">Anmelden</h3>
                    <input class="login-input" type="text" placeholder="Benutzername">
                    <input class="login-input" type="password" placeholder="Passwort">
                    <button class="btn-action btn-action-primary">Anmelden</button>
                    <button class="btn-action btn-action-disabled">Registrieren</button>
                </div>
            </div>
        </section>

        <section class="page-section section-events">
            <div class="section-header">
                <h2 class="section-title">Events</h2>
                <button class="link-btn">Alle anzeigen →</button>
            </div>
            <div class="events-row">
                <div class="event-card" v-for="event in events" :key="event.name">
                    <div class="event-card-header">
                        <span class="event-emoji">{{ event.emoji }}</span>
                        <span class="event-tag" :class="event.preis ? 'tag-price' : 'tag-free'">
                            {{ event.preis ? event.preis.toFixed(0) + ' €' : 'Kostenlos' }}
                        </span>
                    </div>
                    <div class="event-card-body">
                        <h3 class="event-title">{{ event.name }}</h3>
                        <p class="event-detail">📍 {{ event.ortName }}</p>
                        <p class="event-detail">📅 {{ formatEventDate(event.date) }}</p>
                        <p class="event-spots">{{ event.freiePlaetze }}/{{ event.anzahlPlaetze }} Plätze frei</p>
                        <button class="btn-default">Teilnehmen</button>
                    </div>
                </div>
            </div>
        </section>

        <section class="page-section section-orte">
            <div class="section-header">
                <h2 class="section-title">Orte</h2>
                <button class="link-btn">Alle anzeigen →</button>
            </div>
            <div class="orte-row">
                <div class="ort-card" v-for="ort in orte" :key="ort.name">
                    <img :src="ort.bild_pfad" :alt="ort.name" class="ort-image">
                    <div class="ort-card-body">
                        <h3 class="ort-title">{{ ort.name }}</h3>
                        <p class="ort-address">📍 {{ ort.adresse }}</p>
                        <button class="btn-default">Ansehen</button>
                    </div>
                </div>
            </div>
        </section>

        <section class="page-section section-trainer">
            <div class="section-header">
                <h2 class="section-title">Trainer</h2>
                <button class="link-btn">Alle anzeigen →</button>
            </div>
            <div class="trainer-row">
                <div class="trainer-card" v-for="t in trainer" :key="t.kontoinhaber">
                    <img :src="t.profilbild_pfad" :alt="trainerDisplayName(t)" class="trainer-image">
                    <div class="trainer-card-body">
                        <div>
                            <h3 class="trainer-name">{{ trainerDisplayName(t) }}</h3>
                            <p class="trainer-detail">{{ t.trainerart }} · ⭐ {{ t.bewertung }}</p>
                        </div>
                        <div>
                            <button class="btn-default">Profil ansehen</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
</template>

<style scoped></style>
