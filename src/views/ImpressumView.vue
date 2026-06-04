<script setup>
import NavBar from '../components/NavBar.vue'
</script>

<template>
    <NavBar />
    <main class="legal-page">
        <article class="legal-content">
            <h1>Impressum</h1>

            <section>
                <h2>Angaben gemäß § 5 TMG</h2>
                <p>FitnessConnect</p>
                <p>Musterstraße 1</p>
                <p>78462 Konstanz</p>
            </section>

            <section>
                <h2>Kontakt</h2>
                <p>E-Mail: kontakt@fitnessconnect.de</p>
                <p>Telefon: +49 7531 123456</p>
            </section>

            <section>
                <h2>Verantwortlich für den Inhalt</h2>
                <p>FitnessConnect Team</p>
                <p>Musterstraße 1, 78462 Konstanz</p>
            </section>
        </article>
    </main>
</template>

<style scoped>
.legal-page {
    padding: 32px;
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

@media (max-width: 768px) {
    .legal-page {
        padding: 24px 18px;
    }
}
</style>
