<template>
  <div class="page-container wuxia-noti">
    <div class="ink-bg-layer">
      <div class="mountain-bg"></div>
      <div class="fog-overlay"></div>
    </div>

    <div class="noti-layout">
      <div class="noti-header">
        <div class="header-left">
          <button @click="$router.push('/')" class="btn-wood-back">
            <i class="fas fa-chevron-left"></i> QUAY LẠI
          </button>
          <div class="title-box">
            <h2 class="title-ink">MẬT THƯ</h2>
            <div class="subtitle">Tin tức chốn giang hồ</div>
          </div>
        </div>

        <button @click="notiStore.markAllRead()" class="btn-seal">
          <i class="fas fa-check-double"></i> ĐÃ ĐỌC HẾT
        </button>
      </div>

      <div v-if="notiStore.isLoading" class="loading-state">
        <div class="ink-spinner"></div>
        <span>Đang bóc tem thư...</span>
      </div>

      <div v-else class="noti-feed custom-scroll">
        <transition-group name="list">
          <div
            v-for="noti in notiStore.notifications"
            :key="noti.id"
            class="bamboo-card"
            :class="[getTypeClass(noti.type), { unread: !noti.isRead }]"
            @click="openPopup(noti)"
          >
            <div v-if="!noti.isRead" class="unread-dot"></div>

            <div class="log-icon">
              <i :class="getIcon(noti.type)"></i>
            </div>

            <div class="log-content">
              <div class="log-top">
                <span class="log-title">{{ noti.title }}</span>
                <span v-if="!noti.isRead" class="seal-new">MỚI</span>
              </div>
              <div class="log-preview">{{ noti.message }}</div>
              <div class="log-time">
                <i class="far fa-clock"></i>
                {{ new Date(noti.createdAt).toLocaleString() }}
              </div>
            </div>

            <div class="wood-texture"></div>
          </div>
        </transition-group>

        <div v-if="notiStore.notifications.length === 0" class="empty-state">
          <i class="fas fa-wind"></i>
          <p>Gió lặng mây ngừng, không có tin mới.</p>
        </div>
      </div>
    </div>

    <transition name="zoom">
      <div
        v-if="selectedNoti"
        class="overlay-modal"
        @click.self="selectedNoti = null"
      >
        <div class="scroll-modal">
          <div class="scroll-rod top"></div>

          <div class="scroll-paper custom-scroll">
            <div class="paper-header" :class="getTypeClass(selectedNoti.type)">
              <span>{{ getHeaderTitle(selectedNoti.type) }}</span>
              <button @click="selectedNoti = null" class="btn-close">✕</button>
            </div>

            <div class="paper-body">
              <h3 class="msg-title">{{ selectedNoti.title }}</h3>
              <div class="ink-divider"></div>
              <p class="msg-content">{{ selectedNoti.message }}</p>

              <div class="msg-seal-area">
                <div class="msg-meta">
                  <span>Nguồn: Hệ Thống</span>
                  <span
                    >Thời khắc:
                    {{
                      new Date(selectedNoti.createdAt).toLocaleString()
                    }}</span
                  >
                </div>
                <div class="red-stamp">ĐÃ DUYỆT</div>
              </div>
            </div>
          </div>

          <div class="scroll-rod bot"></div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useNotificationStore } from "../stores/notificationStore";

const notiStore = useNotificationStore();
const selectedNoti = ref(null);

const openPopup = (noti) => {
  selectedNoti.value = noti;
  notiStore.markRead(noti.id);
};

const getTypeClass = (type) => {
  switch (type) {
    case "SUCCESS":
      return "type-success";
    case "WARNING":
      return "type-warning";
    case "ERROR":
      return "type-error";
    default:
      return "type-info";
  }
};

const getHeaderTitle = (type) => {
  switch (type) {
    case "SUCCESS":
      return "CÁO THỊ: TIN MỪNG";
    case "WARNING":
      return "CÁO THỊ: CẢNH BÁO";
    case "ERROR":
      return "CÁO THỊ: KHẨN CẤP";
    default:
      return "MẬT THƯ";
  }
};

