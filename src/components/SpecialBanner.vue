<script setup>
import { useRouter } from 'vue-router'
import { useBannerStore } from '../stores/banner.js'
import { fussballAmSee } from '../data.js'

const router = useRouter()
const bannerStore = useBannerStore()

function goToEvent() {
  router.push('/event/' + fussballAmSee.id)
}
</script>

<template>
  <div v-if="bannerStore.isVisible" class="special-banner" @click="goToEvent">
    <span class="banner-emoji">{{ fussballAmSee.emoji }}</span>
    <span class="banner-text">
      <strong>Event des Tages:</strong> {{ fussballAmSee.name }} — Jetzt anmelden!
    </span>
    <button class="banner-ok" @click.stop="bannerStore.hideBanner()">OK</button>
  </div>
</template>

<style scoped>
.special-banner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  background: linear-gradient(90deg, #C00000 0%, #E8400A 100%);
  color: #FFFFFF;
  font-family: "Arial Rounded MT", "Arial", sans-serif;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(192, 0, 0, 0.4);
  transition: opacity 0.2s ease;
}

.special-banner:hover {
  opacity: 0.92;
}

.banner-emoji {
  font-size: 18px;
  flex-shrink: 0;
}

.banner-text {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.banner-ok {
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.6);
  color: #FFFFFF;
  border-radius: 6px;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.15s ease;
}

.banner-ok:hover {
  background: rgba(255, 255, 255, 0.4);
}
</style>
