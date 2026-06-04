import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import EventDetail from '../views/EventDetail.vue'
import EventsView from '../views/EventsView.vue'
import TrainerDetail from '../views/TrainerDetail.vue'
import TrainerView from '../views/TrainerView.vue'
import OrtDetail from '../views/OrtDetail.vue'
import SportanlagenView from '../views/SportanlagenView.vue'
import CompleteProfile from '../views/CompleteProfile.vue'
import MeinProfil from '../views/MeinProfil.vue'
import BecomeTrainer from '../views/BecomeTrainer.vue'
import CreateEvent from '../views/CreateEvent.vue'
import MeineEvents from '../views/MeineEvents.vue'
import EditEvent from '../views/EditEvent.vue'
import ImpressumView from '../views/ImpressumView.vue'
import DatenschutzView from '../views/DatenschutzView.vue'

const routes = [
  { path: '/', component: Dashboard },
  { path: '/events', component: EventsView },
  { path: '/trainer', component: TrainerView },
  { path: '/orte', component: SportanlagenView },
  { path: '/event/:id', component: EventDetail },
  { path: '/trainer/:id', component: TrainerDetail },
  { path: '/ort/:id', component: OrtDetail },
  { path: '/complete-profile', component: CompleteProfile },
  { path: '/become-trainer', component: BecomeTrainer },
  { path: '/event-erstellen', component: CreateEvent },
  { path: '/meine-events', component: MeineEvents },
  { path: '/event-bearbeiten/:id', component: EditEvent },
  { path: '/profil', component: MeinProfil },
  { path: '/impressum', component: ImpressumView },
  { path: '/datenschutz', component: DatenschutzView },
]

// import.meta.env.BASE_URL picks up the `base` from vite.config.js
// which is set to the repo sub-path for GitHub Pages deployments.
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
