<template>
  <div class="page-container wuxia-market">
    <div class="ink-bg-layer">
      <div class="mountain-bg"></div>
      <div class="paper-overlay"></div>
    </div>

    <div class="market-overlay">
      <div class="market-header">
        <h2 class="market-title">THƯƠNG HỘI</h2>
        <div class="market-tabs">
          <button
            :class="{ active: activeTab === 'buy' }"
            @click="activeTab = 'buy'"
            class="tab-btn"
          >
            <i class="fas fa-store"></i> TIỆM TẠP HÓA
          </button>
          <button
            :class="{ active: activeTab === 'p2p' }"
            @click="activeTab = 'p2p'"
            class="tab-btn"
          >
            <i class="fas fa-handshake"></i> CHỢ TRỜI
          </button>
          <button
            :class="{ active: activeTab === 'my_listings' }"
            @click="loadMyListings"
            class="tab-btn"
          >
            <i class="fas fa-clipboard-list"></i> SẠP CỦA TA
          </button>
          <button
            :class="{ active: activeTab === 'sell_sys' }"
            @click="activeTab = 'sell_sys'"
            class="tab-btn"
          >
            <i class="fas fa-coins"></i> BÁN VẬT PHẨM
          </button>
        </div>
      </div>

      <div class="market-content custom-scroll">
        <div v-if="activeTab === 'buy'" class="grid-layout">
          <div
            v-for="item in marketStore.shopItems"
            :key="item.itemId"
            class="wood-card"
          >
            <div class="card-img-box">
              <img
                v-if="item.imageUrl"
                :src="item.imageUrl"
                @error="$event.target.style.display = 'none'"
              />
              <div v-else class="placeholder-icon">
                {{ item.name.charAt(0) }}
              </div>
              <div class="rarity-seal" :class="'rarity-' + item.rarity">
                {{ item.rarity }}
              </div>
            </div>

            <div class="card-info">
              <div class="item-name">{{ item.name }}</div>
              <div class="item-type">{{ item.type }}</div>
              <div class="price-tag">
                <i class="fas fa-coins text-gold"></i>
                <span class="val">{{ formatNumber(item.basePrice) }}</span>
              </div>
            </div>

            <div class="card-actions">
              <input
                type="number"
                v-model.number="buyQty[item.itemId]"
                min="1"
                class="ink-input-qty"
                placeholder="1"
              />
              <button @click="handleBuySystem(item)" class="btn-buy">
                MUA
              </button>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'p2p'" class="grid-layout">
          <div
            v-if="marketStore.playerListings.length === 0"
            class="empty-scroll"
          >
            _Chưa có ai bày bán_
          </div>

          <div
            v-for="listing in marketStore.playerListings"
            :key="listing.listingId"
            class="wood-card p2p-card"
          >
            <div class="seller-tag">
              <i class="fas fa-user"></i> {{ listing.seller.username }}
            </div>

            <div class="card-info">
              <div class="item-name">
                {{ listing.item.name }}
                <span v-if="listing.enhanceLevel > 0" class="enhance-txt">
                  (+{{ listing.enhanceLevel }})
                </span>
              </div>
              <div class="stock-count">Tồn: {{ listing.quantity }}</div>
              <div class="price-tag p2p-price">
                <i class="fas fa-coins text-gold"></i>
                <span class="val">{{ formatNumber(listing.price) }}</span>
              </div>
            </div>

            <div class="card-actions">
              <input
                type="number"
                v-model.number="p2pQty[listing.listingId]"
                min="1"
                :max="listing.quantity"
                class="ink-input-qty"
                placeholder="1"
              />
              <button @click="handleBuyP2P(listing)" class="btn-buy p2p">
                MUA LẠI
              </button>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'my_listings'" class="grid-layout">
          <div v-if="marketStore.myListings.length === 0" class="empty-scroll">
            _Sạp hàng trống không_
          </div>

          <div
            v-for="listing in marketStore.myListings"
            :key="listing.listingId"
            class="wood-card my-card"
          >
            <div class="card-info">
              <div class="item-name">{{ listing.item.name }}</div>
              <div class="stock-count">Số lượng: {{ listing.quantity }}</div>
              <div class="price-tag">
                <span class="val">{{ formatNumber(listing.price) }}</span> Xu
              </div>
            </div>
            <button
              @click="marketStore.cancelListing(listing.listingId)"
              class="btn-cancel"
            >
              THU HỒI
            </button>
          </div>
        </div>

        <div v-if="activeTab === 'sell_sys'" class="grid-layout">
          <div v-if="inventoryStore.items.length === 0" class="empty-scroll">
            _Hành trang trống rỗng_
          </div>

          <div
            v-for="uItem in inventoryStore.items"
            :key="uItem.userItemId"
            class="wood-card sell-card"
          >
            <div class="card-img-box small">
              <img v-if="uItem.item.imageUrl" :src="uItem.item.imageUrl" />
              <div class="qty-seal">x{{ uItem.quantity }}</div>
            </div>
            <div class="card-info">
              <div class="item-name">{{ uItem.item.name }}</div>
              <div class="price-tag sell-price">
                Giá thu:
                <span class="val">{{
                  formatNumber(uItem.item.basePrice * 0.5)
                }}</span>
              </div>
            </div>

            <div class="card-actions">
              <input
                type="number"
                v-model.number="sellQty[uItem.userItemId]"
                min="1"
                :max="uItem.quantity"
                class="ink-input-qty"
                placeholder="All"
              />
              <button
                v-if="!uItem.isEquipped"
                @click="sellSystem(uItem)"
                class="btn-sell"
              >
                BÁN
              </button>
              <div v-else class="equipped-warn">ĐANG DÙNG</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useMarketStore } from "../stores/marketStore";
