<template>
  <div class="page-container battle-page">
    <div class="battle-container" v-if="battleStore.enemy">
      <transition name="bounce">
        <div v-if="battleStore.status === 'VICTORY'" class="levelup-popup">
          🎉 CHIẾN THẮNG! +{{ battleStore.expEarned }} EXP
        </div>
      </transition>

      <div
        class="combat-log-text"
        :class="{
          'text-red': battleStore.status === 'DEFEAT',
          'text-green': battleStore.status === 'VICTORY',
        }"
      >
        {{ lastLog }}
      </div>

      <div class="battlefield">
        <div class="fighter enemy" :class="{ hit: isEnemyHit }">
          <div class="avatar-box">
            <img :src="enemyImage" class="fighter-img" />
          </div>
          <div class="name">
            {{ battleStore.enemy.name }} (Lv.{{ battleStore.enemy.level }})
          </div>
          <div class="hp-bar-frame">
            <div
              class="hp-bar red"
              :style="{ width: enemyHpPercent + '%' }"
            ></div>
          </div>
          <div class="hp-text">
            {{ battleStore.enemyHp }} / {{ battleStore.enemyMaxHp }}
          </div>
        </div>

        <div class="vs">VS</div>

        <div class="fighter player" :class="{ hit: isPlayerHit }">
          <div class="avatar-box">
            <img :src="playerImage" class="fighter-img" />
          </div>
          <div class="name">{{ authStore.user?.username || "Bạn" }}</div>
          <div class="hp-bar-frame">
            <div
              class="hp-bar green"
              :style="{ width: playerHpPercent + '%' }"
            ></div>
          </div>
          <div class="hp-text">
            {{ charStore.character?.hp || 0 }} /
            {{ charStore.character?.maxHp || 0 }}
          </div>

          <div class="energy text-yellow">
            ⚡ {{ charStore.character?.energy || 0 }}
          </div>
          <div v-if="nextAttackBuffed" class="buff-status">🔥 Đã Tụ Lực</div>
        </div>
      </div>

      <div class="controls">
        <div v-if="battleStore.status === 'ONGOING'">
          <div class="auto-label">🤖 ĐANG TỰ ĐỘNG ĐÁNH...</div>

          <button
            class="btn-action skill"
            @click="activateBuff"
            :disabled="
              nextAttackBuffed || (charStore.character?.energy || 0) < 5
            "
          >
            <span v-if="!nextAttackBuffed">🔥 TỤ LỰC (5⚡)</span>
            <span v-else>ĐÃ SẴN SÀNG</span>
          </button>
        </div>

        <div v-else class="result-actions">
          <button class="btn-back" @click="$router.push('/explore')">
            🌲 Quay lại rừng
          </button>
          <button class="btn-back" @click="$router.push('/village')">
            🏘️ Về làng
          </button>
        </div>
      </div>
    </div>
    <div v-else class="loading">Đang tìm đối thủ...</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useBattleStore } from "@/stores/battleStore";
import { useCharacterStore } from "@/stores/characterStore";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";
import { getEnemyImage, getCurrentSkin } from "@/utils/assetHelper";

const battleStore = useBattleStore();
const charStore = useCharacterStore();
const authStore = useAuthStore();
const router = useRouter();

const isPlayerHit = ref(false);
const isEnemyHit = ref(false);
const nextAttackBuffed = ref(false);
let autoInterval = null;

const enemyHpPercent = computed(
  () => (battleStore.enemyHp / (battleStore.enemyMaxHp || 1)) * 100
);
const playerHpPercent = computed(
  () =>
    ((charStore.character?.hp || 0) / (charStore.character?.maxHp || 1)) * 100
);

const lastLog = computed(() => {
  if (!battleStore.combatLogs.length) return "...";
  return battleStore.combatLogs[battleStore.combatLogs.length - 1].replace(
    /<[^>]*>/g,
    ""
  );
});

// [LOGIC ẢNH QUÁI] Lấy từ battleStore.enemyVisual nếu có (để khớp với Explore)
const enemyImage = computed(() => {
  if (battleStore.enemyVisual) return battleStore.enemyVisual.img;
  return getEnemyImage(battleStore.enemy?.name);
});

// [LOGIC ẢNH PLAYER] Lấy theo Skin đã chọn trong Profile (State Idle)
const playerImage = computed(() => {
  const skin = getCurrentSkin(authStore.user?.avatarUrl);
  // MOCK: Dùng hình tấn công khi đang đánh
  if (battleStore.status === "ONGOING" && isPlayerHit.value)
    return skin.sprites.attack;
  return skin.sprites.idle;
});

