<script setup>
import Button from './Button.vue'
import NavigationLink from './NavigationLink.vue';
</script>

<template>
    <section class="page-section section-hero">
        <div class="hero-card">
            <div class="hero-text">
                <h2 class="hero-title">Dein Sport. Deine Stadt.</h2>
                <p class="hero-subtitle">FitnessConnect verbindet dich mit Events, Sportanlagen und Trainern in Konstanz – alles an einem Ort.</p>
            </div>
            <div class="hero-divider"></div>
            <div class="login-form">
                <h3 class="login-title">Jetzt Restrieren:</h3>
                <input class="login-input" type="text" placeholder="E-Mail">
                <Button>Registrieren</Button>
                <NavigationLink>Hast du bereits einen Account? <br>Jetzt Anmelden</NavigationLink>
            </div>
        </div>
    </section>
</template>

<style scoped>
.section-hero {
    background: linear-gradient(135deg, #0F172A 0%, #1E293B 60%, #162032 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: none;
    padding: 48px 32px;
    scroll-margin-top: 60px;
}

.hero-card {
    background: #FFFFFF;
    border-radius: 16px;
    padding: 32px 36px;
    display: flex;
    align-items: center;
    gap: 0;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    max-width: 860px;
    width: 100%;
    cursor: default;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hero-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.14);
}

.hero-divider {
    width: 1px;
    align-self: stretch;
    background: #E2E8F0;
    margin: 0 32px;
    flex-shrink: 0;
}

.hero-text {
    flex: 2;
    padding-right: 0;
}

.hero-title {
    font-family: "Arial Rounded MT Bold", "Arial", sans-serif;
    font-size: 24px;
    font-weight: bold;
    color: #1E293B;
    margin-bottom: 10px;
}

.hero-subtitle {
    font-size: 13px;
    color: #64748B;
    font-family: "Arial", sans-serif;
    line-height: 1.6;
}

.login-form {
    flex: 1;
    background: transparent;
    border-radius: 0;
    padding: 0;
    box-shadow: none;
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 100px;
}

.login-title {
    font-family: "Arial Rounded MT Bold", "Arial", sans-serif;
    font-size: 14px;
    font-weight: bold;
    color: #2D2D2D;
    margin-bottom: 4px;
}

.login-input {
    border: 1px solid #E2E8F0;
    border-radius: 8px;
    padding: 8px 12px;
    font-size: 12px;
    font-family: "Arial", sans-serif;
    color: #1E293B;
    outline: none;
    background: #F8FAFC;
}

@media (max-width: 768px) {
    .hero-card {
        flex-direction: column;
    }

    .section-hero {
        flex-direction: column;
    }

    .login-form {
        width: 100%;
    }
}
</style>
