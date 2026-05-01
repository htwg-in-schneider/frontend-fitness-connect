<script setup>
import logoLight from './assets/logos/LogoFitnessConnectLight.png'
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
                <div class="event-card">
                    <div class="event-card-header">
                        <span class="event-emoji">⚽</span>
                        <span class="event-tag tag-free">Kostenlos</span>
                    </div>
                    <div class="event-card-body">
                        <h3 class="event-title">Fußball am See</h3>
                        <p class="event-detail">📍 Sportanlage Konstanz</p>
                        <p class="event-detail">📅 Sa, 05.04. · 10:00</p>
                        <p class="event-spots">8/12 Plätze frei</p>
                        <button class="btn-default">Teilnehmen</button>
                    </div>
                </div>
                <div class="event-card">
                    <div class="event-card-header">
                        <span class="event-emoji">🧘</span>
                        <span class="event-tag tag-price">15 €</span>
                    </div>
                    <div class="event-card-body">
                        <h3 class="event-title">Yoga im Studio</h3>
                        <p class="event-detail">📍 Club-Aktiv Konstanz</p>
                        <p class="event-detail">📅 So, 06.04. · 09:00</p>
                        <p class="event-spots">11/12 Plätze frei</p>
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
                <div class="ort-card">
                    <img src="/orteImages/happy-fit.jpg" alt="Happy-Fit Konstanz" class="ort-image">
                    <div class="ort-card-body">
                        <h3 class="ort-title">Happy-Fit Konstanz</h3>
                        <p class="ort-address">📍 Line-Eid-Straße 6, 78467 Konstanz</p>
                        <button class="btn-default">Ansehen</button>
                    </div>
                </div>
                <div class="ort-card">
                    <img src="/orteImages/calisthenics.png" alt="Calisthenics-Park" class="ort-image">
                    <div class="ort-card-body">
                        <h3 class="ort-title">Calisthenics-Park</h3>
                        <p class="ort-address">📍 Gemeinschaftsschule Konstanz</p>
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
                <div class="trainer-card">
                    <img src="/TrainerImages/IlyasK.png" alt="Ilyas K." class="trainer-image">
                    <div class="trainer-card-body">
                        <div>
                            <h3 class="trainer-name">Ilyas K.</h3>
                            <p class="trainer-detail">Fitness · ⭐ 4.8</p>
                        </div>
                        <div>
                            <button class="btn-default">Profil ansehen</button>
                        </div>
                    </div>
                </div>
                <div class="trainer-card">
                    <img src="/TrainerImages/LisaM.png" alt="Lisa M." class="trainer-image">
                    <div class="trainer-card-body">
                        <div>
                            <h3 class="trainer-name">Lisa M.</h3>
                            <p class="trainer-detail">Yoga · ⭐ 4.9</p>
                        </div>
                        <div>
                            <button class="btn-default">Profil ansehen</button>
                        </div>
                    </div>
                </div>
                <div class="trainer-card">
                    <img src="/TrainerImages/MaxS.png" alt="Max S." class="trainer-image">
                    <div class="trainer-card-body">
                        <div class="trainer-name-container">
                            <h3 class="trainer-name">Max S.</h3>
                            <p class="trainer-detail">Fußball · ⭐ 4.5</p>
                        </div>
                        <div class="trainer-button">
                            <button class="btn-default">Profil ansehen</button>
                        </div>
                    </div>
                </div>
                <div class="trainer-card">
                    <img src="/TrainerImages/AlidaW.png" alt="Alida W." class="trainer-image">
                    <div class="trainer-card-body">
                        <div>
                            <h3 class="trainer-name">Alida W.</h3>
                            <p class="trainer-detail">Calisthenics · ⭐ 1.2</p>
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