const getIcon = (type) => {
  switch (type) {
    case "SUCCESS":
      return "fas fa-gift";
    case "WARNING":
      return "fas fa-exclamation-circle";
    case "ERROR":
      return "fas fa-skull-crossbones";
    default:
      return "fas fa-scroll";
  }
};

onMounted(() => {
  // MOCK: Fetch Notifications
  notiStore.fetchNotifications();
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Noto+Serif+TC:wght@500;700;900&display=swap");

/* --- PALETTE --- */
:root {
  --wood-dark: #3e2723;
  --wood-light: #5d4037;
  --paper: #fff8e1;
  --text-ink: #212121;
  --jade: #10b981;
  --gold: #f59e0b;
  --red-seal: #b71c1c;
}

/* --- BASE --- */
.wuxia-noti {
  background: #0f172a;
  min-height: 100vh;
  font-family: "Noto Serif TC", serif;
  color: #fff;
  position: relative;
  overflow: hidden;
}

/* Backgrounds */
.ink-bg-layer {
  position: absolute;
  inset: 0;
  z-index: 0;
}
.mountain-bg {
  position: absolute;
  inset: 0;
  background-image: url("https://images.unsplash.com/photo-1518182170546-0766ce6fec56?q=80&w=2000&auto=format&fit=crop");
  background-size: cover;
  filter: sepia(30%) grayscale(50%) brightness(0.4);
  opacity: 0.6;
}
.fog-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(15, 23, 42, 0.8),
    rgba(15, 23, 42, 0.4)
  );
}

.noti-layout {
  position: relative;
  z-index: 10;
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  height: 100vh;
}

/* --- HEADER --- */
.noti-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 25px;
  border-bottom: 2px solid var(--wood-light);
  padding-bottom: 15px;
  background: rgba(0, 0, 0, 0.3);
  padding: 20px;
  border-radius: 8px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.btn-wood-back {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid var(--jade);
  color: var(--jade);
  padding: 8px 15px;
  cursor: pointer;
  font-family: "Noto Serif TC";
  font-weight: bold;
  border-radius: 4px;
  transition: 0.3s;
}
.btn-wood-back:hover {
  background: var(--jade);
  color: #000;
}

.title-ink {
  font-size: 2em;
  color: #fff;
  margin: 0;
  font-weight: 900;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}
.subtitle {
  font-size: 0.9em;
  color: #9ca3af;
  font-style: italic;
}

.btn-seal {
  background: var(--red-seal);
  border: 1px solid #e57373;
  color: #fff;
  padding: 8px 20px;
  cursor: pointer;
  font-weight: bold;
  font-family: "Noto Serif TC";
  border-radius: 4px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  transition: 0.3s;
}
.btn-seal:hover {
  background: #d32f2f;
  transform: translateY(-2px);
}

