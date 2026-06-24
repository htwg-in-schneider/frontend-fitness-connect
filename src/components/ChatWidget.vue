<script setup>
import { ref, nextTick, watch } from 'vue'
import { MessageCircle, X, Send, MapPin, Calendar, User, Dumbbell } from 'lucide-vue-next'

const API = import.meta.env.VITE_API_BASE_URL

const isOpen = ref(false)
const draft = ref('')
const loading = ref(false)
const messagesEl = ref(null)

const messages = ref([
  {
    from: 'bot',
    text: 'Hey Sportsfreund, mir kannst du gerne Fragen zu Events und Trainern stellen.',
    events: [],
    orte: [],
    trainer: [],
  },
])

async function scrollToBottom() {
  await nextTick()
  if (messagesEl.value) {
    messagesEl.value.scrollTop = messagesEl.value.scrollHeight
  }
}

async function sendMessage() {
  const text = draft.value.trim()
  if (!text || loading.value) return

  messages.value.push({ from: 'user', text, events: [], orte: [], trainer: [] })
  draft.value = ''
  loading.value = true
  scrollToBottom()

  try {
    const res = await fetch(`${API}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text }),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    messages.value.push({
      from: 'bot',
      text: data.answer || '',
      events: data.events || [],
      orte: data.orte || [],
      trainer: data.trainer || [],
    })
  } catch (e) {
    messages.value.push({
      from: 'bot',
      text: 'Ups, da ist gerade etwas schiefgelaufen. Bitte versuch es gleich nochmal.',
      events: [],
      orte: [],
      trainer: [],
    })
  } finally {
    loading.value = false
    scrollToBottom()
  }
}

function formatDate(zeit) {
  if (!zeit) return ''
  try {
    const d = new Date(zeit)
    return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
      ' ' + d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
  } catch { return zeit }
}

function toggleChat() {
  isOpen.value = !isOpen.value
}

watch(isOpen, (open) => {
  if (open) scrollToBottom()
})
</script>

<template>
  <div class="chat-widget">
    <transition name="chat-pop">
      <div v-if="isOpen" class="chat-window">
        <div class="chat-header">
          <div class="chat-header-info">
            <MessageCircle :size="20" />
            <span>Fitness Connect Chat</span>
          </div>
          <button class="chat-close" aria-label="Chat schließen" @click="toggleChat">
            <X :size="20" />
          </button>
        </div>

        <div ref="messagesEl" class="chat-messages">
          <div
            v-for="(msg, i) in messages"
            :key="i"
            class="chat-bubble-wrapper"
            :class="msg.from === 'user' ? 'from-user' : 'from-bot'"
          >
            <div class="chat-message" :class="msg.from === 'user' ? 'msg-user' : 'msg-bot'">
              {{ msg.text }}
            </div>

            <!-- Events -->
            <div v-if="msg.events && msg.events.length" class="card-list">
              <div v-for="event in msg.events" :key="'e' + event.id" class="info-card event-card">
                <div class="card-header">
                  <Dumbbell :size="14" />
                  <span class="card-title">{{ event.name }}</span>
                  <span class="card-badge" :class="event.typ === 'KURS' ? 'badge-kurs' : 'badge-event'">
                    {{ event.typ }}
                  </span>
                </div>
                <div class="card-details">
                  <span v-if="event.sportart">{{ event.sportart }}</span>
                  <span v-if="event.ortName"><MapPin :size="12" /> {{ event.ortName }}</span>
                  <span v-if="event.zeit"><Calendar :size="12" /> {{ formatDate(event.zeit) }}</span>
                  <span v-if="event.kostenlos" class="card-free">Kostenlos</span>
                  <span v-else-if="event.preis" class="card-price">{{ event.preis.toFixed(2) }} €</span>
                </div>
              </div>
            </div>

            <!-- Orte -->
            <div v-if="msg.orte && msg.orte.length" class="card-list">
              <div v-for="ort in msg.orte" :key="'o' + ort.id" class="info-card ort-card">
                <div class="card-header">
                  <MapPin :size="14" />
                  <span class="card-title">{{ ort.name }}</span>
                  <span v-if="ort.art" class="card-badge badge-art">{{ ort.art }}</span>
                </div>
                <div class="card-details">
                  <span v-if="ort.adresse">{{ ort.adresse }}</span>
                </div>
              </div>
            </div>

            <!-- Trainer -->
            <div v-if="msg.trainer && msg.trainer.length" class="card-list">
              <div v-for="t in msg.trainer" :key="'t' + t.id" class="info-card trainer-card">
                <div class="card-header">
                  <User :size="14" />
                  <span class="card-title">{{ t.name }}</span>
                  <span v-if="t.bewertung" class="card-badge badge-rating">★ {{ t.bewertung.toFixed(1) }}</span>
                </div>
                <div class="card-details">
                  <span v-if="t.trainerart">{{ t.trainerart }}</span>
                  <span v-if="t.email">✉ {{ t.email }}</span>
                  <span v-if="t.telefonnummer">☎ {{ t.telefonnummer }}</span>
                </div>
              </div>
            </div>
          </div>

          <div v-if="loading" class="chat-bubble-wrapper from-bot">
            <div class="chat-message msg-bot chat-typing">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>

        <form class="chat-input" @submit.prevent="sendMessage">
          <input
            v-model="draft"
            type="text"
            placeholder="Nachricht eingeben…"
            autocomplete="off"
            :disabled="loading"
          />
          <button type="submit" aria-label="Senden" :disabled="!draft.trim() || loading">
            <Send :size="18" />
          </button>
        </form>
      </div>
    </transition>

    <button
      class="chat-toggle"
      :class="{ open: isOpen }"
      :aria-label="isOpen ? 'Chat schließen' : 'Chat öffnen'"
      @click="toggleChat"
    >
      <component :is="isOpen ? X : MessageCircle" :size="26" />
    </button>
  </div>
</template>

<style scoped>
.chat-widget {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 300;
  font-family: "Arial", sans-serif;
}

.chat-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  background: #C00000;
  color: #fff;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s, background 0.2s;
}

.chat-toggle:hover {
  transform: scale(1.06);
  background: #a00000;
}

.chat-window {
  position: absolute;
  bottom: 76px;
  right: 0;
  width: 380px;
  max-width: calc(100vw - 48px);
  height: 520px;
  max-height: calc(100vh - 140px);
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #1E293B;
  color: #fff;
}

.chat-header-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
  font-size: 15px;
}

.chat-close {
  display: flex;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  padding: 2px;
  border-radius: 6px;
  transition: color 0.2s, background 0.2s;
}

.chat-close:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: #F1F5F9;
}

.chat-bubble-wrapper {
  display: flex;
  flex-direction: column;
  max-width: 85%;
}

.chat-bubble-wrapper.from-bot {
  align-self: flex-start;
}

.chat-bubble-wrapper.from-user {
  align-self: flex-end;
}

.chat-message {
  padding: 10px 14px;
  border-radius: 14px;
  font-size: 14px;
  line-height: 1.4;
  word-wrap: break-word;
}

.msg-bot {
  background: #fff;
  color: #1E293B;
  border-bottom-left-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.msg-user {
  background: #C00000;
  color: #fff;
  border-bottom-right-radius: 4px;
}

/* DTO Cards */
.card-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 8px;
}

.info-card {
  background: #fff;
  border: 1px solid #E2E8F0;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 13px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.card-title {
  font-weight: 600;
  color: #1E293B;
  flex: 1;
}

.card-badge {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 600;
  text-transform: uppercase;
}

.badge-event {
  background: #DBEAFE;
  color: #1D4ED8;
}

.badge-kurs {
  background: #FEF3C7;
  color: #D97706;
}

.badge-art {
  background: #E0E7FF;
  color: #4338CA;
}

.badge-rating {
  background: #FEF9C3;
  color: #A16207;
}

.card-details {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 12px;
  color: #64748B;
  font-size: 12px;
  align-items: center;
}

.card-details span {
  display: inline-flex;
  align-items: center;
  gap: 3px;
}

.card-free {
  color: #16A34A;
  font-weight: 600;
}

.card-price {
  color: #DC2626;
  font-weight: 600;
}

.event-card {
  border-left: 3px solid #C00000;
}

.ort-card {
  border-left: 3px solid #2563EB;
}

.trainer-card {
  border-left: 3px solid #7C3AED;
}

.chat-typing {
  display: flex;
  gap: 4px;
  align-items: center;
}

.chat-typing span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #94A3B8;
  animation: chat-typing-bounce 1.2s infinite ease-in-out;
}

.chat-typing span:nth-child(2) { animation-delay: 0.2s; }
.chat-typing span:nth-child(3) { animation-delay: 0.4s; }

@keyframes chat-typing-bounce {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
  30% { transform: translateY(-4px); opacity: 1; }
}

.chat-input {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-top: 1px solid #E2E8F0;
  background: #fff;
}

.chat-input input {
  flex: 1;
  border: 1px solid #CBD5E1;
  border-radius: 20px;
  padding: 9px 14px;
  font-size: 14px;
  font-family: inherit;
  outline: none;
}

.chat-input input:focus {
  border-color: #C00000;
}

.chat-input button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: none;
  background: #C00000;
  color: #fff;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.2s;
}

.chat-input button:hover:not(:disabled) {
  background: #a00000;
}

.chat-input button:disabled {
  background: #CBD5E1;
  cursor: not-allowed;
}

.chat-pop-enter-active,
.chat-pop-leave-active {
  transition: opacity 0.2s, transform 0.2s;
  transform-origin: bottom right;
}

.chat-pop-enter-from,
.chat-pop-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(10px);
}

/* Auf Mobile über der Bottom-Navigation platzieren */
@media (max-width: 768px) {
  .chat-widget {
    bottom: 76px;
    right: 16px;
  }

  .chat-window {
    bottom: 72px;
    max-height: calc(100vh - 220px);
  }
}
</style>
