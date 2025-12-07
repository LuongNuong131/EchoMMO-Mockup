<template>
  <div class="page-container wuxia-leaderboard">
    <div class="ink-bg-layer">
      <div class="mountain-bg"></div>
      <div class="fog-overlay"></div>
    </div>

    <div class="lb-wrapper">
      <div class="lb-header">
        <h2 class="title-main">BẢNG VÀNG</h2>
        <div class="subtitle">Thiên hạ đệ nhất nhân</div>

        <div class="wuxia-tabs">
          <button
            :class="{ active: activeTab === 'level' }"
            @click="switchTab('level')"
            class="tab-btn"
          >
            <i class="fas fa-fist-raised"></i> CAO THỦ
          </button>
          <button
            :class="{ active: activeTab === 'wealth' }"
            @click="switchTab('wealth')"
            class="tab-btn"
          >
            <i class="fas fa-coins"></i> PHÚ HỘ
          </button>
        </div>
      </div>

      <div v-if="lbStore.isLoading" class="loading-state">
        <div class="ink-spinner"></div>
        <span>Đang tra cứu danh sách...</span>
      </div>

      <div v-else class="content-area">
        <div class="podium-section" v-if="currentList.length > 0">
          <div class="podium-col rank-2" v-if="currentList[1]">
            <div class="avatar-group">
              <div class="rank-badge silver">NHÌ</div>
              <div class="avatar-frame silver-border">
                <span class="char-emoji">{{
                  currentList[1].avatar || "👤"
                }}</span>
              </div>
            </div>
            <div class="podium-base silver-base">
              <div class="p-name">{{ currentList[1].name }}</div>
              <div class="p-val">{{ formatVal(currentList[1].value) }}</div>
            </div>
          </div>

          <div class="podium-col rank-1" v-if="currentList[0]">
            <div class="avatar-group">
              <div class="crown-icon"><i class="fas fa-crown"></i></div>
              <div class="avatar-frame gold-border">
                <span class="char-emoji">{{
                  currentList[0].avatar || "🐲"
                }}</span>
              </div>
              <div class="radiance"></div>
            </div>
            <div class="podium-base gold-base">
              <div class="rank-label">MINH CHỦ</div>
              <div class="p-name main-name">{{ currentList[0].name }}</div>
              <div class="p-val highlight">
                {{ formatVal(currentList[0].value) }}
              </div>
            </div>
          </div>

          <div class="podium-col rank-3" v-if="currentList[2]">
            <div class="avatar-group">
              <div class="rank-badge bronze">BA</div>
              <div class="avatar-frame bronze-border">
                <span class="char-emoji">{{
                  currentList[2].avatar || "👤"
                }}</span>
              </div>
            </div>
            <div class="podium-base bronze-base">
              <div class="p-name">{{ currentList[2].name }}</div>
              <div class="p-val">{{ formatVal(currentList[2].value) }}</div>
            </div>
          </div>
        </div>

        <div class="rank-scroll custom-scroll">
          <div
            v-for="(entry, index) in rankedRestOfList"
            :key="entry.name"
            class="list-row"
            :style="{ animationDelay: index * 0.05 + 's' }"
          >
            <div class="row-rank">{{ entry.rank }}</div>
            <div class="row-avatar">{{ entry.avatar || "👾" }}</div>
            <div class="row-info">
              <div class="row-name">{{ entry.name }}</div>
              <div class="ink-bar">
                <div
                  class="fill"
                  :style="{ width: entry.barWidth + '%' }"
                ></div>
              </div>
            </div>
            <div class="row-val">{{ formatVal(entry.value) }}</div>
          </div>

          <div v-if="currentList.length === 0" class="empty-msg">
            _Chưa có ai ghi danh_
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useLeaderboardStore } from "../stores/leaderboardStore";

const activeTab = ref("level");
const lbStore = useLeaderboardStore();