/* --- FEED & CARDS (BAMBOO SLATS) --- */
.noti-feed {
  flex: 1;
  overflow-y: auto;
  padding-right: 5px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.bamboo-card {
  position: relative;
  background: #e3d5b8; /* Màu tre/giấy cũ */
  border-left: 6px solid var(--wood-dark);
  padding: 15px 20px;
  display: flex;
  gap: 15px;
  cursor: pointer;
  transition: 0.3s;
  color: var(--wood-dark);
  border-radius: 2px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.bamboo-card:hover {
  transform: translateX(8px);
  background: #fff8e1;
}

/* Unread Indicator */
.bamboo-card.unread {
  background: #fffde7;
  border-left-color: var(--red-seal);
}
.unread-dot {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 8px;
  height: 8px;
  background: var(--red-seal);
  border-radius: 50%;
  box-shadow: 0 0 5px var(--red-seal);
}

/* Icons */
.log-icon {
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5em;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 50%;
  border: 2px solid rgba(0, 0, 0, 0.1);
}
.type-success .log-icon {
  color: #2e7d32;
  border-color: #2e7d32;
}
.type-warning .log-icon {
  color: #f57f17;
  border-color: #f57f17;
}
.type-error .log-icon {
  color: #c62828;
  border-color: #c62828;
}
.type-info .log-icon {
  color: #1565c0;
  border-color: #1565c0;
}

/* Content */
.log-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.log-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.log-title {
  font-weight: 900;
  font-size: 1.1em;
  color: #212121;
}
.seal-new {
  background: var(--red-seal);
  color: #fff;
  font-size: 0.7em;
  padding: 1px 5px;
  border-radius: 2px;
  font-weight: bold;
}
.log-preview {
  font-size: 0.95em;
  color: #5d4037;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 500px;
}
.log-time {
  font-size: 0.8em;
  color: #8d6e63;
  font-style: italic;
}

/* Wood Texture Overlay */
.wood-texture {
  position: absolute;
  inset: 0;
  background-image: repeating-linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.02) 0,
    rgba(0, 0, 0, 0.02) 1px,
    transparent 1px,
    transparent 10px
  );
  pointer-events: none;
}

/* --- MODAL (CUỘN GIẤY) --- */
.overlay-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  backdrop-filter: blur(5px);
}

.scroll-modal {
  width: 550px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

.scroll-rod {
  height: 20px;
  background: var(--wood-dark);
  border-radius: 10px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.5);
  z-index: 2;
  position: relative;
}
.scroll-rod::after {
  /* Nút vàng ở đầu trục */
  content: "";
  position: absolute;
  right: 10px;
  top: 2px;
  bottom: 2px;
  width: 40px;
  background: var(--gold);
  border-radius: 2px;
  opacity: 0.3;
}

.scroll-paper {
  background: var(--paper);
  padding: 30px 40px;
  color: var(--text-ink);
  overflow-y: auto;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
  /* Vân giấy */
  background-image: url("https://www.transparenttextures.com/patterns/aged-paper.png");
}

.paper-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px double #a1887f;
  color: var(--red-seal);
}
.btn-close {
  background: none;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
  color: #5d4037;
}
.btn-close:hover {
  color: var(--red-seal);
}

.msg-title {
  font-size: 1.8em;
  margin: 0;
  color: #000;
  text-align: center;
  font-family: "Playfair Display", serif;
}
.ink-divider {
  height: 2px;
  background: #000;
  margin: 20px auto;
  width: 50%;
  border-radius: 50%;
  opacity: 0.2;
}
.msg-content {
  font-size: 1.1em;
  line-height: 1.8;
  text-align: justify;
}

.msg-seal-area {
  margin-top: 40px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  position: relative;
}
.msg-meta {
  display: flex;
  flex-direction: column;
  font-size: 0.8em;
  color: #5d4037;
  font-style: italic;
}
.red-stamp {
  border: 3px solid var(--red-seal);
  color: var(--red-seal);
  font-weight: 900;
  padding: 5px 10px;
  font-size: 1.2em;
  transform: rotate(-15deg);
  opacity: 0.8;
  border-radius: 4px;
}

/* LOADING & EMPTY */
.loading-state,
.empty-state {
  text-align: center;
  padding: 60px;
  color: #9ca3af;
}
.ink-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--jade);
  border-top-color: transparent;
  border-radius: 50%;
  margin: 0 auto 15px;
  animation: spin 1s linear infinite;
}
.empty-state i {
  font-size: 3em;
  margin-bottom: 15px;
  opacity: 0.5;
}

/* ANIMATION */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
.zoom-enter-active,
.zoom-leave-active {
  transition: all 0.3s ease;
}
.zoom-enter-from,
.zoom-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* SCROLLBAR */
.custom-scroll::-webkit-scrollbar {
  width: 6px;
}
.custom-scroll::-webkit-scrollbar-thumb {
  background: #a1887f;
  border-radius: 3px;
}
</style>
