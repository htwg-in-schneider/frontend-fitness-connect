import { defineStore } from 'pinia'

export const useOrteStore = defineStore('orte', {
  state: () => ({
    list: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchAll() {
      if (this.list.length) return
      this.loading = true
      this.error = null
      try {
        const res = await fetch('https://dummyjson.com/recipes?limit=6')
        if (!res.ok) throw new Error('Orte konnten nicht geladen werden')
        const { recipes } = await res.json()
        this.list = recipes.map(r => ({
          id: r.id,
          name: r.name,
          art: r.cuisine,
          bild_pfad: r.image,
          adresse: `${Array.isArray(r.mealType) ? r.mealType.join(', ') : 'Sport'} · ${r.difficulty}`,
        }))
      } catch (e) {
        this.error = e.message
      } finally {
        this.loading = false
      }
    },
  },
})
