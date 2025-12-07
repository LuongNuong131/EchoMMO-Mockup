<template>
  <div class="page-container inventory-bay ancient-theme">
    <div class="bay-grid">
      <div class="character-panel paper-texture">
        <div class="panel-ornament top-left"></div>
        <div class="panel-ornament top-right"></div>
        <div class="panel-ornament bot-left"></div>
        <div class="panel-ornament bot-right"></div>

        <div class="equip-layout">
          <div class="center-avatar-platform">
            <div class="aura-ring outer"></div>
            <div class="aura-ring inner"></div>

            <div class="char-avatar-img">
              <img :src="userSkinAvatar" class="avatar-img" />
            </div>

            <div class="base-plate"></div>
          </div>

          <div
            class="wood-slot helmet"
            @click="unequip('HELMET')"
            :class="{ filled: equipment.HELMET }"
          >
            <div class="slot-frame">
              <img
                v-if="equipment.HELMET"
                :src="equipment.HELMET.item.imageUrl"
              />
              <i v-else class="fas fa-hard-hat placeholder"></i>
              <div class="glow-effect" v-if="equipment.HELMET"></div>
            </div>
            <div class="slot-label-tag">MŨ</div>
          </div>

          <div
            class="wood-slot weapon"
            @click="unequip('WEAPON')"
            :class="{ filled: equipment.WEAPON }"
          >
            <div class="slot-frame">
              <img
                v-if="equipment.WEAPON"
                :src="equipment.WEAPON.item.imageUrl"
              />
              <i v-else class="fas fa-khanda placeholder"></i>
              <div class="glow-effect" v-if="equipment.WEAPON"></div>
            </div>
            <div class="slot-label-tag">BINH KHÍ</div>
          </div>

          <div
            class="wood-slot armor"
            @click="unequip('ARMOR')"
            :class="{ filled: equipment.ARMOR }"
          >
            <div class="slot-frame">
              <img
                v-if="equipment.ARMOR"
                :src="equipment.ARMOR.item.imageUrl"
              />
              <i v-else class="fas fa-shield-alt placeholder"></i>
              <div class="glow-effect" v-if="equipment.ARMOR"></div>
            </div>
            <div class="slot-label-tag">Y PHỤC</div>
          </div>

          <div
            class="wood-slot boots"
            @click="unequip('BOOTS')"
            :class="{ filled: equipment.BOOTS }"
          >
            <div class="slot-frame">
              <img
                v-if="equipment.BOOTS"
                :src="equipment.BOOTS.item.imageUrl"
              />
              <i v-else class="fas fa-shoe-prints placeholder"></i>
              <div class="glow-effect" v-if="equipment.BOOTS"></div>
            </div>
            <div class="slot-label-tag">GIÀY</div>
          </div>

          <svg class="connection-lines" viewBox="0 0 400 400">
            <line x1="200" y1="60" x2="60" y2="200" class="connector" />
            <line x1="200" y1="60" x2="340" y2="200" class="connector" />
            <line x1="200" y1="340" x2="60" y2="200" class="connector" />
            <line x1="200" y1="340" x2="340" y2="200" class="connector" />
          </svg>
        </div>

        <div class="stats-scroll">
          <div class="stat-header">
            <span class="ornament">❖</span> CHỈ SỐ
            <span class="ornament">❖</span>
          </div>
          <div class="stat-row">
            <span class="stat-name">CÔNG LỰC</span>
            <div class="bar-track">
              <div
                class="bar-fill red"
                :style="{
                  width:
                    Math.min((charStore.character?.baseAtk / 200) * 100, 100) +
                    '%',
                }"
              ></div>
            </div>
            <span class="stat-num">{{ charStore.character?.baseAtk }}</span>
          </div>
          <div class="stat-row">
            <span class="stat-name">PHÒNG THỦ</span>
            <div class="bar-track">
              <div
                class="bar-fill blue"
                :style="{
                  width:
                    Math.min((charStore.character?.baseDef / 200) * 100, 100) +
                    '%',
                }"
              ></div>
            </div>
            <span class="stat-num">{{ charStore.character?.baseDef }}</span>
          </div>
        </div>
      </div>

      <div class="bag-section wood-border">
        <div class="bag-header">
          <div class="tab-group">
            <button
              :class="{ active: filter === 'ALL' }"
              @click="filter = 'ALL'"
            >
              TẤT CẢ
            </button>
            <button
              :class="{ active: filter === 'EQUIP' }"
              @click="filter = 'EQUIP'"
            >
              TRANG BỊ
            </button>
            <button
              :class="{ active: filter === 'MAT' }"
              @click="filter = 'MAT'"
            >
              VẬT PHẨM
            </button>
          </div>
          <div class="capacity">
            TÚI: {{ inventoryStore.items.length }} / 50
          </div>
        </div>

        <div class="grid-container custom-scroll">
          <div
            v-for="u in filteredItems"
            :key="u.userItemId"
            class="grid-item"
            @click="selectedItem = u"
            :class="[
              'rarity-' + u.item.rarity,
              {
                selected: selectedItem?.userItemId === u.userItemId,
                equipped: u.isEquipped,
              },
            ]"
          >
            <img :src="u.item.imageUrl" class="item-thumb" />
            <div class="qty-badge" v-if="u.quantity > 1">x{{ u.quantity }}</div>
            <div class="equip-badge" v-if="u.isEquipped">
              <i class="fas fa-shield-alt"></i>
            </div>
          </div>
        </div>

        <transition name="fade">
          <div v-if="selectedItem" class="detail-panel paper-texture">
            <div class="detail-header">
              <h3 :class="'text-rarity-' + selectedItem.item.rarity">
                {{ selectedItem.item.name }}
                <span
                  v-if="selectedItem.enhanceLevel > 0"
                  class="enhance-level"
                >
                  (+{{ selectedItem.enhanceLevel }})
                </span>
              </h3>
              <span class="type-seal">{{
                translateType(selectedItem.item.type)
              }}</span>
            </div>
            <div class="detail-stats">
              <div v-if="selectedItem.item.atkBonus" class="stat-tag atk">
                +{{ selectedItem.item.atkBonus }} CÔNG
              </div>
              <div v-if="selectedItem.item.defBonus" class="stat-tag def">
                +{{ selectedItem.item.defBonus }} THỦ
              </div>
              <div v-if="selectedItem.item.hpBonus" class="stat-tag hp">
                +{{ selectedItem.item.hpBonus }} HP
              </div>
            </div>
            <p class="desc">
              {{ selectedItem.item.description || "Chưa có thông tin mô tả." }}
            </p>
            <div class="action-row">
              <button
                v-if="selectedItem.item.type === 'CONSUMABLE'"
                @click="inventoryStore.useItem(selectedItem.userItemId)"
                class="btn-wood use"
              >
                SỬ DỤNG
              </button>
              <template v-if="canEquip(selectedItem)">
                <button
                  v-if="!selectedItem.isEquipped"
                  @click="inventoryStore.equipItem(selectedItem.userItemId)"
                  class="btn-wood equip"
                >
                  TRANG BỊ
                </button>
                <button
                  v-else
                  @click="inventoryStore.unequipItem(selectedItem.userItemId)"
                  class="btn-wood unequip"
                >
                  THÁO RA
                </button>
              </template>
              <button
                v-if="!selectedItem.isEquipped"
                @click="openSellModal(selectedItem)"
                class="btn-wood sell"
              >
                BÁN
              </button>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <div v-if="showSell" class="ancient-modal-overlay">
      <div class="ancient-modal paper-texture">
        <div class="modal-head">
          <span class="ornament">❖</span> GIAO DỊCH
          <span class="ornament">❖</span>
        </div>
        <div class="modal-body">
          <h3 class="sell-name">{{ sellItem.item.name }}</h3>
          <div class="mode-switch">
            <div
              class="switch-opt"
              :class="{ active: mode === 'NPC' }"
              @click="mode = 'NPC'"
            >
              <span>TIỆM CẦM ĐỒ</span><small>NPC</small>
            </div>
            <div
              class="switch-opt"
              :class="{ active: mode === 'P2P' }"
              @click="mode = 'P2P'"
            >
              <span>CHỢ TRỜI</span><small>P2P</small>
            </div>
          </div>
          <div class="input-zone">
            <label>SỐ LƯỢNG</label
            ><input
              v-model.number="qty"
              type="number"
              min="1"
              :max="sellItem.quantity"
              class="ink-input"
            />
          </div>
          <div v-if="mode === 'P2P'" class="input-zone">
            <label>ĐƠN GIÁ (Mỗi món)</label
            ><input v-model.number="price" type="number" class="ink-input" />
          </div>
          <div class="summary">
            TỔNG THU:
            <span class="gold-text"
              >{{
                formatNumber(
                  mode === "NPC"
                    ? sellItem.item.basePrice * 0.5 * qty
                    : price * qty
                )
              }}
              Lượng</span
            >
          </div>
          <div class="modal-footer">
            <button @click="showSell = false" class="btn-cancel">HỦY BỎ</button>
            <button
              @click="mode === 'NPC' ? confirmNPC() : confirmP2P()"
              class="btn-confirm"
              :disabled="(mode === 'P2P' && price <= 0) || qty <= 0"
            >
              XÁC NHẬN
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useInventoryStore } from "../stores/inventoryStore";
import { useCharacterStore } from "../stores/characterStore";
import { useAuthStore } from "../stores/authStore";
import { useMarketStore } from "../stores/marketStore";
import { getCurrentSkin } from "@/utils/assetHelper";

