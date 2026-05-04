import { defineStore } from 'pinia'
import { events } from '../data.js'

export const useEventsStore = defineStore('events', {
  state: () => ({
    list: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchAll() {
      if (this.list.length) return
      this.list = events
    },
  },
})
