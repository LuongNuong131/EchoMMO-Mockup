<template>
  <div
    class="app-layout wuxia-theme"
    :style="{ '--sidebar-width': isCollapsed ? '80px' : '260px' }"
  >
    <div class="ink-bg-layer">
      <div class="mountain-bg"></div>
      <div class="fog-overlay"></div>
    </div>

    <aside class="sidebar" :class="{ collapsed: isCollapsed }">
      <div class="logo-area">
        <div class="logo-seal"><span class="seal-char">E</span></div>
        <transition name="fade">
          <div v-if="!isCollapsed" class="logo-text">
            <span class="main">ECHO</span><span class="sub">_MMO</span>
          </div>
        </transition>
      </div>

      <nav class="nav-links custom-scroll">
        <router-link to="/" class="nav-item">
          <div class="nav-icon"><i class="fas fa-dungeon"></i></div>
          <transition name="slide-fade"
            ><span v-if="!isCollapsed" class="nav-label"
              >SẢNH CHÍNH</span
            ></transition
          >
          <div class="active-glow"></div>
        </router-link>

        <div class="nav-group-label" v-if="!isCollapsed">GIANG HỒ</div>

        <router-link to="/explore" class="nav-item">
          <div class="nav-icon"><i class="fas fa-map-marked-alt"></i></div>
          <transition name="slide-fade"
            ><span v-if="!isCollapsed" class="nav-label"
              >HÀNH TẨU</span
            ></transition
          >
          <div class="active-glow"></div>
        </router-link>

        <router-link to="/village" class="nav-item">
          <div class="nav-icon"><i class="fas fa-campground"></i></div>
          <transition name="slide-fade"
            ><span v-if="!isCollapsed" class="nav-label"
              >DOANH TRẠI</span
            ></transition
          >
          <div class="active-glow"></div>
        </router-link>

        <div class="nav-group-label" v-if="!isCollapsed">HÀNH TRANG</div>

        <router-link to="/inventory" class="nav-item">
          <div class="nav-icon"><i class="fas fa-suitcase"></i></div>
          <transition name="slide-fade"
            ><span v-if="!isCollapsed" class="nav-label"
              >TÚI ĐỒ</span
            ></transition
          >
          <div class="active-glow"></div>
        </router-link>

        <router-link to="/character" class="nav-item">
          <div class="nav-icon"><i class="fas fa-user-shield"></i></div>
          <transition name="slide-fade"
            ><span v-if="!isCollapsed" class="nav-label"
              >TRANG BỊ</span
            ></transition
          >
          <div class="active-glow"></div>
        </router-link>

        <router-link to="/market" class="nav-item">
          <div class="nav-icon"><i class="fas fa-coins"></i></div>
          <transition name="slide-fade"
            ><span v-if="!isCollapsed" class="nav-label"
              >THƯƠNG HỘI</span
            ></transition
          >
          <div class="active-glow"></div>
        </router-link>

        <router-link to="/leaderboard" class="nav-item">
          <div class="nav-icon"><i class="fas fa-crown"></i></div>
          <transition name="slide-fade"
            ><span v-if="!isCollapsed" class="nav-label"
              >BẢNG VÀNG</span
            ></transition
          >
          <div class="active-glow"></div>
        </router-link>

        <template v-if="authStore.user?.role === 'ADMIN'">
          <div class="nav-group-label admin" v-if="!isCollapsed">
            TRIỀU ĐÌNH
          </div>
          <router-link to="/admin" class="nav-item admin-link">
            <div class="nav-icon"><i class="fas fa-gavel"></i></div>
            <transition name="slide-fade"
              ><span v-if="!isCollapsed" class="nav-label"
                >QUAN PHỦ</span
              ></transition
            >
            <div class="active-glow"></div>
          </router-link>
        </template>
      </nav>

      <div class="sidebar-footer">
        <button class="control-btn toggle" @click="toggleSidebar">
          <i
            :class="
              isCollapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left'
            "
          ></i>
        </button>
        <button class="control-btn logout" @click="authStore.logout">
          <i class="fas fa-power-off"></i
          ><span v-if="!isCollapsed" class="btn-text">QUY ẨN</span>
        </button>
      </div>
    </aside>

    <div class="content-wrapper">
      <div class="ornamental-frame">
        <div class="corner top-left"></div>
        <div class="corner top-right"></div>
        <div class="corner bottom-left"></div>
        <div class="corner bottom-right"></div>
        <div class="border-decor left"></div>
        <div class="border-decor right"></div>
      </div>
      <GameHeader />
      <main
        class="main-view custom-scroll"
        ref="mainScroll"
        @scroll="handleScroll"
      >
        <div class="page-body">
          <router-view v-slot="{ Component }">
            <transition name="page-fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "../stores/authStore";