const inventoryStore = useInventoryStore();
const charStore = useCharacterStore();
const authStore = useAuthStore();
const marketStore = useMarketStore();

const filter = ref("ALL");
const selectedItem = ref(null);
const equipment = computed(() => inventoryStore.equippedItems);

const showSell = ref(false);
const sellItem = ref(null);
const mode = ref("NPC");
const qty = ref(1);
const price = ref(0);

const userSkinAvatar = computed(() => {
  const skin = getCurrentSkin(authStore.user?.avatarUrl);
  return skin.sprites.idle;
});

const formatNumber = (num) => Number(num).toLocaleString("en-US");

const filteredItems = computed(() => {
  let items = inventoryStore.items;
  if (filter.value === "EQUIP")
    items = items.filter((i) =>
      ["WEAPON", "ARMOR", "HELMET", "BOOTS", "RING", "NECKLACE"].includes(
        i.item.type
      )
    );
  if (filter.value === "MAT")
    items = items.filter((i) =>
      ["MATERIAL", "CONSUMABLE"].includes(i.item.type)
    );
  return items;
});

const openSellModal = (item) => {
  sellItem.value = item;
  qty.value = 1;
  price.value = Math.round(item.item.basePrice * 1.2); // Giá P2P mặc định cao hơn NPC
  mode.value = "NPC";
  showSell.value = true;
};
const confirmNPC = async () => {
  await marketStore.sellItem(sellItem.value.userItemId, qty.value);
  showSell.value = false;
  selectedItem.value = null;
};
const confirmP2P = async () => {
  await marketStore.createListing(
    sellItem.value.userItemId,
    price.value,
    qty.value
  );
  showSell.value = false;
  selectedItem.value = null;
};

