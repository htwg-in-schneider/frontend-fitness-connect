import { defineStore } from 'pinia'

const SPORT_EMOJIS = {
  history: '🏛️', american: '🏈', crime: '🥊', french: '🤸', fiction: '🎭',
  english: '🏉', magical: '✨', mystery: '🎯', love: '🧘', tech: '💪',
  classic: '⚽', fantasy: '🏊', horror: '🤼', default: '📅',
}

function emojiFor(tags) {
  for (const tag of tags) {
    if (SPORT_EMOJIS[tag]) return SPORT_EMOJIS[tag]
  }
  return SPORT_EMOJIS.default
}

export const useEventsStore = defineStore('events', {
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
        const res = await fetch('https://dummyjson.com/posts?limit=6')
        if (!res.ok) throw new Error('Events konnten nicht geladen werden')
        const { posts } = await res.json()
        this.list = posts.map(p => {
          const anzahlPlaetze = (p.views % 16) + 5
          const belegtePlaetze = p.reactions.likes % anzahlPlaetze
          const date = new Date('2026-05-10')
          date.setDate(date.getDate() + p.id)
          return {
            id: p.id,
            name: p.title.slice(0, 40),
            sportart: p.tags[0] ? p.tags[0].charAt(0).toUpperCase() + p.tags[0].slice(1) : 'Sport',
            date,
            anzahlPlaetze,
            belegtePlaetze,
            freiePlaetze: anzahlPlaetze - belegtePlaetze,
            ortName: p.tags[1] ? p.tags[1].charAt(0).toUpperCase() + p.tags[1].slice(1) + ' Arena' : 'Sportzentrum',
            emoji: emojiFor(p.tags),
            preis: p.id % 3 === 0 ? p.reactions.likes % 30 + 5 : null,
          }
        })
      } catch (e) {
        this.error = e.message
      } finally {
        this.loading = false
      }
    },
  },
})