import GameHeader from "../components/GameHeader.vue";

const authStore = useAuthStore();
const isCollapsed = ref(false);
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
};
const mainScroll = ref(null);
const handleScroll = () => {
  /* Logic scroll */
};
</script>

<style scoped>
/* CSS cũ giữ nguyên */
@import url("https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Noto+Serif+TC:wght@500;700;900&family=Orbitron:wght@400;700&display=swap");

:root {
  --sidebar-bg: #111827;
  --sidebar-border: #1f2937;
  --text-main: #f3f4f6;
  --text-dim: #9ca3af;
  --accent-jade: #10b981;
  --accent-gold: #f59e0b;
  --accent-red: #ef4444;
  --bg-deep: #020617;
  --hover-bg: rgba(255, 255, 255, 0.05);
}

.wuxia-theme {
  display: flex;
  min-height: 100vh;
  background-color: #000;
  color: var(--text-main);
  font-family: "Noto Serif TC", serif;
  overflow: hidden;
}

.ink-bg-layer {
  position: fixed;
  inset: 0;
  z-index: 0;
  background-color: var(--bg-deep);
}

.mountain-bg {
  position: absolute;
  inset: 0;
  background-image: url("@/assets/Background/b_doanhtrai.png");
  background-size: cover;
  filter: sepia(20%) grayscale(40%) brightness(0.4);
  opacity: 0.6;
}

.fog-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to right,
    rgba(17, 24, 39, 0.95),
    rgba(17, 24, 39, 0.4)
  );
  pointer-events: none;
}

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: var(--sidebar-width);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  transition: width 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  background: var(--sidebar-bg);
  border-right: 1px solid var(--sidebar-border);
  box-shadow: 10px 0 30px rgba(0, 0, 0, 0.5);
}

.logo-area {
  height: 80px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid var(--sidebar-border);
  gap: 15px;
  background: rgba(0, 0, 0, 0.2);
}

.logo-seal {
  width: 40px;
  height: 40px;
  background: var(--accent-jade);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 15px rgba(16, 185, 129, 0.4);
  flex-shrink: 0;
  transform: rotate(45deg);
}

.seal-char {
  color: #064e3b;
  font-family: "Cinzel", serif;
  font-size: 1.5em;
  font-weight: 900;
  transform: rotate(-45deg);
}

.logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1;
  overflow: hidden;
  white-space: nowrap;
}

.logo-text .main {
  font-family: "Cinzel", serif;
  font-size: 1.4em;
  font-weight: 700;
  color: #fff;
  letter-spacing: 1px;
}

.logo-text .sub {
  font-family: "Orbitron", sans-serif;
  font-size: 0.7em;
  color: var(--accent-jade);
  letter-spacing: 2px;
  margin-top: 2px;
}

.nav-links {
  flex: 1;
  padding: 20px 10px;
  overflow-y: auto;
  overflow-x: hidden;
}

.nav-group-label {
  padding: 15px 15px 5px;
  font-size: 0.7em;
  color: var(--text-dim);
  font-weight: bold;
  letter-spacing: 1px;
  margin-bottom: 5px;
  font-family: "Cinzel", serif;
  white-space: nowrap;
}

.nav-group-label.admin {
  color: var(--accent-red);
}

