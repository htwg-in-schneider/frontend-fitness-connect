<script setup>
import logoLight from '../assets/logos/LogoFitnessConnectLight.png'
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
</template>

<style scoped>
.topnav {
    background: #1E293B;
    width: 100vw;
    padding: 12px 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    position: fixed;
    top: 0;
    z-index: 10;
    overflow-x: auto;
}

.topnav-logo {
    padding: 0 16px;
    flex-shrink: 0;
}

.topnav-logo-image {
    height: 36px;
    width: auto;
    display: block;
}

.topnav-divider {
    border: none;
    border-left: 2px solid rgba(255, 255, 255, 0.3);
    height: 28px;
    margin: 0 8px;
    align-self: center;
}

.topnav-nav {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    gap: 2px;
}

.topnav-nav .nav-item {
    margin: 0;
}

.topnav-nav .nav-link {
    display: block;
    padding: 8px 14px;
    color: #FFFFFF;
    font-size: 12px;
    font-family: "Arial", sans-serif;
    background: none;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.2s;
    white-space: nowrap;
}

.topnav-nav .nav-link:hover {
    background: rgba(255, 255, 255, 0.15);
}

.topnav-nav .nav-item.active .nav-link,
.topnav-nav .nav-link.active {
    background: #C00000;
    color: #FFFFFF;
    font-weight: bold;
}

@media (max-width: 820px) {
    .nav-label {
        display: none;
    }
}

@media (max-width: 768px) {
    .topnav-nav .nav-link {
        font-size: 11px;
        padding: 6px 10px;
    }
}
</style>