const canEquip = (u) =>
  ["WEAPON", "ARMOR", "HELMET", "BOOTS", "RING", "NECKLACE"].includes(
    u.item.type
  );
const unequip = (slot) => {
  if (equipment.value[slot])
    inventoryStore.unequipItem(equipment.value[slot].userItemId);
};

const translateType = (type) => {
  const map = {
    WEAPON: "Binh Khí",
    ARMOR: "Y Phục",
    HELMET: "Mũ",
    BOOTS: "Giày",
    CONSUMABLE: "Tiêu Hao",
    MATERIAL: "Nguyên Liệu",
  };
  return map[type] || type;
};

onMounted(() => {
  inventoryStore.fetchInventory();
  charStore.fetchCharacter();
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Cinzel:wght@400;700&display=swap");

:root {
  --bg-dark: #1a1510;
  --wood-dark: #3e2723;
  --wood-light: #5d4037;
  --paper-bg: #fdf5e6;
  --gold-accent: #fbc02d;
  --red-seal: #b71c1c;
  --text-ink: #2c1810;
}

.inventory-bay.ancient-theme {
  background: var(--bg-dark);
  min-height: 100vh;
  font-family: "Playfair Display", serif;
  color: var(--text-ink);
  overflow: hidden;
}

.bay-grid {
  display: grid;
  grid-template-columns: 400px 1fr;
  height: calc(100vh - 60px);
  margin-top: 60px;
}

.paper-texture {
  background-color: var(--paper-bg);
  background-image: url("https://www.transparenttextures.com/patterns/aged-paper.png");
}

/* --- LEFT COL: CHARACTER --- */
.character-panel {
  position: relative;
  border-right: 6px solid var(--wood-light);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #261815;
  background-image: url("https://www.transparenttextures.com/patterns/wood-pattern.png");
  color: #d7ccc8;
}

/* --- TRUNG TÂM: AVATAR & EQUIP --- */
.equip-layout {
  position: relative;
  width: 400px;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

/* 1. AVATAR CENTER */
.center-avatar-platform {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 140px;
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.char-avatar-img {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  border: 4px solid var(--gold-accent);
  background: #1a1510;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 20px rgba(251, 192, 45, 0.5);
  position: relative;
  z-index: 2;
}
.avatar-img {
  width: 90%;
  height: 90%;
  object-fit: contain;
}
.fallback-char {
  font-size: 3.5em;
  color: #fdf5e6;
}

/* Hào quang */
.aura-ring {
  position: absolute;
  border-radius: 50%;
  border: 1px dashed rgba(251, 192, 45, 0.4);
}
.aura-ring.inner {
  width: 130px;
  height: 130px;
  animation: spinRight 12s linear infinite;
}
.aura-ring.outer {
  width: 160px;
  height: 160px;
  border: 1px solid rgba(251, 192, 45, 0.2);
  animation: spinLeft 20s linear infinite;
}

@keyframes spinRight {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes spinLeft {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(-360deg);
  }
}

/* 2. EQUIP SLOTS (POSITIONING) */
.wood-slot {
  position: absolute;
  width: 70px;
  height: 80px;
  cursor: pointer;
  transition: 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 20;
}
.wood-slot:hover {
  transform: scale(1.1);
  z-index: 30;
}

.slot-frame {
  width: 60px;
  height: 60px;
  background: #3e2723;
  border: 2px solid #8d6e63;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.6);
  position: relative;
  overflow: hidden;
}
.wood-slot.filled .slot-frame {
  border-color: var(--gold-accent);
  background: #4e342e;
  box-shadow: 0 0 10px rgba(251, 192, 45, 0.5);
}

.slot-frame img {
  width: 90%;
  height: 90%;
  object-fit: contain;
}
.placeholder {
  font-size: 1.5em;
  color: #5d4037;
  opacity: 0.5;
}
.glow-effect {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.1) 0%,
    transparent 70%
  );
  animation: pulseSlot 3s infinite;
}

.slot-label-tag {
  margin-top: 5px;
  background: #1a1510;
  color: #bcaaa4;
  font-size: 0.7em;
  padding: 2px 6px;
  border: 1px solid #5d4037;
  border-radius: 4px;
  font-family: "Cinzel";
  font-weight: bold;
}

/* TỌA ĐỘ 4 Ô - CÁCH TÂM 120px */
.helmet {
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
}
.boots {
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
}
.weapon {
  top: 50%;
  left: 30px;
  transform: translateY(-50%);
}
.armor {
  top: 50%;
  right: 30px;
  transform: translateY(-50%);
}

/* ĐƯỜNG NỐI SVG */
.connection-lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}
.connector {
  stroke: rgba(141, 110, 99, 0.3);
  stroke-width: 2;
  stroke-dasharray: 5, 5;
}

/* 3. STATS SCROLL */
.stats-scroll {
  width: 90%;
  background: var(--paper-bg);
  padding: 15px;
  border: 1px solid #8d6e63;
  border-radius: 4px;
  box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.5);
  color: var(--text-ink);
  position: relative;
}
.stat-header {
  text-align: center;
  font-weight: bold;
  margin-bottom: 10px;
  color: #b71c1c;
  font-family: "Cinzel";
}
.ornament {
  color: #bcaaa4;
  margin: 0 5px;
}

