# Fitness Connect Frontend

Das Frontend von Fitness Connect ist eine Vue-3-Anwendung mit Vite. Die App dient als Benutzeroberflaeche fuer die Fitness-Connect-Plattform: Nutzer koennen Events entdecken, sich anmelden, Trainer ansehen, Sportanlagen finden, eigene Events verwalten und ihr Profil pflegen.

## Technologien

- Vue 3
- Vite
- Vue Router
- Pinia
- Auth0 fuer Login und JWT-basierte Authentifizierung
- lucide-vue-next fuer Icons

## Funktionen

- Startseite mit Uebersichten zu Events, Orten und Trainern
- Eventliste mit Suche und Filterung nach Sportart
- Detailseiten fuer Events, Trainer und Sportanlagen
- Anmeldung und Abmeldung zu Events
- Erstellung und Bearbeitung eigener Events
- Profilverwaltung inkl. Trainerbewerbung
- Admin-Dashboard fuer Events, Orte, Nutzer, Anmeldungen und Bewerbungen
- Impressum und Datenschutzseiten

## Voraussetzungen

- Node.js `^20.19.0` oder `>=22.12.0`
- npm
- Laufendes Fitness-Connect-Backend
- Auth0-Anwendung mit passender API-Konfiguration

## Installation

```sh
npm install
```

## Konfiguration

Lege fuer die lokale Entwicklung eine `.env`-Datei im Projektverzeichnis an:

```env
VITE_API_BASE_URL=http://localhost:8081
VITE_AUTH0_DOMAIN=deine-auth0-domain
VITE_AUTH0_CLIENT_ID=deine-client-id
VITE_AUTH0_AUDIENCE=https://fitness-connect-api
```

`VITE_API_BASE_URL` zeigt auf das Backend. Die Auth0-Werte muessen zur Konfiguration des Backends passen, damit die JWT-Tokens akzeptiert werden.

## Entwicklung starten

```sh
npm run dev
```

Die Anwendung laeuft standardmaessig unter `http://localhost:5173`.

## Build und Vorschau

```sh
npm run build
npm run preview
```

Der Produktionsbuild wird im Ordner `dist` erzeugt. In `vite.config.js` ist fuer Produktionsbuilds der Base-Pfad `/frontend-fitness-connect/` gesetzt, passend fuer ein Deployment unter diesem Repository-Pfad.

## Projektstruktur

```text
src/
  assets/       Logos und globale Assets
  components/   Wiederverwendbare UI-Komponenten
  router/       Vue-Router-Konfiguration
  stores/       Pinia-Stores fuer Events, Orte, Trainer, Admin und Banner
  views/        Seiten der Anwendung
  App.vue       Einstiegskomponente mit Nutzerinitialisierung
  main.js       App-Setup mit Pinia, Router und Auth0
```

## Wichtige Routen

- `/` Dashboard
- `/events` Eventuebersicht
- `/trainer` Traineruebersicht
- `/orte` Sportanlagen
- `/event/:id`, `/trainer/:id`, `/ort/:id` Detailseiten
- `/profil` eigenes Profil
- `/event-erstellen` Event erstellen
- `/meine-events` eigene und gebuchte Events
- `/admin` Admin-Dashboard

Geschuetzte Routen verwenden den `authGuard` von Auth0.

## Backend-Anbindung

Das Frontend kommuniziert ueber `fetch` mit REST-Endpunkten unter `/api/...`. Authentifizierte Requests senden ein Bearer Token aus Auth0 an das Backend. Die wichtigsten Datenbereiche sind Events, Orte, Trainer, Nutzerprofile, Anmeldungen und Admin-Funktionen.
