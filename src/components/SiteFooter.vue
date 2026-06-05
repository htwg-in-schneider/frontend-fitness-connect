<script setup>
import NavigationLink from './NavigationLink.vue'
</script>

<template>
  <footer class="site-footer">
    <p>© 2026 FitnessConnect</p>
    <nav class="footer-links" aria-label="Rechtliche Links">
      <NavigationLink to="/impressum">Impressum</NavigationLink>
      <NavigationLink to="/datenschutz">Datenschutzerklärung</NavigationLink>
    </nav>
  </footer>
</template>

<style scoped>
.site-footer {
  align-items: center;
  background: #1E293B;
  color: #FFFFFF;
  display: flex;
  gap: 16px;
  justify-content: space-between;
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
  .site-footer {
    align-items: flex-start;
    flex-direction: column;
    padding-bottom: calc(18px + 70px);
  }

  .footer-links {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
