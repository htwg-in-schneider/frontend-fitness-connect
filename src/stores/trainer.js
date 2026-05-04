import { defineStore } from 'pinia'
import { trainer } from '../data.js'

export const useTrainerStore = defineStore('trainer', {
  state: () => ({
    list: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchAll() {
      if (this.list.length) return
      this.list = trainer
    },
  },
})
