<script setup>
import { LayoutDashboard, Calendar, MapPin, Users, User, Shield, Star } from 'lucide-vue-next'

const iconMap = { LayoutDashboard, Calendar, MapPin, Users, User, Shield, Star }

const props = defineProps({
    icon: {
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
        <component :is="iconMap[icon]" :size="16" class="nav-btn-icon" /> <span class="nav-btn-label"> {{ label }}</span>
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

.nav-btn-icon {
    vertical-align: -3px;
    margin-right: 2px;
}

</style>