const currentList = computed(() => {
  // Đảm bảo trả về mảng rỗng nếu store chưa có dữ liệu
  const list =
    activeTab.value === "level" ? lbStore.topLevels : lbStore.topWealth;
  return list || [];
});

// Tính toán giá trị lớn nhất trong list hiện tại (cho mục đích thanh bar)
const maxVal = computed(() => {
  if (currentList.value.length === 0) return 1;
  // Lấy giá trị 'value' của người hạng 1
  return currentList.value[0].value;
});

// Tính toán danh sách còn lại với Rank và Bar Width đã được chuẩn hóa
const rankedRestOfList = computed(() => {
  const list = currentList.value.slice(3);
  const max = maxVal.value;

  return list.map((entry, index) => ({
    ...entry,
    // Rank bắt đầu từ 4 (index 0 của list này là rank 4)
    rank: index + 4,
    // Tính toán chiều rộng thanh bar (chuẩn hóa dựa trên maxVal)
    barWidth: max > 0 ? (entry.value / max) * 100 : 0,
  }));
});

const formatVal = (val) => {
  if (activeTab.value === "wealth") return Number(val).toLocaleString() + " Xu";
  return "Cảnh giới " + val;
};

const switchTab = async (tab) => {
  activeTab.value = tab;
  if (tab === "level") await lbStore.fetchLevelBoard();
  else await lbStore.fetchWealthBoard();
};

onMounted(() => {
  // MOCK: Load mặc định Level Board
  lbStore.fetchLevelBoard();
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@500;700;900&display=swap");

/* --- PALETTE --- */
:root {
  --bg-deep: #020617;
  --text-main: #f3f4f6;
  --text-dim: #9ca3af;
  --jade: #10b981;
  --gold: #f59e0b;
  --red-seal: #b71c1c;
  --wood-dark: #3e2723;
}

/* --- BASE --- */
.wuxia-leaderboard {
  min-height: 100vh;
  background-color: var(--bg-deep);
  font-family: "Noto Serif TC", serif;
  color: var(--text-main);
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
  filter: sepia(30%) grayscale(60%) brightness(0.3);
  opacity: 0.8;
}
.fog-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(2, 6, 23, 0.8),
    rgba(2, 6, 23, 0.4)
  );
}

.lb-wrapper {
  position: relative;
  z-index: 10;
  max-width: 600px;
  margin: 0 auto;
  padding: 60px 20px 20px;
  display: flex;
  flex-direction: column;
  height: 100vh;
}

/* --- HEADER --- */
.lb-header {
  text-align: center;
  margin-bottom: 20px;
}
.title-main {
  font-size: 2.5em;
  font-weight: 900;
  color: #fff;
  text-shadow: 0 4px 10px rgba(0, 0, 0, 0.8);
  margin-bottom: 5px;
  letter-spacing: 2px;
}
.subtitle {
  color: var(--jade);
  font-size: 0.9em;
  margin-bottom: 20px;
  font-style: italic;
  letter-spacing: 1px;
}

/* TABS */
.wuxia-tabs {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
}
.tab-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--text-dim);
  color: var(--text-dim);
  padding: 8px 20px;
  font-family: "Noto Serif TC";
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.tab-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}
.tab-btn.active {
  background: var(--red-seal);
  color: #fff;
  border-color: var(--red-seal);
  box-shadow: 0 4px 10px rgba(183, 28, 28, 0.4);
}

/* --- CONTENT --- */
.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* PODIUM (Lôi Đài) */
.podium-section {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  height: 260px;
  margin-bottom: 20px;
  gap: 15px;
}
.podium-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  transition: 0.3s;
}
.podium-col:hover {
  transform: translateY(-5px);
}

.avatar-group {
  position: relative;
  margin-bottom: 10px;
}
.avatar-frame {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8em;
  border: 3px solid;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  position: relative;
  z-index: 2;
}
.rank-1 .avatar-frame {
  width: 90px;
  height: 90px;
  font-size: 3em;
  border-width: 4px;
}

