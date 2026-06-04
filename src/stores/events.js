import { defineStore } from 'pinia'

const API = import.meta.env.VITE_API_BASE_URL

function mapEvent(raw) {
  return {
    id: raw.id,
    typ: raw.typ,
    name: raw.name,
    sportart: raw.sportart,
    date: new Date(raw.zeit),
    anzahlPlaetze: raw.anzahlPlaetze,
    anzahlAnmeldungen: raw.anzahlAnmeldungen,
    emoji: raw.emoji,
    ersteller: raw.ersteller,
    preis: raw.preis ?? null,
    ort: raw.ort ? { ...raw.ort, bild_pfad: raw.ort.bildUrl } : null,
  }
}

export const useEventsStore = defineStore('events', {
  state: () => ({
    list: [],
    sportarten: [],
  }),
  actions: {
    async fetchAll() {
      if (this.list.length) return
      await this.search({})
    },
    async fetchSportarten() {
      if (this.sportarten.length) return
      const res = await fetch(`${API}/api/events/sportarten`)
      this.sportarten = await res.json()
    },
    async search({ suche = '', sportart = '' } = {}) {
      const params = new URLSearchParams()
      if (suche) params.set('suche', suche)
      if (sportart) params.set('sportart', sportart)
      const qs = params.toString()
      const res = await fetch(`${API}/api/events${qs ? '?' + qs : ''}`)
      const data = await res.json()
      this.list = data.map(mapEvent)
    },
  },
})
