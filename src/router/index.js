import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import EventDetail from '../views/EventDetail.vue'
import EventsView from '../views/EventsView.vue'
import TrainerDetail from '../views/TrainerDetail.vue'
import OrtDetail from '../views/OrtDetail.vue'
import SportanlagenView from '../views/SportanlagenView.vue'
import CompleteProfile from '../views/CompleteProfile.vue'

const routes = [
  { path: '/', component: Dashboard },
  { path: '/events', component: EventsView },
  { path: '/orte', component: SportanlagenView },
  { path: '/event/:id', component: EventDetail },
  { path: '/trainer/:id', component: TrainerDetail },
  { path: '/ort/:id', component: OrtDetail },
  { path: '/complete-profile', component: CompleteProfile },
]

// import.meta.env.BASE_URL picks up the `base` from vite.config.js
// which is set to the repo sub-path for GitHub Pages deployments.
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