.stat-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
  font-weight: bold;
  font-family: "Cinzel";
}
.stat-name {
  width: 80px;
  font-size: 0.8em;
}
.bar-track {
  flex: 1;
  height: 8px;
  background: #d7ccc8;
  border-radius: 4px;
  overflow: hidden;
}
.bar-fill {
  height: 100%;
}
.bar-fill.red {
  background: #b71c1c;
}
.bar-fill.blue {
  background: #1565c0;
}
.stat-num {
  width: 30px;
  text-align: right;
  font-size: 0.9em;
}

/* --- RIGHT COL: BAG --- */
.bag-section {
  display: flex;
  flex-direction: column;
  background: #3e2723;
  background-image: url("https://www.transparenttextures.com/patterns/wood-pattern.png");
  padding: 20px;
  position: relative;
}
.bag-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #261815;
  padding: 12px;
  border-radius: 4px;
  border: 1px solid #5d4037;
  margin-bottom: 20px;
}
.tab-group button {
  background: transparent;
  border: none;
  color: #a1887f;
  padding: 5px 15px;
  cursor: pointer;
  font-family: "Cinzel";
  font-weight: bold;
  border-bottom: 3px solid transparent;
  transition: 0.3s;
}
.tab-group button.active {
  color: var(--gold-accent);
  border-bottom-color: var(--gold-accent);
}
.capacity {
  color: #8d6e63;
  font-weight: bold;
  font-size: 0.85em;
}

