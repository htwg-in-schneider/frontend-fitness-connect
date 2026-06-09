<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'
import { useAdminStore } from '../stores/admin.js'
import { LayoutDashboard, Calendar, MapPin, Star, User, Shield } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const { isAuthenticated, getAccessTokenSilently } = useAuth0()
const adminStore = useAdminStore()

const showAdmin = ref(false)

watch(isAuthenticated, async (auth) => {
  if (auth) {
    adminStore.setTokenGetter(getAccessTokenSilently)
    showAdmin.value = await adminStore.checkAdmin()
  }
}, { immediate: true })

const iconMap = { LayoutDashboard, Calendar, MapPin, Star, User, Shield }
</script>

<template>
  <nav class="mobile-bottom-nav">
    <button class="mobile-nav-item" :class="{ active: route.path === '/' }" @click="router.push('/')">
      <component :is="iconMap.LayoutDashboard" :size="22" />
      <span class="mobile-nav-label">Dashboard</span>
    </button>
    <button v-if="isAuthenticated" class="mobile-nav-item" :class="{ active: route.path === '/events' }" @click="router.push('/events')">
      <component :is="iconMap.Calendar" :size="22" />
      <span class="mobile-nav-label">Events</span>
    </button>
    <button v-if="isAuthenticated" class="mobile-nav-item" :class="{ active: route.path === '/orte' }" @click="router.push('/orte')">
      <component :is="iconMap.MapPin" :size="22" />
      <span class="mobile-nav-label">Sportanlagen</span>
    </button>
    <button v-if="isAuthenticated" class="mobile-nav-item" :class="{ active: route.path === '/meine-events' }" @click="router.push('/meine-events')">
      <component :is="iconMap.Star" :size="22" />
      <span class="mobile-nav-label">Meins</span>
    </button>
    <button v-if="isAuthenticated" class="mobile-nav-item" :class="{ active: route.path === '/profil' }" @click="router.push('/profil')">
      <component :is="iconMap.User" :size="22" />
      <span class="mobile-nav-label">Profil</span>
    </button>
    <button v-if="showAdmin" class="mobile-nav-item" :class="{ active: route.path === '/admin' }" @click="router.push('/admin')">
      <component :is="iconMap.Shield" :size="22" />
      <span class="mobile-nav-label">Admin</span>
    </button>
  </nav>
</template>

<style scoped>
.mobile-bottom-nav {
  display: none;
}

@media (max-width: 768px) {
  .mobile-bottom-nav {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #1E293B;
    z-index: 200;
    justify-content: space-around;
    align-items: center;
    padding: 8px 0;
    padding-bottom: calc(8px + env(safe-area-inset-bottom));
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.3);
  }
}

.mobile-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 8px;
  transition: color 0.2s, background 0.2s;
}

.mobile-nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.mobile-nav-item.active {
  color: #fff;
  background: #C00000;
}

.mobile-nav-label {
  font-size: 10px;
  font-family: "Arial", sans-serif;
  white-space: nowrap;
}
</style>
