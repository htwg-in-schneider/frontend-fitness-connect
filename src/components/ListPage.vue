<script setup>
import NavBar from './NavBar.vue'
import { ArrowRight } from 'lucide-vue-next'

defineProps({
  title: { type: String, required: true },
  placeholder: { type: String, default: 'Suchen…' },
  filterOptions: { type: Array, default: () => [] },
  filterLabel: { type: String, default: 'Alle' },
  emptyText: { type: String, default: 'Keine Ergebnisse gefunden.' },
  isEmpty: { type: Boolean, default: false },
  showSearchBtn: { type: Boolean, default: true },
})

const eingabe = defineModel('eingabe', { type: String, default: '' })
const filter = defineModel('filter', { type: String, default: '' })

const emit = defineEmits(['search'])
</script>

<template>
  <NavBar />

  <main class="main-content">
    <div class="list-page">

      <div class="search-header">
        <div class="title-row">
          <h1 class="page-title">
            <slot name="icon" />
            {{ title }}
          </h1>
          <div class="title-actions">
            <slot name="actions" />
          </div>
        </div>
        <div class="search-row">
          <div class="search-input-row">
            <input
              v-model="eingabe"
              class="search-input"
              type="search"
              :placeholder="placeholder"
              @keyup.enter="emit('search')"
            />
            <button v-if="showSearchBtn" class="search-btn" @click="emit('search')">
              <ArrowRight :size="18" />
            </button>
          </div>
          <select v-if="filterOptions.length" v-model="filter" class="filter-select">
            <option value="">{{ filterLabel }}</option>
            <option v-for="opt in filterOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>
        </div>
      </div>

      <div v-if="isEmpty" class="keine-ergebnisse">
        {{ emptyText }}
      </div>

      <div class="list-grid">
        <slot />
      </div>

    </div>
  </main>
</template>

<style scoped>
.list-page {
  padding: 32px 24px;
}

.search-header {
  margin-bottom: 32px;
}

.title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.title-actions {
  display: flex;
  gap: 8px;
}

.page-title {
  font-size: 22px;
  font-weight: bold;
  font-family: "Arial Rounded MT Bold", "Arial", sans-serif;
  color: #1E293B;
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-row {
  display: flex;
  gap: 10px;
  align-items: center;
}

.search-input-row {
  display: flex;
  flex: 1;
  gap: 10px;
  align-items: center;
}

.search-input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #CBD5E1;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  background: #F8FAFC;
}

.search-input:focus {
  border-color: #3B82F6;
  background: #fff;
}

.filter-select {
  padding: 10px 12px;
  border: 1px solid #CBD5E1;
  border-radius: 8px;
  font-size: 14px;
  background: #F8FAFC;
  outline: none;
  cursor: pointer;
}

.filter-select:focus {
  border-color: #3B82F6;
  background: #fff;
}

.search-btn {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: none;
  background: #C00000;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s;
  flex-shrink: 0;
}

.search-btn:hover {
  background: #A00000;
}

.keine-ergebnisse {
  color: #64748B;
  font-size: 14px;
  padding: 24px 0;
}

.list-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

@media (max-width: 900px) {
  .list-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .search-row {
    flex-direction: column;
    align-items: stretch;
  }

  .search-input-row {
    display: flex;
    flex-direction: row;
  }

  .search-input,
  .filter-select {
    max-width: 100%;
  }

  .list-grid {
    grid-template-columns: 1fr;
  }
}
</style>
