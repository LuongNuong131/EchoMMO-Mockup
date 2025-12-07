<template>
  <div class="page-container character-page">
    <div class="char-grid">
      <div class="panel stats">
        <h3>CHỈ SỐ</h3>
        <div class="stat-row">
          <span>Cấp Độ</span>
          <span class="hl">Lv.{{ charStore.character?.lv || 1 }}</span>
        </div>
        <div class="stat-row">
          <span>Công Lực</span>
          <span class="val">{{ charStore.character?.baseAtk || 0 }}</span>
        </div>
        <div class="stat-row">
          <span>Thủ Bị</span>
          <span class="val">{{ charStore.character?.baseDef || 0 }}</span>
        </div>
        <div class="stat-row">
          <span>Tốc Độ</span>
          <span>{{ charStore.character?.baseSpeed || 0 }}</span>
        </div>
        <div class="stat-row">
          <span>Bạo Kích</span>
          <span>{{ charStore.character?.baseCritRate || 0 }}%</span>
        </div>
      </div>

      <div class="panel equip-center">
        <div class="char-model">
          <img :src="userSkinAvatar" class="char-sprite" />
        </div>

        <div
          class="slot head"
          @click="unequip('HELMET')"
          title="Mũ"
          :class="{ equipped: equipment.HELMET }"
        >
          <img v-if="equipment.HELMET" :src="equipment.HELMET.item.imageUrl" />
          <span v-else>⛑️</span>
        </div>
        <div
          class="slot weapon"
          @click="unequip('WEAPON')"
          title="Vũ Khí"
          :class="{ equipped: equipment.WEAPON }"
        >
          <img v-if="equipment.WEAPON" :src="equipment.WEAPON.item.imageUrl" />
          <span v-else>⚔️</span>
        </div>
        <div
          class="slot armor"
          @click="unequip('ARMOR')"
          title="Áo"
          :class="{ equipped: equipment.ARMOR }"
        >
          <img v-if="equipment.ARMOR" :src="equipment.ARMOR.item.imageUrl" />
          <span v-else>👕</span>
        </div>
        <div
          class="slot boots"
          @click="unequip('BOOTS')"
          title="Giày"
          :class="{ equipped: equipment.BOOTS }"
        >
          <img v-if="equipment.BOOTS" :src="equipment.BOOTS.item.imageUrl" />
          <span v-else>👢</span>
        </div>
      </div>

      <div class="panel bag">
        <div class="panel-head">🎒 TÚI ĐỒ</div>
        <div class="bag-grid custom-scroll">
          <div v-if="inventoryStore.items.length === 0" class="empty-bag">
            Trống
          </div>
          <div
            v-else
            v-for="item in equipableItems"
            :key="item.userItemId"
            class="bag-slot"
            :class="{ equipped: item.isEquipped }"
            @click="equip(item)"
            :title="item.item.name"
          >
            <img
              :src="item.item.imageUrl || 'https://via.placeholder.com/64'"
            />
            <span class="qty" v-if="item.quantity > 1">{{
              item.quantity
            }}</span>
          </div>
        </div>
        <div class="bag-footer">Chỉ hiển thị Trang Bị trong túi.</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useCharacterStore } from "@/stores/characterStore";
import { useInventoryStore } from "@/stores/inventoryStore";
import { useAuthStore } from "@/stores/authStore";
import { getCurrentSkin } from "@/utils/assetHelper";

const charStore = useCharacterStore();
const inventoryStore = useInventoryStore();
const authStore = useAuthStore();
const equipment = computed(() => inventoryStore.equippedItems);

const userSkinAvatar = computed(() => {
  const skin = getCurrentSkin(authStore.user?.avatarUrl);
  return skin.sprites.idle;
});

const equipableItems = computed(() => {
  return inventoryStore.items.filter((i) =>
    ["WEAPON", "ARMOR", "HELMET", "BOOTS", "RING", "NECKLACE"].includes(
      i.item.type
    )
  );
});

const unequip = async (slotType) => {
  if (equipment.value[slotType]) {
    if (confirm("Tháo trang bị này?")) {
      await inventoryStore.unequipItem(equipment.value[slotType].userItemId);
    }
  }
};

const equip = async (item) => {
  if (!item.isEquipped) await inventoryStore.equipItem(item.userItemId);
  else alert("Vật phẩm đã được trang bị!");
};

onMounted(() => {
  charStore.fetchCharacter();
  inventoryStore.fetchInventory();
});
</script>

<style scoped>
.character-page {
  padding: 20px;
  background: #1a1a1a;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #d7ccc8;
  font-family: "Noto Serif TC";
}

.char-grid {
  display: grid;
  grid-template-columns: 250px 300px 250px;
  gap: 20px;
  width: 100%;
  max-width: 900px;
}

.panel {
  background: #261815;
  border: 2px solid #5d4037;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  flex-direction: column;
}

.panel-head {
  text-align: center;
  font-weight: bold;
  color: #fbc02d;
  border-bottom: 1px solid #5d4037;
  padding-bottom: 10px;
  margin-bottom: 15px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 0.9em;
}

.hl {
  color: #fbc02d;
  font-weight: bold;
}

.val {
  font-weight: bold;
  color: #fff;
}

.equip-center {
  position: relative;
  align-items: center;
  justify-content: center;
  background-image: radial-gradient(circle, #3e2723 0%, #1a1a1a 70%);
}

.char-model {
  /* Đảm bảo hình nhân vật không bị vỡ */
  width: 128px;
  height: 128px;
  margin-top: -20px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}
.char-sprite {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transform: scale(2);
  image-rendering: pixelated;
}

.slot {
  position: absolute;
  width: 50px;
  height: 50px;
  background: rgba(0, 0, 0, 0.5);
  border: 2px solid #8d6e63;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.2s;
  font-size: 1.5em;
}
.slot.equipped {
  border-color: #fbc02d;
  background: #4e342e;
}

.slot:hover {
  border-color: #fbc02d;
  box-shadow: 0 0 10px #fbc02d;
}

.slot img {
  width: 90%;
  height: 90%;
  object-fit: contain;
}

.head {
  top: 20px;
}

.weapon {
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
}

.armor {
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
}

.boots {
  bottom: 20px;
}

.bag-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 5px;
  overflow-y: auto;
  max-height: 300px;
  padding: 5px;
  border: 1px solid #3e2723;
}

.bag-slot {
  aspect-ratio: 1;
  background: #3e2723;
  border: 1px solid #5d4037;
  position: relative;
  cursor: pointer;
}

.bag-slot:hover {
  border-color: #fff;
}

.bag-slot img {
  width: 100%;
  height: 100%;
  padding: 2px;
  object-fit: contain;
}

.equipped {
  border-color: #2e7d32;
  opacity: 0.5;
}

.qty {
  position: absolute;
  bottom: 0;
  right: 0;
  background: #000;
  color: #fff;
  font-size: 0.7em;
  padding: 0 3px;
}

.empty-bag {
  grid-column: 1 / -1;
  text-align: center;
  padding: 20px;
  color: #8d6e63;
}
.bag-footer {
  text-align: center;
  font-size: 0.8em;
  color: #a1887f;
  padding-top: 10px;
  border-top: 1px dashed #3e2723;
}
</style>
