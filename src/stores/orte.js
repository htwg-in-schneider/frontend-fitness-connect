import { defineStore } from 'pinia'

const API = import.meta.env.VITE_API_BASE_URL

function toFirstUppercase(value) {
  if (!value || typeof value !== 'string') return value
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
}

export const useOrteStore = defineStore('orte', {
  state: () => ({
    list: [],
    arten: [],
  }),
  actions: {
    async fetchAll() {
      if (this.list.length) return
      await this.search({})
    },
    async fetchArten() {
      if (this.arten.length) return
      const res = await fetch(`${API}/api/orte/arten`)
      this.arten = await res.json()
    },
    async search({ suche = '', art = '' } = {}) {
      const params = new URLSearchParams()
      if (suche) params.set('suche', suche)
      if (art) params.set('art', art)
      const qs = params.toString()
      const res = await fetch(`${API}/api/orte${qs ? '?' + qs : ''}`)
      const data = await res.json()
      this.list = data.map(o => ({ ...o, bild_pfad: o.bildUrl, art: toFirstUppercase(o.art) }))
    },
  },
})
