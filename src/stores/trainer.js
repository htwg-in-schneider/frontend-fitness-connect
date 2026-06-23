import { defineStore } from 'pinia'

const API = import.meta.env.VITE_API_BASE_URL

export const useTrainerStore = defineStore('trainer', {
  state: () => ({
    list: [],
    arten: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchAll() {
      await this.search({})
    },
    async fetchArten() {
      if (this.arten.length) return
      const res = await fetch(`${API}/api/trainer/arten`)
      this.arten = await res.json()
    },
    async search({ suche = '', art = '' } = {}) {
      const params = new URLSearchParams()
      if (suche) params.set('suche', suche)
      if (art) params.set('art', art)
      const qs = params.toString()
      const res = await fetch(`${API}/api/trainer${qs ? '?' + qs : ''}`)
      const data = await res.json()
      this.list = data.map(t => ({ ...t, profilbild_pfad: t.profilbildUrl }))
    },
  },
})
