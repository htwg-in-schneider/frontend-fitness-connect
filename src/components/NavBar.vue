<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'
import logoLight from '../assets/logos/LogoFitnessConnectLight.png'
import NavButton from './NavButton.vue'
import { useBannerStore } from '../stores/banner.js'
import { useAdminStore } from '../stores/admin.js'

const bannerStore = useBannerStore()
const adminStore = useAdminStore()
const router = useRouter()
const route = useRoute()
const { isAuthenticated, loginWithRedirect, logout, getAccessTokenSilently } = useAuth0()

const showAdmin = ref(false)

watch(isAuthenticated, async (auth) => {
  if (auth) {
    adminStore.setTokenGetter(getAccessTokenSilently)
    showAdmin.value = await adminStore.checkAdmin()
  }
}, { immediate: true })

function handleLogout() {
  logout({ logoutParams: { returnTo: window.location.origin + import.meta.env.BASE_URL } })
}
</script>

<template>
    <nav class="topnav">
        <div class="topnav-logo">
            <img :src="logoLight" alt="Fitness Connect Logo" class="topnav-logo-image">
        </div>
        <hr class="topnav-divider">
        <ul class="topnav-nav">
            <li @click="router.push('/')"><NavButton icon="LayoutDashboard" label="Dashboard" :active="route.path === '/'"/></li>
            <li v-if="isAuthenticated" @click="router.push('/events')"><NavButton icon="Calendar" label="Events / Kurse" :active="route.path === '/events'" /></li>
            <li v-if="isAuthenticated" @click="router.push('/orte')"><NavButton icon="MapPin" label="Sportanlagen" :active="route.path === '/orte'" /></li>
            <li v-if="isAuthenticated" @click="router.push('/trainer')"><NavButton icon="Users" label="Trainer" :active="route.path === '/trainer'" /></li>
            <li v-if="isAuthenticated" @click="router.push('/profil')"><NavButton icon="User" label="Mein Profil" :active="route.path === '/profil'" /></li>
            <li v-if="showAdmin" @click="router.push('/admin')"><NavButton icon="Shield" label="Admin" :active="route.path === '/admin'" /></li>
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

@media (max-width: 768px) {
    .topnav {
        display: none;
    }
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
    background: #C00000;
    border-color: #C00000;
}

.auth-btn--primary:hover {
    background: #A00000;
    border-color: #A00000;
}
</style>
