<script setup>
defineProps({
    href: {
        type: String,
        default: null,
    },
})
</script>

<template>
    <a v-if="href" :href="href" class="nav-link"><slot /></a>
    <button v-else type="button" class="nav-link"><slot /></button>
</template>

<style scoped>
.nav-link {
    background: none;
    border: none;
    padding: 0;
    color: #C00000;
    font-size: 11px;
    font-family: "Arial", sans-serif;
    font-weight: bold;
    cursor: pointer;
    text-decoration: none;
}

.nav-link:hover {
    text-decoration: underline;
}
</style>
