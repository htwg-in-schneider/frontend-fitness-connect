<script setup>
defineProps({
    variant: {
        type: String,
        default: 'primary',
        validator: (v) => ['primary', 'secondary', 'danger'].includes(v),
    },
    type: {
        type: String,
        default: 'button',
    },
})
</script>

<template>
    <button :type="type" class="btn" :class="`btn--${variant}`">
        <slot />
    </button>
</template>

<style scoped>
.btn {
    display: block;
    width: 100%;
    padding: 8px;
    border: none;
    border-radius: 8px;
    font-size: 10px;
    font-weight: bold;
    font-family: "Arial Rounded MT", "Arial", sans-serif;
    cursor: pointer;
    text-align: center;
    transition: background 0.15s ease, opacity 0.15s ease;
}

/* primary — solid red */
.btn--primary {
    background: #C00000;
    color: #FFFFFF;
}

.btn--primary:hover {
    background: #A00000;
}

/* secondary — grey */
.btn--secondary {
    background: #E2E8F0;
    color: #1E293B;
}

.btn--secondary:hover {
    background: #CBD5E1;
}

/* danger — low-opacity red background, red font */
.btn--danger {
    background: rgba(192, 0, 0, 0.12);
    color: #C00000;
}

.btn--danger:hover {
    background: rgba(192, 0, 0, 0.22);
}
</style>
