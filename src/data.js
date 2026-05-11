// Prepends the Vite base URL so asset paths work both locally (/) and
// on GitHub Pages (/frontend-fitness-connect/).
const base = import.meta.env.BASE_URL.replace(/\/$/, '')
function assetUrl(path) {
  return base + path
}

// =====================
// Klassen
// =====================

export class Nutzer {
  constructor({ id, name, email }) {
    this.id = id
    this.name = name
    this.email = email
  }
}

export class Trainer {
  constructor({ id, trainerart, kontoinhaber, iban, bic, telefonnummer, bewertung, zitat, profilbild_pfad }) {
    this.id = id
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
  constructor({ id, name, adresse, art, bild_pfad }) {
    this.id = id
    this.name = name
    this.adresse = adresse
    this.art = art
    this.bild_pfad = bild_pfad
  }
}

export class Event {
  constructor({ id, name, sportart, date, anzahlPlaetze, belegtePlaetze, freiePlaetze, emoji, ort, ersteller, teilnehmer }) {
    this.id = id
    this.name = name
    this.sportart = sportart
    this.date = date
    this.anzahlPlaetze = anzahlPlaetze
    this.belegtePlaetze = belegtePlaetze
    this.freiePlaetze = freiePlaetze
    this.emoji = emoji
    this.ort = ort
    this.ersteller = ersteller
    this.teilnehmer = teilnehmer
  }
}

export class Kurs extends Event {
  constructor({ preis, trainer, ...rest }) {
    super(rest)
    this.preis = preis
    this.trainer = trainer
  }
}

// =====================
// Nutzer-Daten
// =====================

export const annaB = new Nutzer({
  id: 1,
  name: 'Anna Bauer',
  email: 'anna.bauer@example.com',
})

export const tomF = new Nutzer({
  id: 2,
  name: 'Tom Fischer',
  email: 'tom.fischer@example.com',
})

export const saraK = new Nutzer({
  id: 3,
  name: 'Sara Klein',
  email: 'sara.klein@example.com',
})

export const users = [annaB, tomF, saraK]

// =====================
// Trainer-Daten
// =====================

export const ilyasK = new Trainer({
  id: 1,
  trainerart: 'Fitness',
  kontoinhaber: 'Ilyas Kaya',
  iban: 'DE12500105170648489890',
  bic: 'BELADEBEXXX',
  telefonnummer: '+49 151 23456789',
  bewertung: 4.8,
  zitat: 'Dein Körper kann alles – überzeuge zuerst deinen Kopf.',
  profilbild_pfad: assetUrl('/TrainerImages/IlyasK.png'),
})

export const lisaM = new Trainer({
  id: 2,
  trainerart: 'Yoga',
  kontoinhaber: 'Lisa Müller',
  iban: 'DE75200400600310028600',
  bic: 'COBADEFFXXX',
  telefonnummer: '+49 152 34567890',
  bewertung: 4.9,
  zitat: 'Yoga verbindet Körper, Geist und Seele.',
  profilbild_pfad: assetUrl('/TrainerImages/LisaM.png'),
})

export const maxS = new Trainer({
  id: 3,
  trainerart: 'Fußball',
  kontoinhaber: 'Max Schneider',
  iban: 'DE91100000000123456789',
  bic: 'SSKMDEMMXXX',
  telefonnummer: '+49 176 45678901',
  bewertung: 4.5,
  zitat: 'Teamwork macht den Traum wahr.',
  profilbild_pfad: assetUrl('/TrainerImages/MaxS.png'),
})

export const alidaW = new Trainer({
  id: 4,
  trainerart: 'Calisthenics',
  kontoinhaber: 'Alida Wolf',
  iban: 'DE56200700240012345600',
  bic: 'DEUTDEHHXXX',
  telefonnummer: '+49 157 56789012',
  bewertung: 1.2,
  zitat: 'Bodyweight is the best weight.',
  profilbild_pfad: assetUrl('/TrainerImages/AlidaW.png'),
})

export const trainer = [ilyasK, lisaM, maxS, alidaW]

// =====================
// Ort-Daten
// =====================

export const happyFit = new Ort({
  id: 1,
  name: 'Happy-Fit Konstanz',
  adresse: 'Line-Eid-Straße 6, 78467 Konstanz',
  art: 'Fitnessstudio',
  bild_pfad: assetUrl('/orteImages/happy-fit.jpg'),
})

export const calisthenicsPark = new Ort({
  id: 2,
  name: 'Calisthenics-Park',
  adresse: 'Gemeinschaftsschule Konstanz',
  art: 'Outdoor',
  bild_pfad: assetUrl('/orteImages/calisthenics.png'),
})

export const orte = [happyFit, calisthenicsPark]

// =====================
// Event- & Kurs-Daten
// =====================

export const fussballAmSee = new Event({
  id: 1,
  name: 'Fußball am See',
  sportart: 'Fußball',
  date: new Date('2026-04-05T10:00:00'),
  anzahlPlaetze: 12,
  belegtePlaetze: 4,
  freiePlaetze: 8,
  emoji: '⚽',
  ort: happyFit,
  ersteller: tomF,
  teilnehmer: [annaB, saraK],
})

export const yogaImStudio = new Kurs({
  id: 2,
  name: 'Yoga im Studio',
  sportart: 'Yoga',
  date: new Date('2026-04-06T09:00:00'),
  anzahlPlaetze: 12,
  belegtePlaetze: 1,
  freiePlaetze: 11,
  emoji: '🧘',
  preis: 15.0,
  ort: calisthenicsPark,
  trainer: lisaM,
  ersteller: annaB,
  teilnehmer: [tomF],
})

export const CalisthenicsAmPark = new Kurs({
  id: 3,
  name: 'Calisthenics am Park',
  sportart: 'Calisthenics',
  date: new Date('2026-04-07T18:00:00'),
  anzahlPlaetze: 10,
  belegtePlaetze: 9,
  freiePlaetze: 1,
  emoji: '💪',
  preis: 20.0,
  ort: calisthenicsPark,
  trainer: alidaW,
  ersteller: saraK,
  teilnehmer: [annaB, tomF, saraK, ilyasK, lisaM, maxS, alidaW],
})

export const events = [fussballAmSee, yogaImStudio, CalisthenicsAmPark]

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
