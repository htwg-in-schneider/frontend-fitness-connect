<script setup>
import logoLight from '../assets/logos/LogoFitnessConnectLight.png'
import NavButton from './NavButton.vue'
</script>

<template>
    <nav class="topnav">
        <div class="topnav-logo">
            <img :src="logoLight" alt="Fitness Connect Logo" class="topnav-logo-image">
        </div>
        <hr class="topnav-divider">
        <ul class="topnav-nav">
            <li><NavButton emoji="📊" label="Dashboard" :active="true" /></li>
            <li><NavButton emoji="📅" label="Events / Kurse" /></li>
            <li><NavButton emoji="🏟️" label="Sportanlagen" /></li>
            <li><NavButton emoji="👥" label="Trainer" /></li>
            <li><NavButton emoji="👤" label="Mein Profil" /></li>
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
</style>
