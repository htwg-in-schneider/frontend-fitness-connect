import { defineStore } from 'pinia'

export const useOrteStore = defineStore('orte', {
  state: () => ({
    list: [],
  }),
  actions: {
    async fetchAll() {
      if (this.list.length) return
      const res = await fetch('http://localhost:8081/api/orte')
      const data = await res.json()
      this.list = data.map(o => ({ ...o, bild_pfad: o.bildUrl }))
    },
  },
})
