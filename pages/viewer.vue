<template>
  <div class="viewer-container">
    <iframe 
      v-if="url" 
      :src="url" 
      class="viewer-iframe" 
      frameborder="0" 
      allowfullscreen
    ></iframe>
    
    <div v-else class="flex items-center justify-center h-screen bg-slate-900 text-white">
      <p>{{ $t('invalid_url') || 'Invalid URL provided' }}</p>
    </div>

    <!-- The Logo Overlay to hide external branding -->
    <div v-if="url" class="logo-overlay">
      <img src="/logo.png" alt="Oralign" class="overlay-image" />
    </div>

    <!-- Back/Close Button -->
    <button @click="goBack" class="back-button" :title="$t('close') || 'Close'">
      <i class="fas fa-times"></i>
    </button>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'

definePageMeta({
  layout: false
})

const route = useRoute()
const router = useRouter()
const url = computed(() => {
  const q = route.query.url
  if (!q) return ''
  try {
    return decodeURIComponent(q)
  } catch (e) {
    return q
  }
})

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    // Fallback if opened in new tab directly
    window.close()
  }
}
</script>

<style scoped>
.viewer-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #f1f5f9;
  z-index: 99999;
}

.viewer-iframe {
  width: 100%;
  height: 100%;
  border: none;
  background-color: #ffffff;
}

/* Positioned at bottom right to cover external logos (like Nemotec) */
.logo-overlay {
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 10px 24px;
  background-color: #ffffff;
  border-top-left-radius: 16px;
  box-shadow: -4px -4px 15px rgba(0, 0, 0, 0.08);
  z-index: 100000;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 160px;
  min-height: 55px;
}

.overlay-image {
  height: 35px;
  object-fit: contain;
}

.back-button {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 44px;
  height: 44px;
  background-color: rgba(255, 255, 255, 0.9);
  color: #334155;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 100000;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  border: 1px solid #e2e8f0;
  font-size: 20px;
}

.back-button:hover {
  background-color: #ffffff;
  transform: scale(1.05);
  color: #ef4444;
}

html[dir="rtl"] .back-button {
  left: auto;
  right: 20px;
}
</style>
