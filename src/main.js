import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createAuth0 } from '@auth0/auth0-vue'
import App from './App.vue'
import router from './router/index.js'

const pinia = createPinia()

createApp(App)
  .use(pinia)
  .use(router)
  .use(createAuth0({
    domain: import.meta.env.VITE_AUTH0_DOMAIN,
    clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
    cacheLocation: 'localstorage',
    authorizationParams: {
      redirect_uri: window.location.origin + import.meta.env.BASE_URL,
      audience: import.meta.env.VITE_AUTH0_AUDIENCE,
    }
  }))
  .mount('#app')
