<script setup>
import { useRouter } from 'vue-router'
import NavBar from '../components/NavBar.vue'

const router = useRouter()
</script>

<template>
    <NavBar />
    <main class="legal-page">
        <article class="legal-content">
            <button class="back-btn" @click="router.back()">← Zurück</button>
            <h1>Datenschutzerklärung</h1>

            <section>
                <h2>Allgemeine Hinweise</h2>
                <p>
                    Wir behandeln personenbezogene Daten vertraulich und entsprechend den gesetzlichen
                    Datenschutzvorschriften. Diese Seite informiert über die wichtigsten Datenverarbeitungen
                    innerhalb von FitnessConnect.
                </p>
            </section>

            <section>
                <h2>Kontaktformular</h2>
                <p>
                    Beim Absenden des Kontaktformulars werden die eingegebenen Inhalte an dein lokales
                    E-Mail-Programm übergeben. Eine serverseitige Speicherung durch FitnessConnect findet dabei nicht statt.
                </p>
            </section>

            <section>
                <h2>Auskunft und Löschung</h2>
                <p>
                    Du kannst jederzeit Auskunft über gespeicherte personenbezogene Daten sowie deren
                    Berichtigung oder Löschung verlangen. Nutze dafür die im Impressum angegebene Kontaktadresse.
                </p>
            </section>
        </article>
    </main>
</template>

<style scoped>
.legal-page {
    padding: 32px;
    min-height: calc(100vh - 120px);
}

.legal-content {
    margin: 0 auto;
    max-width: 820px;
}

h1 {
    color: #1E293B;
    font-family: "Arial Rounded MT Bold", "Arial", sans-serif;
    font-size: 28px;
    margin-bottom: 24px;
}

section {
    border-top: 1px solid #E2E8F0;
    padding: 18px 0;
}

h2 {
    color: #1E293B;
    font-size: 16px;
    margin-bottom: 8px;
}

p {
    color: #64748B;
    line-height: 1.6;
}

.back-btn {
    background: none;
    border: none;
    color: #C00000;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    padding: 0;
    margin-bottom: 16px;
}

.back-btn:hover {
    text-decoration: underline;
}

@media (max-width: 768px) {
    .legal-page {
        padding: 24px 18px;
    }
}
</style>
