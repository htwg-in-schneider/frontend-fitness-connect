<script setup>
import { ref, nextTick, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { MessageCircle, X, Send, MapPin, Calendar, User, Dumbbell } from 'lucide-vue-next'

const API = import.meta.env.VITE_API_BASE_URL
const router = useRouter()

const isOpen = ref(false)
const draft = ref('')
const loading = ref(false)
const messagesEl = ref(null)

// Alle Posen des Trainers aus assets/michis laden
const michis = Object.values(
  import.meta.glob('../assets/michis/*.png', { eager: true, import: 'default' })
)
const currentMichi = ref(michis[0])

// Wählt zufällig eine andere Pose als die aktuell angezeigte
function setRandomMichi() {
  if (michis.length <= 1) return
  let next = currentMichi.value
  while (next === currentMichi.value) {
    next = michis[Math.floor(Math.random() * michis.length)]
  }
  currentMichi.value = next
}

const messages = ref([
  {
    from: 'bot',
    text: 'Hey Sportsfreund, ich bin Michael, dein Trainer und Helfer für alles. Mir kannst du gerne Fragen zu Events und Trainern stellen.',
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

/**
 * Parses the answer text and splits it into segments of text and data markers.
 * Markers look like ⟦EVENT:0⟧, ⟦ORT:1⟧, ⟦TRAINER:0⟧
 */
function parseSegments(msg) {
  const markerRegex = /⟦(EVENT|ORT|TRAINER):(\d+)⟧/g
  const segments = []
  let lastIndex = 0
  let match

  while ((match = markerRegex.exec(msg.text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', content: msg.text.slice(lastIndex, match.index) })
    }
    const dataType = match[1]
    const index = parseInt(match[2], 10)
    let data = null
    if (dataType === 'EVENT') data = msg.events?.[index]
    else if (dataType === 'ORT') data = msg.orte?.[index]
    else if (dataType === 'TRAINER') data = msg.trainer?.[index]

    if (data) {
      segments.push({ type: dataType.toLowerCase(), data })
    }
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < (msg.text?.length || 0)) {
    segments.push({ type: 'text', content: msg.text.slice(lastIndex) })
  }

  if (segments.length === 0 && msg.text) {
    segments.push({ type: 'text', content: msg.text })
  }

  return segments
}

async function sendMessage() {
  const text = draft.value.trim()
  if (!text || loading.value) return

  messages.value.push({ from: 'user', text, events: [], orte: [], trainer: [] })
  draft.value = ''
  loading.value = true
  setRandomMichi()
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
    setRandomMichi()
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
  if (open) {
    setRandomMichi()
    scrollToBottom()
  }
})
</script>

<template>
  <div class="chat-widget">
    <transition name="backdrop-fade">
      <div v-if="isOpen" class="chat-backdrop" @click="toggleChat">
        <transition name="michi-swap" mode="out-in">
          <img
            :key="currentMichi"
            :src="currentMichi"
            class="chat-michi"
            alt="Michael, dein Trainer"
          />
        </transition>
      </div>
    </transition>

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
            <!-- User messages: plain text -->
            <div v-if="msg.from === 'user'" class="chat-message msg-user">
              {{ msg.text }}
            </div>

            <!-- Bot messages: parsed segments with inline cards -->
            <template v-else>
              <template v-for="(seg, j) in parseSegments(msg)" :key="j">
                <span v-if="seg.type === 'text'" class="chat-text-segment">{{ seg.content }}</span>

                <!-- Inline Event Card -->
                <div v-else-if="seg.type === 'event'" class="info-card event-card clickable" @click="router.push('/event/' + seg.data.id)">
                  <div class="card-header">
                    <Dumbbell :size="14" />
                    <span class="card-title">{{ seg.data.name }}</span>
                    <span class="card-badge" :class="seg.data.typ === 'KURS' ? 'badge-kurs' : 'badge-event'">
                      {{ seg.data.typ }}
                    </span>
                  </div>
                  <div class="card-details">
                    <span v-if="seg.data.sportart">{{ seg.data.sportart }}</span>
                    <span v-if="seg.data.ortName"><MapPin :size="12" /> {{ seg.data.ortName }}</span>
                    <span v-if="seg.data.zeit"><Calendar :size="12" /> {{ formatDate(seg.data.zeit) }}</span>
                    <span v-if="seg.data.kostenlos" class="card-free">Kostenlos</span>
                    <span v-else-if="seg.data.preis" class="card-price">{{ seg.data.preis.toFixed(2) }} €</span>
                  </div>
                </div>

                <!-- Inline Ort Card -->
                <div v-else-if="seg.type === 'ort'" class="info-card ort-card clickable" @click="router.push('/ort/' + seg.data.id)">
                  <div class="card-header">
                    <MapPin :size="14" />
                    <span class="card-title">{{ seg.data.name }}</span>
                    <span v-if="seg.data.art" class="card-badge badge-art">{{ seg.data.art }}</span>
                  </div>
                  <div class="card-details">
                    <span v-if="seg.data.adresse">{{ seg.data.adresse }}</span>
                  </div>
                </div>

                <!-- Inline Trainer Card -->
                <div v-else-if="seg.type === 'trainer'" class="info-card trainer-card clickable" @click="router.push('/trainer/' + seg.data.id)">
                  <div class="card-header">
                    <User :size="14" />
                    <span class="card-title">{{ seg.data.name }}</span>
                    <span v-if="seg.data.bewertung" class="card-badge badge-rating">★ {{ seg.data.bewertung.toFixed(1) }}</span>
                  </div>
                  <div class="card-details">
                    <span v-if="seg.data.trainerart">{{ seg.data.trainerart }}</span>
                    <span v-if="seg.data.email">✉ {{ seg.data.email }}</span>
                    <span v-if="seg.data.telefonnummer">☎ {{ seg.data.telefonnummer }}</span>
                  </div>
                </div>
              </template>
            </template>
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

/* Abdunkelnder Overlay hinter dem Chat-Fenster */
.chat-backdrop {
  position: fixed;
  inset: 0;
  z-index: -1;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(2px);
  cursor: pointer;
}

/* Große Pose des Trainers auf der linken Bildschirmhälfte */
.chat-michi {
  position: fixed;
  left: clamp(16px, 5vw, 80px);
  bottom: 0;
  height: min(90vh, 900px);
  max-width: calc(100vw - 420px);
  object-fit: contain;
  object-position: bottom;
  pointer-events: none;
  filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.45));
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
  background: #fff;
  border-radius: 14px;
  border-bottom-left-radius: 4px;
  padding: 10px 14px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.chat-bubble-wrapper.from-user {
  align-self: flex-end;
}

.chat-text-segment {
  font-size: 14px;
  line-height: 1.5;
  color: #1E293B;
  white-space: pre-line;
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
.info-card {
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 13px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  margin: 6px 0;
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

.clickable {
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
}

.clickable:hover {
  transform: translateY(-1px);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.12);
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

.backdrop-fade-enter-active,
.backdrop-fade-leave-active {
  transition: opacity 0.25s ease;
}

.backdrop-fade-enter-from,
.backdrop-fade-leave-to {
  opacity: 0;
}

/* Weicher Übergang beim Wechsel der Pose */
.michi-swap-enter-active,
.michi-swap-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}

.michi-swap-enter-from {
  opacity: 0;
  transform: translateY(16px) scale(0.98);
}

.michi-swap-leave-to {
  opacity: 0;
  transform: translateY(-16px) scale(0.98);
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

  /* Auf kleinen Bildschirmen ist kein Platz für die große Pose */
  .chat-michi {
    display: none;
  }
}
</style>