import { useInventoryStore } from "../stores/inventoryStore";

const marketStore = useMarketStore();
const inventoryStore = useInventoryStore();

const activeTab = ref("buy");
const sellQty = reactive({});
const buyQty = reactive({});
const p2pQty = reactive({});

const formatNumber = (n) => Number(n).toLocaleString("en-US");

const handleBuySystem = async (item) => {
  const qty = buyQty[item.itemId] || 1;
  await marketStore.buyItem(item.itemId, qty);
  buyQty[item.itemId] = 1;
};

const handleBuyP2P = async (listing) => {
  const qty = p2pQty[listing.listingId] || 1;
  await marketStore.buyPlayerListing(listing.listingId, qty);
  p2pQty[listing.listingId] = 1;
};

const loadMyListings = async () => {
  activeTab.value = "my_listings";
  await marketStore.fetchMyListings();
};

const sellSystem = async (uItem) => {
  const qty = sellQty[uItem.userItemId] || uItem.quantity;
  await marketStore.sellItem(uItem.userItemId, qty);
  inventoryStore.fetchInventory();
};

onMounted(() => {
  // MOCK: Giả lập refresh dữ liệu ban đầu
  marketStore.fetchShopItems();
  marketStore.fetchPlayerListings();
  inventoryStore.fetchInventory();
  marketStore.fetchMyListings();
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Noto+Serif+TC:wght@500;700;900&display=swap");

/* --- VARIABLES --- */
:root {
  --paper-bg: #e3d5b8;
  --wood-dark: #3e2723;
  --wood-light: #5d4037;
  --ink: #212121;
  --red-seal: #b71c1c;
  --gold: #d4a017;
}

/* --- BASE STYLE --- */
.wuxia-market {
  min-height: 100vh;
  background-color: var(--wood-dark);
  font-family: "Noto Serif TC", serif;
  color: var(--wood-dark);
  position: relative;
  overflow: hidden;
}

/* --- BACKGROUND --- */
.ink-bg-layer {
  position: absolute;
  inset: 0;
  z-index: 0;
  background-color: #d7ccc8;
}
.mountain-bg {
  position: absolute;
  inset: 0;
  background-image: url("https://images.unsplash.com/photo-1518182170546-0766ce6fec56?q=80&w=2000&auto=format&fit=crop");
  background-size: cover;
  filter: sepia(40%) grayscale(20%) opacity(0.8);
}
.paper-overlay {
  position: absolute;
  inset: 0;
  background-image: url("https://www.transparenttextures.com/patterns/aged-paper.png");
  opacity: 0.4;
  pointer-events: none;
}

.market-overlay {
  position: relative;
  z-index: 10;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

/* --- HEADER --- */
.market-header {
  text-align: center;
  margin-bottom: 20px;
  background: var(--paper-bg);
  border: 4px double var(--wood-dark);
  padding: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
}

.market-title {
  font-family: "Noto Serif TC", serif;
  font-size: 2.5em;
  font-weight: 900;
  color: var(--wood-dark);
  margin-bottom: 15px;
  text-transform: uppercase;
  letter-spacing: 2px;
  border-bottom: 2px solid var(--wood-light);
  display: inline-block;
  padding-bottom: 5px;
}

.market-tabs {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.tab-btn {
  background: transparent;
  border: 2px solid var(--wood-light);
  color: #5d4037;
  padding: 8px 16px;
  font-family: "Noto Serif TC";
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
}
.tab-btn:hover {
  background: var(--wood-light);
  color: var(--paper-bg);
}
.tab-btn.active {
  background: var(--wood-dark);
  color: #fff;
  border-color: var(--wood-dark);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

/* --- CONTENT --- */
.market-content {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.grid-layout {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}

/* --- WOOD CARD --- */
.wood-card {
  background: var(--paper-bg);
  border: 3px solid var(--wood-light);
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
  transition: 0.3s;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  /* Vân gỗ */
  background-image: repeating-linear-gradient(
    45deg,
    rgba(0, 0, 0, 0.02) 0,
    rgba(0, 0, 0, 0.02) 2px,
    transparent 2px,
    transparent 6px
  );
}
.wood-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  border-color: var(--gold);
}

/* Card Image */
.card-img-box {
  width: 100%;
  height: 120px;
  background: #d7ccc8;
  border: 1px solid #a1887f;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}
.card-img-box img {
  max-width: 80%;
  max-height: 80%;
  filter: sepia(0.3);
}
.placeholder-icon {
  font-size: 3em;
  color: #8d6e63;
  font-family: "Noto Serif TC";
  font-weight: bold;
}

.rarity-seal {
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 0.7em;
  padding: 2px 6px;
  border: 1px solid;
  border-radius: 2px;
  font-weight: bold;
  background: rgba(255, 255, 255, 0.8);
}
.rarity-C {
  color: #5d4037;
  border-color: #5d4037;
}
.rarity-A {
  color: #1e88e5;
  border-color: #1e88e5;
}
.rarity-S {
  color: var(--gold);
  border-color: var(--gold);
  background: var(--wood-dark);
}

/* Info */
.card-info {
  flex: 1;
}
.item-name {
  font-weight: bold;
  font-size: 1.1em;
  color: var(--wood-dark);
}
.item-type {
  font-size: 0.8em;
  color: #795548;
  font-style: italic;
}
.price-tag {
  margin-top: 5px;
  font-size: 1em;
  font-weight: bold;
  color: #3e2723;
}
.text-gold {
  color: var(--gold);
  margin-right: 5px;
  text-shadow: 1px 1px 0 #000;
}
.val {
  font-size: 1.2em;
}

/* Actions */
.card-actions {
  display: flex;
  gap: 5px;
  margin-top: 5px;
}
.ink-input-qty {
  width: 50px;
  background: transparent;
  border: 1px solid var(--wood-light);
  color: var(--wood-dark);
  text-align: center;
  font-family: "Noto Serif TC";
  font-weight: bold;
  padding: 5px;
}
.btn-buy {
  flex: 1;
  background: var(--wood-dark);
  color: #fff;
  border: none;
  font-family: "Noto Serif TC";
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;
}
.btn-buy:hover {
  background: var(--red-seal);
}

/* P2P Specifics */
.p2p-card {
  border-style: double;
  border-width: 4px;
}
.seller-tag {
  font-size: 0.8em;
  color: #5d4037;
  border-bottom: 1px dashed #a1887f;
  padding-bottom: 5px;
  margin-bottom: 5px;
}
.enhance-txt {
  color: var(--red-seal);
  font-size: 0.8em;
  font-weight: bold;
}
.btn-buy.p2p {
  background: var(--gold);
  color: var(--wood-dark);
}
.btn-buy.p2p:hover {
  background: #ffb300;
}

/* Sell Specifics */
.sell-card {
  background: #efebe9;
}
.sell-price {
  color: var(--red-seal);
}
.btn-sell {
  flex: 1;
  background: var(--red-seal);
  color: #fff;
  border: none;
  font-family: "Noto Serif TC";
  font-weight: bold;
  cursor: pointer;
}
.equipped-warn {
  flex: 1;
  background: #bdbdbd;
  color: #616161;
  text-align: center;
  padding: 5px;
  font-size: 0.8em;
  font-weight: bold;
}
.qty-seal {
  position: absolute;
  bottom: 2px;
  right: 2px;
  background: var(--wood-dark);
  color: #fff;
  font-size: 0.7em;
  padding: 2px 5px;
  border-radius: 4px;
}

.btn-cancel {
  width: 100%;
  background: #757575;
  color: #fff;
  border: none;
  padding: 8px;
  margin-top: 10px;
  font-family: "Noto Serif TC";
  cursor: pointer;
}
.btn-cancel:hover {
  background: #616161;
}

.empty-scroll {
  grid-column: 1/-1;
  text-align: center;
  padding: 40px;
  color: #8d6e63;
  font-style: italic;
  font-size: 1.2em;
  border: 2px dashed #a1887f;
}

/* Scrollbar */
.custom-scroll::-webkit-scrollbar {
  width: 6px;
}
.custom-scroll::-webkit-scrollbar-thumb {
  background: var(--wood-light);
  border-radius: 3px;
}
</style>