.gold-border {
  border-color: var(--gold);
}
.silver-border {
  border-color: #c0c0c0;
}
.bronze-border {
  border-color: #cd7f32;
}

.crown-icon {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 2em;
  color: var(--gold);
  text-shadow: 0 0 10px var(--gold);
  z-index: 3;
  animation: float 2s infinite ease-in-out;
}
.rank-badge {
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  background: #000;
  color: #fff;
  font-size: 0.7em;
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid;
  z-index: 3;
  font-weight: bold;
}
.silver {
  border-color: #c0c0c0;
}
.bronze {
  border-color: #cd7f32;
}

.podium-base {
  width: 100px;
  text-align: center;
  color: #fff;
  padding: 10px 5px;
  border-radius: 4px 4px 0 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}
.rank-1 .podium-base {
  width: 130px;
  height: 140px;
  background: linear-gradient(
    to bottom,
    rgba(245, 158, 11, 0.2),
    rgba(245, 158, 11, 0.05)
  );
  border-color: var(--gold);
}
.rank-2 .podium-base {
  height: 100px;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0.02)
  );
  border-color: #c0c0c0;
}
.rank-3 .podium-base {
  height: 80px;
  background: linear-gradient(
    to bottom,
    rgba(205, 127, 50, 0.15),
    rgba(205, 127, 50, 0.02)
  );
  border-color: #cd7f32;
}

.p-name {
  font-weight: bold;
  font-size: 0.9em;
  margin-bottom: 2px;
}
.main-name {
  font-size: 1.1em;
  color: var(--gold);
}
.p-val {
  font-size: 0.8em;
  color: var(--text-dim);
}
.highlight {
  color: #fff;
  font-weight: bold;
}
.rank-label {
  font-size: 0.7em;
  color: var(--gold);
  letter-spacing: 2px;
  margin-bottom: auto;
  margin-top: 5px;
}

/* LIST (Thẻ Tre/Gỗ) */
.rank-scroll {
  flex: 1;
  overflow-y: auto;
  padding-right: 5px;
}

.list-row {
  display: flex;
  align-items: center;
  gap: 15px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  margin-bottom: 8px;
  padding: 10px 15px;
  border-radius: 4px;
  transition: 0.2s;
  animation: slideIn 0.4s ease-out forwards;
  opacity: 0;
  transform: translateY(10px);
}
.list-row:hover {
  background: rgba(16, 185, 129, 0.05);
  border-color: var(--jade);
}

.row-rank {
  font-weight: bold;
  font-size: 1.1em;
  color: var(--text-dim);
  width: 30px;
}
.row-avatar {
  font-size: 1.2em;
}
.row-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.row-name {
  font-weight: bold;
  color: #e5e7eb;
}

/* Ink Bar */
.ink-bar {
  width: 100%;
  height: 3px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}
.ink-bar .fill {
  height: 100%;
  background: var(--jade);
  box-shadow: 0 0 5px var(--jade);
  transition: width 0.3s ease; /* Thêm transition cho thanh bar */
}

.row-val {
  font-weight: bold;
  color: var(--gold);
  font-size: 0.9em;
}

/* LOADING & EMPTY */
.loading-state {
  text-align: center;
  padding: 50px;
  color: var(--text-dim);
}
.ink-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--jade);
  border-top-color: transparent;
  border-radius: 50%;
  margin: 0 auto 15px;
  animation: spin 1s linear infinite;
}
.empty-msg {
  text-align: center;
  color: var(--text-dim);
  margin-top: 30px;
  font-style: italic;
}

/* ANIMATION */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
@keyframes float {
  0%,
  100% {
    transform: translateX(-50%) translateY(0);
  }
  50% {
    transform: translateX(-50%) translateY(-5px);
  }
}
@keyframes slideIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* SCROLLBAR */
.custom-scroll::-webkit-scrollbar {
  width: 4px;
}
.custom-scroll::-webkit-scrollbar-thumb {
  background: #334155;
  border-radius: 2px;
}
</style>