.grid-container {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(75px, 1fr));
  gap: 10px;
  align-content: start;
  overflow-y: auto;
  padding: 5px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}
.grid-item {
  aspect-ratio: 1;
  background: #4e342e;
  border: 1px solid #5d4037;
  border-radius: 4px;
  position: relative;
  cursor: pointer;
  transition: 0.2s;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.5);
}
.grid-item:hover {
  transform: translateY(-3px);
  border-color: var(--gold-accent);
  z-index: 5;
}
.grid-item.selected {
  border-color: var(--gold-accent);
  box-shadow: 0 0 10px rgba(251, 192, 45, 0.4);
}
.grid-item.equipped {
  border-color: #2e7d32;
}
.item-thumb {
  width: 100%;
  height: 100%;
  padding: 5px;
  object-fit: contain;
}
.qty-badge {
  position: absolute;
  bottom: 2px;
  right: 2px;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 0 4px;
  font-size: 0.7em;
  border-radius: 2px;
}
.equip-badge {
  position: absolute;
  top: 2px;
  left: 2px;
  color: #a5d6a7;
  font-size: 0.7em;
}

.rarity-C {
  border-bottom: 3px solid #bcaaa4;
}
.rarity-S {
  border-bottom: 3px solid #ffd700;
}
.rarity-A {
  border-bottom: 3px solid #9c27b0;
}

