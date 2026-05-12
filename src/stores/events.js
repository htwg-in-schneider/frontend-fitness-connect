import { defineStore } from 'pinia'

function mapEvent(raw) {
  return {
    id: raw.id,
    typ: raw.typ,
    name: raw.name,
    sportart: raw.sportart,
    date: new Date(raw.datum),
    anzahlPlaetze: raw.anzahlPlaetze,
    belegtePlaetze: raw.belegtePlaetze,
    freiePlaetze: raw.freiePlaetze,
    emoji: raw.emoji,
    ersteller: raw.ersteller,
    preis: raw.preis ?? null,
    trainerName: raw.trainerName ?? null,
    ort: raw.ort ? { ...raw.ort, bild_pfad: raw.ort.bildUrl } : null,
  }
}

export const useEventsStore = defineStore('events', {
  state: () => ({
    list: [],
  }),
  actions: {
    async fetchAll() {
      if (this.list.length) return
      await this.search('')
    },
    async search(query) {
      const base = 'http://localhost:8081/api/events'
      const url = query ? `${base}?suche=${encodeURIComponent(query)}` : base
      const res = await fetch(url)
      const data = await res.json()
      console.log('Fetched events:', data)
      this.list = data.map(mapEvent)
    },
  },
})
