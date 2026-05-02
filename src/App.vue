<script setup>
import { watchEffect } from 'vue'
import SpecialBanner from './components/SpecialBanner.vue'
import { useBannerStore } from './stores/banner.js'

const bannerStore = useBannerStore()

watchEffect(() => {
  document.body.style.marginTop = bannerStore.isVisible ? '100px' : '60px'
})
</script>

<template>
  <SpecialBanner />
  <router-view />
</template>

<style scoped></style>
