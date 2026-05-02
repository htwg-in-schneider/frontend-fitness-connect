// =====================
// Klassen
// =====================

export class Trainer {
  static #nextId = 1

  constructor({ trainerart, kontoinhaber, iban, bic, telefonnummer, bewertung, zitat, profilbild_pfad }) {
    this.id = Trainer.#nextId++
    this.trainerart = trainerart
    this.kontoinhaber = kontoinhaber
    this.iban = iban
    this.bic = bic
    this.telefonnummer = telefonnummer
    this.bewertung = bewertung
    this.zitat = zitat
    this.profilbild_pfad = profilbild_pfad
  }
}

export class Ort {
  static #nextId = 1

  constructor({ name, adresse, art, bild_pfad }) {
    this.id = Ort.#nextId++
    this.name = name
    this.adresse = adresse
    this.art = art
    this.bild_pfad = bild_pfad
  }
}

export class Event {
  static #nextId = 1

  constructor({ name, sportart, date, anzahlPlaetze, belegtePlaetze = 0, ortName = '', emoji = '📅' }) {
    this.id = Event.#nextId++
    this.name = name
    this.sportart = sportart
    this.date = new Date(date)
    this.anzahlPlaetze = anzahlPlaetze
    this.belegtePlaetze = belegtePlaetze
    this.ortName = ortName
    this.emoji = emoji
  }

  get freiePlaetze() {
    return this.anzahlPlaetze - this.belegtePlaetze
  }
}

export class Kurs extends Event {
  constructor({ trainer, preis, ...rest }) {
    super(rest)
    this.trainer = trainer
    this.preis = preis
  }
}

// =====================
// Trainer-Daten
// =====================

export const ilyasK = new Trainer({
  trainerart: 'Fitness',
  kontoinhaber: 'Ilyas Kaya',
  iban: 'DE12500105170648489890',
  bic: 'BELADEBEXXX',
  telefonnummer: '+49 151 23456789',
  bewertung: 4.8,
  zitat: 'Dein Körper kann alles – überzeuge zuerst deinen Kopf.',
  profilbild_pfad: '/TrainerImages/IlyasK.png',
})

export const lisaM = new Trainer({
  trainerart: 'Yoga',
  kontoinhaber: 'Lisa Müller',
  iban: 'DE75200400600310028600',
  bic: 'COBADEFFXXX',
  telefonnummer: '+49 152 34567890',
  bewertung: 4.9,
  zitat: 'Yoga verbindet Körper, Geist und Seele.',
  profilbild_pfad: '/TrainerImages/LisaM.png',
})

export const maxS = new Trainer({
  trainerart: 'Fußball',
  kontoinhaber: 'Max Schneider',
  iban: 'DE91100000000123456789',
  bic: 'SSKMDEMMXXX',
  telefonnummer: '+49 176 45678901',
  bewertung: 4.5,
  zitat: 'Teamwork macht den Traum wahr.',
  profilbild_pfad: '/TrainerImages/MaxS.png',
})

export const alidaW = new Trainer({
  trainerart: 'Calisthenics',
  kontoinhaber: 'Alida Wolf',
  iban: 'DE56200700240012345600',
  bic: 'DEUTDEHHXXX',
  telefonnummer: '+49 157 56789012',
  bewertung: 1.2,
  zitat: 'Bodyweight is the best weight.',
  profilbild_pfad: '/TrainerImages/AlidaW.png',
})

export const trainer = [ilyasK, lisaM, maxS, alidaW]

// =====================
// Ort-Daten
// =====================

export const happyFit = new Ort({
  name: 'Happy-Fit Konstanz',
  adresse: 'Line-Eid-Straße 6, 78467 Konstanz',
  art: 'Fitnessstudio',
  bild_pfad: '/orteImages/happy-fit.jpg',
})

export const calisthenicsPark = new Ort({
  name: 'Calisthenics-Park',
  adresse: 'Gemeinschaftsschule Konstanz',
  art: 'Outdoor',
  bild_pfad: '/orteImages/calisthenics.png',
})

export const orte = [happyFit, calisthenicsPark]

// =====================
// Event- & Kurs-Daten
// =====================

export const fussballAmSee = new Event({
  name: 'Fußball am See',
  sportart: 'Fußball',
  date: '2026-04-05T10:00:00',
  anzahlPlaetze: 12,
  belegtePlaetze: 4,
  ortName: 'Sportanlage Konstanz',
  emoji: '⚽',
})

// Kurs: kostenpflichtiges Event mit Trainer
// Trainer lisaM passt zur Sportart Yoga – wird noch nicht auf der Seite angezeigt
export const yogaImStudio = new Kurs({
  name: 'Yoga im Studio',
  sportart: 'Yoga',
  date: '2026-04-06T09:00:00',
  anzahlPlaetze: 12,
  belegtePlaetze: 1,
  ortName: 'Club-Aktiv Konstanz',
  emoji: '🧘',
  trainer: lisaM,
  preis: 15.0,
})

export const events = [fussballAmSee, yogaImStudio]

// =====================
// Hilfsfunktionen
// =====================

/**
 * Gibt den Anzeigenamen eines Trainers zurück (z. B. "Lisa M.").
 */
export function trainerDisplayName(t) {
  const parts = t.kontoinhaber.trim().split(' ')
  return parts.length > 1 ? `${parts[0]} ${parts[1][0]}.` : parts[0]
}

/**
 * Formatiert ein Date-Objekt als "Sa, 05.04. · 10:00".
 */
export function formatEventDate(date) {
  const days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']
  const day = days[date.getDay()]
  const dd = String(date.getDate()).padStart(2, '0')
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const hh = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  return `${day}, ${dd}.${mm}. · ${hh}:${min}`
}
