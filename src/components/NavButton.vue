<script setup>
defineProps({
    emoji: {
        type: String,
        required: true,
    },
    label: {
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
        default: false,
    },
})
</script>

<template>
    <button type="button" class="nav-btn" :class="{ active }">
        <span class="nav-btn-emoji">{{ emoji }}</span> <span class="nav-btn-label"> {{ label }}</span>
    </button>
</template>

<style scoped>
.nav-btn {
    display: block;
    padding: 8px 14px;
    color: #FFFFFF;
    font-size: 12px;
    font-family: "Arial", sans-serif;
    background: none;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.2s;
    white-space: nowrap;
}

.nav-btn:hover {
    background: rgba(255, 255, 255, 0.15);
}

.nav-btn.active {
    background: #C00000;
    color: #FFFFFF;
    font-weight: bold;
}

@media (max-width: 768px) {
    .nav-btn-label {
        display: none;
    }
}
</style>