const activateBuff = () => {
  if ((charStore.character?.energy || 0) >= 5) {
    charStore.character.energy = charStore.character.energy - 5;
    nextAttackBuffed.value = true;
  }
};

const runAutoBattle = async () => {
  if (battleStore.status !== "ONGOING") {
    clearInterval(autoInterval);
    return;
  }

  const result = await battleStore.autoTurn(nextAttackBuffed.value);
  if (nextAttackBuffed.value) nextAttackBuffed.value = false;

  if (result) {
    // Hiệu ứng Quái bị đánh
    isEnemyHit.value = true;
    setTimeout(() => (isEnemyHit.value = false), 200);

    // Hiệu ứng Người chơi bị đánh
    setTimeout(() => {
      if (battleStore.status === "ONGOING") {
        isPlayerHit.value = true;
        setTimeout(() => (isPlayerHit.value = false), 200);
      }
    }, 500);
  }
};

onMounted(async () => {
  await charStore.fetchCharacter();

  if (battleStore.status === "IDLE" && !battleStore.enemy) {
    await battleStore.startBattle();
  } else if (
    battleStore.enemy &&
    battleStore.status !== "VICTORY" &&
    battleStore.status !== "DEFEAT"
  ) {
    battleStore.status = "ONGOING"; // Khôi phục trạng thái
  }

  if (battleStore.status === "ONGOING") {
    autoInterval = setInterval(runAutoBattle, 1500);
  }
});

onUnmounted(() => clearInterval(autoInterval));
</script>

<style scoped>
/* CSS giữ nguyên từ file cũ của bạn */
.battle-page {
  background: #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.combat-container {
  background: #261815;
  border: 4px solid #5d4037;
  padding: 20px;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  position: relative;
  color: #eee;
  font-family: "Noto Serif TC";
}

.combat-log-text {
  text-align: center;
  font-weight: bold;
  margin-bottom: 20px;
  min-height: 24px;
  color: #fbc02d;
}

.text-red {
  color: #ef5350;
}

.text-green {
  color: #66bb6a;
}

.battlefield {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 0 10px;
}

.fighter {
  width: 40%;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: 0.2s;
}

.fighter.hit {
  animation: shake 0.3s;
  filter: brightness(2) sepia(1) hue-rotate(-50deg);
}

.avatar-box {
  width: 100px;
  height: 100px;
  border: 3px solid #8d6e63;
  border-radius: 50%;
  overflow: hidden;
  background: #000;
  margin-bottom: 10px;
}

.fighter-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.hp-bar-frame {
  width: 100%;
  height: 10px;
  background: #4e342e;
  border-radius: 5px;
  overflow: hidden;
  margin-top: 5px;
  border: 1px solid #333;
}

.hp-bar {
  height: 100%;
  transition: width 0.3s;
}

.red {
  background: #e53935;
}

.green {
  background: #43a047;
}

.vs {
  font-size: 2em;
  font-weight: 900;
  color: #8d6e63;
  font-family: "Cinzel";
}

.controls {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: center;
}

.auto-label {
  color: #aaa;
  font-style: italic;
  margin-bottom: 10px;
  animation: blink 1.5s infinite;
}

@keyframes blink {
  50% {
    opacity: 0.5;
  }
}

.btn-action {
  padding: 12px 30px;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  font-family: "Noto Serif TC";
  color: #fff;
  transition: 0.2s;
  width: 100%;
  max-width: 200px;
}

.skill {
  background: #fbc02d;
  color: #000;
  border-bottom: 4px solid #c49000;
}

.btn-action:disabled {
  background: #555;
  border-bottom-color: #333;
  cursor: not-allowed;
  color: #aaa;
}

.result-actions {
  display: flex;
  gap: 10px;
}

.btn-back {
  background: #5d4037;
  color: #fff;
  padding: 10px 20px;
  border: 2px solid #3e2723;
  cursor: pointer;
  font-weight: bold;
}

.buff-status {
  color: #ff5722;
  font-weight: bold;
  margin-top: 5px;
  text-shadow: 0 0 5px #ff5722;
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }

  25% {
    transform: translateX(-5px);
  }

  75% {
    transform: translateX(5px);
  }
}

.levelup-popup {
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(45deg, #ffd700, #ff6f00);
  color: #fff;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: bold;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
  animation: floatUp 2s forwards;
  z-index: 100;
}

@keyframes floatUp {
  0% {
    opacity: 0;
    transform: translate(-50%, 20px);
  }

  20% {
    opacity: 1;
    transform: translate(-50%, 0);
  }

  100% {
    opacity: 0;
    transform: translate(-50%, -30px);
  }
}
</style>
