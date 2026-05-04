import { defineStore } from 'pinia'
import { orte } from '../data.js'

export const useOrteStore = defineStore('orte', {
  state: () => ({
    list: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchAll() {
      if (this.list.length) return
      this.list = orte
    },
  },
})
