<script setup>
import { watch, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'
import SpecialBanner from './components/SpecialBanner.vue'
import MobileBottomNav from './components/MobileBottomNav.vue'
import SiteFooter from './components/SiteFooter.vue'
import ChatWidget from './components/ChatWidget.vue'
import { useBannerStore } from './stores/banner.js'

const bannerStore = useBannerStore()
const router = useRouter()
const API = import.meta.env.VITE_API_BASE_URL
const { isAuthenticated, getAccessTokenSilently } = useAuth0()

watch(isAuthenticated, async (authenticated) => {
  if (!authenticated) return
  try {
    const token = await getAccessTokenSilently()
    const res = await fetch(`${API}/api/nutzer/me`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
    if (res.status === 404) {
      router.push('/complete-profile')
    }
  } catch (e) {
    // ignore – user can retry later
  }
})

watchEffect(() => {
  document.body.style.marginTop = bannerStore.isVisible ? '100px' : '60px'
})
</script>

<template>
  <SpecialBanner />
  <router-view />
  <SiteFooter />
  <MobileBottomNav />
  <ChatWidget />
</template>

<style scoped></style>
