<script setup>
import { useRouter } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'
import Button from './Button.vue'
import NavigationLink from './NavigationLink.vue'

const router = useRouter()
const { isAuthenticated } = useAuth0()

defineProps({
    trainer: {
        type: Array,
        required: true,
    },
})

function handleTrainerClick(trainerId) {
  if (isAuthenticated.value) {
    router.push('/trainer/' + trainerId)
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
</script>

<template>
    <section class="page-section section-trainer">
        <div class="section-header">
            <h2 class="section-title">Trainer</h2>
            <NavigationLink v-if="isAuthenticated" to="/trainer">Alle anzeigen →</NavigationLink>
        </div>
        <div class="trainer-row">
            <div class="trainer-card" v-for="t in trainer" :key="t.id">
                <img :src="t.profilbild_pfad" :alt="t.name" class="trainer-image">
                <div class="trainer-card-body">
                    <div>
                        <h3 class="trainer-name">{{ t.name }}</h3>
                        <p class="trainer-detail">{{ t.trainerart }} · ⭐ {{ t.bewertung }}</p>
                    </div>
                    <div>
                        <Button @click="handleTrainerClick(t.id)">Profil ansehen</Button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.section-trainer {
    background: #F8FAFC;
    scroll-margin-top: 60px;
}

.trainer-row {
    display: flex;
    gap: 16px;
    overflow-x: auto;
    padding: 10px 10px 20px 10px;
}

.trainer-row .trainer-card {
    flex: 1;
    min-width: 200px;
    max-width: 450px;
}

.trainer-card {
    background: #FFFFFF;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    margin: 4px;
}

.trainer-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.14);
}

.trainer-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    display: block;
}

.trainer-card-body {
    padding: 12px 14px 14px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    flex: 1;
}

.trainer-card .btn-default {
    width: 90px;
}

.trainer-name {
    font-size: 14px;
    font-weight: bold;
    font-family: "Arial Rounded MT Bold", "Arial", sans-serif;
    color: #1E293B;
    margin-bottom: 4px;
}

.trainer-detail {
    font-size: 12px;
    color: #64748B;
    font-family: "Arial", sans-serif;
}
</style>
