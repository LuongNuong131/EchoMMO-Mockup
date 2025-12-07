<template>
  <div
    id="app"
    class="cyber-root"
    @mousedown="cursorClick"
    @mouseup="cursorRelease"
  >
    <div
      class="custom-cursor"
      :class="{ clicking: isClicking }"
      :style="{ left: cursorX + 'px', top: cursorY + 'px' }"
    >
      <div class="cursor-dot"></div>
      <div class="cursor-ring"></div>
    </div>

    <div class="static-noise"></div>

    <transition name="system-boot" mode="out-in">
      <div v-if="isAuthPage" class="auth-layout-wrapper">
        <router-view v-slot="{ Component }">
          <transition name="page-fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>

      <MainLayout v-else />
    </transition>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import MainLayout from "./layouts/MainLayout.vue";

const route = useRoute();

// Kiểm tra trang Auth để ẩn MainLayout
const isAuthPage = computed(() => {
  return ["Login", "Register", "ForgotPassword", "VerifyOtp"].includes(
    route.name
  );
});

// --- CURSOR LOGIC ---
const cursorX = ref(-100); // Ẩn ban đầu
const cursorY = ref(-100);
const isClicking = ref(false);

const updateCursor = (e) => {
  cursorX.value = e.clientX;
  cursorY.value = e.clientY;
};

const cursorClick = () => {
  isClicking.value = true;
};
const cursorRelease = () => {
  isClicking.value = false;
};

onMounted(() => {
  window.addEventListener("mousemove", updateCursor);
});

onUnmounted(() => {
  window.removeEventListener("mousemove", updateCursor);
});
</script>

<style>
/* --- GLOBAL RESET & ROOT --- */
body,
html {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background-color: #020617;
  cursor: none; /* Ẩn con trỏ mặc định */
  overflow: hidden; /* App.vue quản lý scroll */
}

#app {
  width: 100%;
  height: 100%;
  font-family: "Rajdhani", sans-serif;
  -webkit-font-smoothing: antialiased;
  position: relative;
}

/* --- CUSTOM CURSOR --- */
.custom-cursor {
  position: fixed;
  pointer-events: none;
  z-index: 99999;
  transform: translate(-50%, -50%);
  mix-blend-mode: difference; /* Giúp con trỏ nổi trên mọi nền */
}

.cursor-dot {
  width: 4px;
  height: 4px;
  background: #00f3ff;
  border-radius: 50%;
  box-shadow: 0 0 10px #00f3ff;
}

.cursor-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 30px;
  border: 1px solid rgba(0, 243, 255, 0.5);
  border-radius: 50%;
  transition: all 0.1s;
}

.custom-cursor.clicking .cursor-ring {
  width: 15px;
  height: 15px;
  border-color: #ff0055;
  background: rgba(255, 0, 85, 0.3);
}

@media (max-width: 768px) {
  .custom-cursor {
    display: none;
  } /* Mobile dùng touch, không cần cursor */
  body,
  html {
    cursor: auto;
  }
}

/* --- GLOBAL NOISE --- */
.static-noise {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9000;
  opacity: 0.04;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}

/* --- TRANSITIONS --- */
.system-boot-enter-active,
.system-boot-leave-active {
  transition: opacity 0.5s ease, filter 0.5s ease;
}
.system-boot-enter-from {
  opacity: 0;
  filter: blur(10px);
}
.system-boot-leave-to {
  opacity: 0;
  filter: blur(5px);
}

.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.3s ease;
}
.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
}
</style>