.nav-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px 15px;
  color: var(--text-dim);
  text-decoration: none;
  margin-bottom: 5px;
  border-radius: 6px;
  transition: 0.3s;
}

.nav-icon {
  width: 24px;
  text-align: center;
  font-size: 1.2em;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  transition: transform 0.3s;
}

.nav-label {
  font-weight: 600;
  white-space: nowrap;
  font-size: 0.95em;
}

.active-glow {
  position: absolute;
  left: 0;
  top: 10%;
  bottom: 10%;
  width: 3px;
  background: var(--accent-jade);
  border-radius: 0 4px 4px 0;
  transform: scaleY(0);
  transition: 0.3s;
  box-shadow: 2px 0 8px var(--accent-jade);
}

.nav-item:hover {
  background: var(--hover-bg);
  color: #fff;
}

.nav-item:hover .nav-icon {
  transform: scale(1.1);
  color: #fff;
}

.nav-item.router-link-active {
  background: rgba(16, 185, 129, 0.1);
  color: var(--accent-jade);
}

.nav-item.router-link-active .nav-icon {
  color: var(--accent-jade);
}

.nav-item.router-link-active .active-glow {
  transform: scaleY(1);
}

.admin-link.router-link-active {
  color: var(--accent-red);
  background: rgba(239, 68, 68, 0.1);
}

.admin-link.router-link-active .nav-icon {
  color: var(--accent-red);
}

.admin-link.router-link-active .active-glow {
  background: var(--accent-red);
  box-shadow: 2px 0 8px var(--accent-red);
}

.sidebar-footer {
  padding: 15px;
  border-top: 1px solid var(--sidebar-border);
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: rgba(0, 0, 0, 0.2);
}

.control-btn {
  background: var(--hover-bg);
  border: 1px solid var(--sidebar-border);
  color: var(--text-dim);
  padding: 10px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: 0.3s;
  font-family: "Noto Serif TC";
  font-weight: bold;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border-color: #fff;
}

.logout:hover {
  border-color: var(--accent-red);
  color: var(--accent-red);
  background: rgba(239, 68, 68, 0.1);
}

.btn-text {
  white-space: nowrap;
}

.content-wrapper {
  flex: 1;
  margin-left: var(--sidebar-width);
  transition: margin-left 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
  height: 100vh;
}

.ornamental-frame {
  position: absolute;
  inset: 15px;
  pointer-events: none;
  z-index: 50;
  border: 1px solid rgba(16, 185, 129, 0.2);
  box-shadow: inset 0 0 50px rgba(0, 0, 0, 0.5);
}

.corner {
  position: absolute;
  width: 30px;
  height: 30px;
  border: 2px solid var(--accent-jade);
  transition: 0.3s;
  box-shadow: 0 0 10px rgba(16, 185, 129, 0.4);
}

.top-left {
  top: 0;
  left: 0;
  border-right: none;
  border-bottom: none;
}

.top-right {
  top: 0;
  right: 0;
  border-left: none;
  border-bottom: none;
}

.bottom-left {
  bottom: 0;
  left: 0;
  border-right: none;
  border-top: none;
}

.bottom-right {
  bottom: 0;
  right: 0;
  border-left: none;
  border-top: none;
}

.border-decor {
  position: absolute;
  top: 50%;
  width: 2px;
  height: 100px;
  background: linear-gradient(
    to bottom,
    transparent,
    var(--accent-gold),
    transparent
  );
  transform: translateY(-50%);
  opacity: 0.8;
  box-shadow: 0 0 10px var(--accent-gold);
}

.border-decor.left {
  left: 0;
}

.border-decor.right {
  right: 0;
}

.main-view {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
}

.page-body {
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
}

.custom-scroll::-webkit-scrollbar {
  width: 5px;
}

.custom-scroll::-webkit-scrollbar-thumb {
  background: var(--sidebar-border);
  border-radius: 3px;
}

.custom-scroll::-webkit-scrollbar-track {
  background: transparent;
}

@media (max-width: 768px) {
  .ornamental-frame {
    inset: 5px;
  }
}
</style>