.detail-panel {
  margin-top: 20px;
  background: var(--paper-bg);
  border: 4px solid var(--wood-light);
  padding: 15px;
  box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.5);
  min-height: 180px;
}
.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px dashed #8d6e63;
  padding-bottom: 8px;
  margin-bottom: 10px;
}
.text-rarity-S {
  color: #f57f17;
  text-shadow: 0 0 1px #f57f17;
}
.type-seal {
  background: #d7ccc8;
  color: #3e2723;
  padding: 2px 8px;
  font-size: 0.75em;
  font-weight: bold;
  border-radius: 4px;
}
.detail-stats {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
  font-family: "Cinzel";
  font-size: 0.9em;
}
.stat-tag {
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: bold;
}
.atk {
  color: #b71c1c;
  border: 1px solid #ef9a9a;
}
.def {
  color: #1565c0;
  border: 1px solid #90caf9;
}
.hp {
  color: #2e7d32;
  border: 1px solid #a5d6a7;
}
.desc {
  font-style: italic;
  color: #4e342e;
  margin-bottom: 15px;
  font-size: 0.95em;
}
.action-row {
  display: flex;
  gap: 10px;
}
.btn-wood {
  flex: 1;
  padding: 8px;
  border: 1px solid;
  font-family: "Cinzel";
  font-weight: bold;
  cursor: pointer;
  color: #fff;
  transition: 0.2s;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}
.btn-wood:hover {
  transform: translateY(-1px);
  filter: brightness(1.1);
}
.use {
  background: #f57f17;
  border-color: #f57f17;
  color: #000;
}
.equip {
  background: #2e7d32;
  border-color: #1b5e20;
}
.unequip {
  background: #4e342e;
  border-color: #3e2723;
}
.sell {
  background: #c62828;
  border-color: #b71c1c;
}

/* MODAL & TRANSITIONS */
.ancient-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ancient-modal {
  width: 380px;
  background: var(--paper-bg);
  border: 4px double var(--wood-dark);
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.8);
}
.modal-head {
  background: var(--wood-dark);
  color: var(--gold-accent);
  padding: 10px;
  text-align: center;
  font-family: "Cinzel";
  font-weight: bold;
}
.modal-body {
  padding: 20px;
  color: var(--text-ink);
}
.sell-name {
  text-align: center;
  color: #b71c1c;
  font-family: "Cinzel";
  border-bottom: 1px dashed #8d6e63;
  padding-bottom: 10px;
  margin-bottom: 15px;
}
.mode-switch {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
.switch-opt {
  flex: 1;
  border: 1px solid #a1887f;
  padding: 10px;
  text-align: center;
  cursor: pointer;
  opacity: 0.6;
  background: #efebe9;
  transition: 0.2s;
}
.switch-opt.active {
  opacity: 1;
  border-color: #b71c1c;
  background: #fff;
  font-weight: bold;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
}
.input-zone {
  margin-bottom: 15px;
}
.input-zone label {
  display: block;
  font-size: 0.8em;
  font-weight: bold;
  margin-bottom: 5px;
  color: #5d4037;
}
.ink-input {
  width: 100%;
  border: none;
  border-bottom: 2px solid var(--wood-light);
  background: transparent;
  padding: 5px;
  font-family: "Playfair Display";
  font-weight: bold;
  font-size: 1.2em;
  outline: none;
}
.summary {
  text-align: right;
  font-weight: bold;
  margin-bottom: 20px;
  font-size: 1.1em;
}
.gold-text {
  color: #e65100;
}
.modal-footer {
  display: flex;
  gap: 10px;
}
.btn-confirm {
  flex: 1;
  background: #b71c1c;
  color: #fff;
  border: none;
  padding: 10px;
  font-family: "Cinzel";
  font-weight: bold;
  cursor: pointer;
}
.btn-cancel {
  flex: 1;
  background: #5d4037;
  color: #fff;
  border: none;
  padding: 10px;
  font-family: "Cinzel";
  cursor: pointer;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.custom-scroll::-webkit-scrollbar {
  width: 6px;
}
.custom-scroll::-webkit-scrollbar-thumb {
  background: #8d6e63;
  border-radius: 3px;
}
.custom-scroll::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
}
</style>
