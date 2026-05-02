import { defineStore } from 'pinia'

export const useTrainerStore = defineStore('trainer', {
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
        const res = await fetch('https://dummyjson.com/users?limit=8')
        if (!res.ok) throw new Error('Trainer konnten nicht geladen werden')
        const { users } = await res.json()
        this.list = users.map(u => ({
          id: u.id,
          kontoinhaber: `${u.firstName} ${u.lastName}`,
          trainerart: u.company?.department ?? 'Fitness',
          telefonnummer: u.phone,
          profilbild_pfad: u.image,
          bewertung: parseFloat((3.5 + (u.id % 15) / 10).toFixed(1)),
          zitat: u.company?.title ? `${u.company.title} @ ${u.company.name}` : 'Fitness is life.',
          iban: u.bank?.iban ?? '—',
          bic: u.bank?.bic ?? u.bank?.cardType ?? '—',
        }))
      } catch (e) {
        this.error = e.message
      } finally {
        this.loading = false
      }
    },
  },
})
