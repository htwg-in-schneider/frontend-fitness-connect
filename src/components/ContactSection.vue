<script setup>
import { computed, reactive } from 'vue'
import Button from './Button.vue'
import NavigationLink from './NavigationLink.vue'

const form = reactive({
    name: '',
    email: '',
    message: '',
})

const mailtoHref = computed(() => {
    const subject = encodeURIComponent(`Kontaktanfrage von ${form.name || 'FitnessConnect'}`)
    const body = encodeURIComponent([
        `Name: ${form.name}`,
        `E-Mail: ${form.email}`,
        '',
        form.message,
    ].join('\n'))

    return `mailto:kontakt@fitnessconnect.de?subject=${subject}&body=${body}`
})

function submitContactForm() {
    window.location.href = mailtoHref.value
}
</script>

<template>
    <section class="page-section section-contact">
        <div class="contact-layout">
            <div class="contact-copy">
                <p class="contact-kicker">Kontakt</p>
                <h2 class="section-title contact-title">Fragen, Feedback oder eine Idee?</h2>
                <p class="contact-text">
                    Schreib uns kurz, worum es geht. Dein Mailprogramm wird mit den Formularinhalten vorbereitet.
                </p>
            </div>

            <form class="contact-form" @submit.prevent="submitContactForm">
                <label class="form-field">
                    <span>Name</span>
                    <input v-model="form.name" name="name" type="text" autocomplete="name" required>
                </label>
                <label class="form-field">
                    <span>E-Mail</span>
                    <input v-model="form.email" name="email" type="email" autocomplete="email" required>
                </label>
                <label class="form-field">
                    <span>Nachricht</span>
                    <textarea v-model="form.message" name="message" rows="5" required></textarea>
                </label>
                <Button type="submit">Nachricht per E-Mail senden</Button>
            </form>
        </div>
    </section>

    <footer class="site-footer">
        <p>© 2026 FitnessConnect</p>
        <nav class="footer-links" aria-label="Rechtliche Links">
            <NavigationLink to="/impressum">Impressum</NavigationLink>
            <NavigationLink to="/datenschutz">Datenschutzerklärung</NavigationLink>
        </nav>
    </footer>
</template>

<style scoped>
.section-contact {
    background: #F8FAFC;
    scroll-margin-top: 60px;
}

.contact-layout {
    display: grid;
    grid-template-columns: minmax(220px, 0.9fr) minmax(280px, 1.1fr);
    gap: 28px;
    align-items: start;
}

.contact-kicker {
    color: #C00000;
    font-size: 11px;
    font-weight: bold;
    margin-bottom: 8px;
    text-transform: uppercase;
}

.contact-title {
    margin-bottom: 8px;
}

.contact-text {
    color: #64748B;
    font-size: 13px;
    line-height: 1.6;
    max-width: 420px;
}

.contact-form {
    background: #FFFFFF;
    border: 1px solid #E2E8F0;
    border-radius: 8px;
    padding: 18px;
    display: grid;
    gap: 12px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.form-field {
    display: grid;
    gap: 6px;
    color: #1E293B;
    font-size: 12px;
    font-weight: bold;
}

.form-field input,
.form-field textarea {
    width: 100%;
    border: 1px solid #CBD5E1;
    border-radius: 8px;
    color: #1E293B;
    font: inherit;
    font-weight: normal;
    padding: 10px 12px;
    resize: vertical;
}

.form-field input:focus,
.form-field textarea:focus {
    border-color: #C00000;
    outline: 2px solid rgba(192, 0, 0, 0.12);
}

.site-footer {
    align-items: center;
    background: #1E293B;
    color: #FFFFFF;
    display: flex;
    gap: 16px;
    justify-content: space-between;
    margin: 0 -32px;
    padding: 18px 32px;
}

.footer-links {
    display: flex;
    gap: 18px;
}

.site-footer :deep(.nav-link) {
    color: #FFFFFF;
}

@media (max-width: 768px) {
    .contact-layout {
        grid-template-columns: 1fr;
    }

    .site-footer {
        align-items: flex-start;
        flex-direction: column;
    }

    .footer-links {
        flex-direction: column;
        gap: 10px;
    }
}
</style>
