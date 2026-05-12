import { defineStore } from 'pinia'

export const useOrteStore = defineStore('orte', {
  state: () => ({
    list: [],
  }),
  actions: {
    async fetchAll() {
      if (this.list.length) return
      await this.search('')
    },
    async search(query) {
      const base = 'http://localhost:8081/api/orte'
      const url = query ? `${base}?suche=${encodeURIComponent(query)}` : base
      const res = await fetch(url)
      const data = await res.json()
      console.log('Fetched Orte:', data)
      this.list = data.map(o => ({ ...o, bild_pfad: o.bildUrl }))
    },
  },
})
