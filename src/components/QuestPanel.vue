<template>
  <div class="quest-panel">
    <div v-if="questStore.isLoading" class="state-msg">
      <i class="fas fa-circle-notch fa-spin"></i> ĐANG CẬP NHẬT CÁO THỊ...
    </div>

    <div v-else class="quest-list custom-scroll">
      <div v-if="questStore.quests.length === 0" class="state-msg empty">
        HIỆN TẠI KHÔNG CÓ CÁO THỊ MỚI
      </div>

      <div
        v-for="q in questStore.quests"
        :key="q.id"
        class="mission-card"
        :class="{
          ready: !q.isClaimed && q.progress >= q.target,
          done: q.isClaimed,
        }"
      >
        <div class="mission-content">
          <div class="m-desc">
            <span class="bullet">❖</span> {{ q.description }}
          </div>

          <div class="m-progress-wrap">
            <div class="progress-bar">
              <div
                class="fill"
                :class="{ 'fill-ready': q.progress >= q.target }"
                :style="{
                  width: Math.min((q.progress / q.target) * 100, 100) + '%',
                }"
              ></div>
            </div>
            <div class="progress-nums">{{ q.progress }} / {{ q.target }}</div>
          </div>
        </div>

        <div class="mission-action">
          <button
            v-if="!q.isClaimed && q.progress >= q.target"
            class="btn-claim-seal"
            @click="questStore.claim(q.id)"
          >
            <span class="btn-text">LĨNH THƯỞNG</span>
            <span class="gold-val">{{ q.rewardGold }} Lượng</span>
          </button>

          <div v-else-if="q.isClaimed" class="stamp-done">ĐÃ NHẬN</div>

          <div v-else class="reward-preview">
            <i class="fas fa-coins"></i> {{ q.rewardGold }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useQuestStore } from "../stores/questStore";

const questStore = useQuestStore();

onMounted(() => {
  questStore.fetchQuests();
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Cinzel:wght@400;700&display=swap");

/* --- CONTAINER --- */
.quest-panel {
  width: 100%;
  height: 100%;
  font-family: "Playfair Display", serif;
  color: #3e2723;
  padding-right: 5px; /* Chừa chỗ cho scrollbar */
}

/* --- STATE MESSAGES --- */
.state-msg {
  text-align: center;
  color: #8d6e63;
  font-size: 0.9em;
  padding: 20px 0;
  font-family: "Cinzel", serif;
  font-weight: bold;
}
.state-msg.empty {
  color: #5d4037;
  font-style: italic;
}

/* --- LIST --- */
.quest-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;
  overflow-y: auto;
}

/* --- CARD NHIỆM VỤ --- */
.mission-card {
  background: transparent;
  border-bottom: 1px dashed rgba(62, 39, 35, 0.3); /* Dòng kẻ mờ */
  padding: 10px 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: 0.3s;
}

.mission-card:hover {
  background: rgba(62, 39, 35, 0.05); /* Hiệu ứng hover nhẹ */
}

/* Status Styles */
.mission-card.ready {
  background: rgba(251, 192, 45, 0.1); /* Vàng nhạt */
  border-bottom: 1px solid #fbc02d;
}
.mission-card.done {
  opacity: 0.6;
  filter: grayscale(0.5);
}

/* --- LEFT CONTENT --- */
.mission-content {
  flex: 1;
  margin-right: 15px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.m-desc {
  font-size: 0.95em;
  color: #2c1810; /* Mực đậm */
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 8px;
}
.bullet {
  color: #8d6e63;
  font-size: 0.8em;
}
.ready .bullet {
  color: #b71c1c; /* Đỏ khi xong */
}

/* Progress Bar */
.m-progress-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.8em;
  color: #5d4037;
  font-family: "Cinzel";
}
.progress-bar {
  flex: 1;
  height: 6px;
  background: #d7ccc8; /* Giấy tối màu */
  border-radius: 3px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.1);
}
.fill {
  height: 100%;
  background: #5d4037; /* Màu nâu gỗ */
  transition: width 0.5s ease;
}
.fill-ready {
  background: #b71c1c; /* Đỏ chu sa khi đầy */
}

/* --- RIGHT ACTION --- */
.mission-action {
  min-width: 90px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

/* 1. NÚT NHẬN (Style thẻ bài/con dấu) */
.btn-claim-seal {
  background: #b71c1c; /* Đỏ */
  border: 2px solid #8a1c1c;
  color: #fff;
  padding: 6px 12px;
  cursor: pointer;
  border-radius: 4px;
  font-family: "Cinzel", serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
  animation: pulse 2s infinite;
}
.btn-claim-seal:hover {
  background: #d32f2f;
  transform: translateY(-2px);
}
.btn-text {
  font-weight: bold;
  font-size: 0.8em;
}
.gold-val {
  font-size: 0.7em;
  color: #fbc02d; /* Vàng kim */
}

/* 2. CON DẤU ĐÃ NHẬN */
.stamp-done {
  border: 2px solid #8d6e63;
  color: #8d6e63;
  font-size: 0.7em;
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 4px;
  transform: rotate(-10deg); /* Nghiêng giống đóng dấu */
  font-family: "Cinzel";
  opacity: 0.8;
}

/* 3. PREVIEW PHẦN THƯỞNG */
.reward-preview {
  font-size: 0.9em;
  color: #f57f17; /* Cam đậm */
  font-weight: bold;
  font-family: "Cinzel";
  display: flex;
  align-items: center;
  gap: 5px;
}

/* ANIMATION */
@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(183, 28, 28, 0.4);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 6px rgba(183, 28, 28, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(183, 28, 28, 0);
  }
}

/* SCROLLBAR */
.custom-scroll::-webkit-scrollbar {
  width: 5px;
}
.custom-scroll::-webkit-scrollbar-thumb {
  background: #8d6e63;
  border-radius: 3px;
}
.custom-scroll::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
}
</style>
