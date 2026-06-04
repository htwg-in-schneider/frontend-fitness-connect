<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'
import logoLight from '../assets/logos/LogoFitnessConnectLight.png'
import NavButton from './NavButton.vue'
import { useBannerStore } from '../stores/banner.js'

const bannerStore = useBannerStore()
const router = useRouter()
const route = useRoute()
const { isAuthenticated, loginWithRedirect, logout } = useAuth0()

function handleLogout() {
  logout({ logoutParams: { returnTo: window.location.origin } })
}
</script>

<template>
    <nav class="topnav">
        <div class="topnav-logo">
            <img :src="logoLight" alt="Fitness Connect Logo" class="topnav-logo-image">
        </div>
        <hr class="topnav-divider">
        <ul class="topnav-nav">
            <li @click="router.push('/')"><NavButton emoji="📊" label="Dashboard" :active="route.path === '/'"/></li>
            <li @click="router.push('/events')"><NavButton emoji="📅" label="Events / Kurse" :active="route.path === '/events'" /></li>
            <li @click="router.push('/orte')"><NavButton emoji="🏟️" label="Sportanlagen" :active="route.path === '/orte'" /></li>
            <li><NavButton emoji="👥" label="Trainer" /></li>
            <li v-if="isAuthenticated" @click="router.push('/profil')"><NavButton emoji="👤" label="Mein Profil" :active="route.path === '/profil'" /></li>
        </ul>
        <div class="topnav-auth">
            <template v-if="!isAuthenticated">
                <button class="auth-btn" @click="loginWithRedirect()">Anmelden</button>
                <button class="auth-btn auth-btn--primary" @click="loginWithRedirect({ authorizationParams: { screen_hint: 'signup' } })">Registrieren</button>
            </template>
            <template v-else>
                <button class="auth-btn" @click="handleLogout">Abmelden</button>
            </template>
        </div>
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
    top: v-bind('bannerStore.isVisible ? "40px" : "0px"');
    z-index: 100;
    transition: top 0.2s ease;
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
    flex: 1;
}

.topnav-auth {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 16px;
    flex-shrink: 0;
}

.auth-btn {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.4);
    color: #fff;
    border-radius: 6px;
    padding: 6px 14px;
    font-size: 13px;
    cursor: pointer;
    white-space: nowrap;
}

.auth-btn:hover {
    background: rgba(255, 255, 255, 0.1);
}

.auth-btn--primary {
    background: #3B82F6;
    border-color: #3B82F6;
}

.auth-btn--primary:hover {
    background: #2563EB;
    border-color: #2563EB;
}
</style>
