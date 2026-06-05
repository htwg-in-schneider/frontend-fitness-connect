import { defineStore } from 'pinia'

const API = import.meta.env.VITE_API_BASE_URL

let _getToken = null

export const useAdminStore = defineStore('admin', {
  state: () => ({
    isAdmin: false,
    checked: false,
    events: [],
    orte: [],
    nutzer: [],
    anmeldungen: [],
  }),
  actions: {
    setTokenGetter(fn) {
      _getToken = fn
    },
    async getToken() {
      if (!_getToken) throw new Error('Token getter not set')
      return await _getToken()
    },
    async checkAdmin() {
      if (this.checked) return this.isAdmin
      try {
        const token = await this.getToken()
        const res = await fetch(`${API}/api/admin/check`, {
          headers: { 'Authorization': `Bearer ${token}` },
        })
        this.isAdmin = await res.json()
      } catch {
        this.isAdmin = false
      }
      this.checked = true
      return this.isAdmin
    },
    async fetchEvents() {
      const token = await this.getToken()
      const res = await fetch(`${API}/api/admin/events`, {
        headers: { 'Authorization': `Bearer ${token}` },
      })
      if (res.ok) this.events = await res.json()
    },
    async createEvent(data) {
      const token = await this.getToken()
      const res = await fetch(`${API}/api/admin/events`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) { const msg = await res.text(); throw new Error(msg || 'Fehler') }
      await this.fetchEvents()
    },
    async updateEvent(id, data) {
      const token = await this.getToken()
      const res = await fetch(`${API}/api/admin/events/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) { const msg = await res.text(); throw new Error(msg || 'Fehler') }
      await this.fetchEvents()
    },
    async deleteEvent(id) {
      const token = await this.getToken()
      const res = await fetch(`${API}/api/admin/events/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Fehler beim Löschen')
      await this.fetchEvents()
    },
    async fetchOrte() {
      const token = await this.getToken()
      const res = await fetch(`${API}/api/admin/orte`, {
        headers: { 'Authorization': `Bearer ${token}` },
      })
      if (res.ok) this.orte = await res.json()
    },
    async createOrt(data) {
      const token = await this.getToken()
      const res = await fetch(`${API}/api/admin/orte`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) { const msg = await res.text(); throw new Error(msg || 'Fehler') }
      await this.fetchOrte()
    },
    async updateOrt(id, data) {
      const token = await this.getToken()
      const res = await fetch(`${API}/api/admin/orte/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) { const msg = await res.text(); throw new Error(msg || 'Fehler') }
      await this.fetchOrte()
    },
    async deleteOrt(id) {
      const token = await this.getToken()
      const res = await fetch(`${API}/api/admin/orte/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Fehler beim Löschen')
      await this.fetchOrte()
    },
    async fetchNutzer() {
      const token = await this.getToken()
      const res = await fetch(`${API}/api/admin/nutzer`, {
        headers: { 'Authorization': `Bearer ${token}` },
      })
      if (res.ok) this.nutzer = await res.json()
    },
    async updateNutzer(id, data) {
      const token = await this.getToken()
      const res = await fetch(`${API}/api/admin/nutzer/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) { const msg = await res.text(); throw new Error(msg || 'Fehler') }
      await this.fetchNutzer()
    },
    async deleteNutzer(id) {
      const token = await this.getToken()
      const res = await fetch(`${API}/api/admin/nutzer/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Fehler beim Löschen')
      await this.fetchNutzer()
    },
    async fetchAnmeldungen() {
      const token = await this.getToken()
      const res = await fetch(`${API}/api/admin/anmeldungen`, {
        headers: { 'Authorization': `Bearer ${token}` },
      })
      if (res.ok) this.anmeldungen = await res.json()
    },
    async createAnmeldung(data) {
      const token = await this.getToken()
      const res = await fetch(`${API}/api/admin/anmeldungen`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) { const msg = await res.text(); throw new Error(msg || 'Fehler') }
      await this.fetchAnmeldungen()
    },
    async deleteAnmeldung(id) {
      const token = await this.getToken()
      const res = await fetch(`${API}/api/admin/anmeldungen/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Fehler beim Löschen')
      await this.fetchAnmeldungen()
    },
  },
})
