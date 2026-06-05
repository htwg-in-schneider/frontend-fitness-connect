<script setup>
import { useRouter } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'
import Button from './Button.vue'
import NavigationLink from './NavigationLink.vue'
import { MapPin } from 'lucide-vue-next'

const router = useRouter()
const { isAuthenticated } = useAuth0()

defineProps({
    orte: {
        type: Array,
        required: true,
    },
})

function handleOrtClick(ortId) {
  if (isAuthenticated.value) {
    router.push('/ort/' + ortId)
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
</script>

<template>
    <section class="page-section section-orte">
        <div class="section-header">
            <h2 class="section-title">Orte</h2>
            <NavigationLink v-if="isAuthenticated" @click="router.push('/orte')">Alle anzeigen →</NavigationLink>
        </div>
        <div class="orte-row">
            <div class="ort-card" v-for="ort in orte" :key="ort.id">
                <img :src="ort.bild_pfad" :alt="ort.name" class="ort-image">
                <div class="ort-card-body">
                    <h3 class="ort-title">{{ ort.name }}</h3>
                    <p class="ort-address"><MapPin :size="13" /> {{ ort.adresse }}</p>
                    <Button @click="handleOrtClick(ort.id)">Ansehen</Button>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.section-orte {
    background: #FFFFFF;
    scroll-margin-top: 60px;
}

.orte-row {
    display: flex;
    gap: 16px;
}

.ort-card {
    flex: 1;
    background: #FFFFFF;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.ort-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.14);
}

.ort-image {
    width: 100%;
    height: 160px;
    object-fit: cover;
    display: block;
}

.ort-card-body {
    padding: 12px 14px 14px;
}

.ort-title {
    font-size: 14px;
    font-weight: bold;
    font-family: "Arial Rounded MT Bold", "Arial", sans-serif;
    color: #1E293B;
    margin-bottom: 4px;
}

.ort-address {
    font-size: 12px;
    color: #64748B;
    font-family: "Arial", sans-serif;
    margin-bottom: 10px;
}

@media (max-width: 768px) {
    .orte-row {
        flex-direction: column;
    }
}
</style>
