<template>
  <div class="page-container admin-view ancient-theme">
    <div class="admin-wrapper">
      <div class="admin-header wood-panel">
        <div class="header-ornament left"></div>
        <div class="header-ornament right"></div>
        <h2 class="header-title">
          <span class="ornament">❖</span> QUẢN TRỊ THIÊN PHỦ
          <span class="ornament">❖</span>
        </h2>

        <div class="tabs">
          <button
            :class="{ active: activeTab === 'stats' }"
            @click="switchTab('stats')"
          >
            <i class="fas fa-chart-line"></i> THỐNG KÊ
          </button>
          <button
            :class="{ active: activeTab === 'users' }"
            @click="switchTab('users')"
          >
            <i class="fas fa-users"></i> NHÂN SĨ
          </button>
          <button
            :class="{ active: activeTab === 'items' }"
            @click="switchTab('items')"
          >
            <i class="fas fa-khanda"></i> KHO TÀNG
          </button>
          <button
            :class="{ active: activeTab === 'market' }"
            @click="switchTab('market')"
          >
            <i class="fas fa-balance-scale"></i> THƯƠNG HỘI
          </button>
          <button
            :class="{ active: activeTab === 'grant' }"
            @click="switchTab('grant')"
          >
            <i class="fas fa-gift"></i> BAN THƯỞNG
          </button>
          <button
            :class="{ active: activeTab === 'notify' }"
            @click="switchTab('notify')"
          >
            <i class="fas fa-scroll"></i> CÁO THỊ
          </button>
        </div>
      </div>

      <div v-if="activeTab === 'stats'" class="stats-panel">
        <div class="stat-card paper-texture">
          <h3>TỔNG NHÂN SĨ</h3>
          <p class="num">
            {{ formatNumber(adminStore.stats.totalUsers || 0) }}
          </p>
          <div class="seal-bg"><i class="fas fa-user"></i></div>
        </div>
        <div class="stat-card paper-texture">
          <h3>TỔNG VẬT PHẨM</h3>
          <p class="num">
            {{ formatNumber(adminStore.stats.totalItems || 0) }}
          </p>
          <div class="seal-bg"><i class="fas fa-box-open"></i></div>
        </div>
        <div class="stat-card paper-texture">
          <h3>NGÂN LƯỢNG LƯU THÔNG</h3>
          <p class="num gold-text">
            {{ formatNumber(adminStore.stats.totalGold || 0) }}
          </p>
          <div class="seal-bg"><i class="fas fa-coins"></i></div>
        </div>
      </div>

      <div v-if="activeTab === 'users'" class="content-panel paper-texture">
        <h3 class="panel-title">DANH SÁCH NHÂN SĨ</h3>
        <div class="table-responsive custom-scroll">
          <table class="ancient-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>DANH TÍNH</th>
                <th>THƯ TÍN (EMAIL)</th>
                <th>VAI TRÒ</th>
                <th>TRẠNG THÁI</th>
                <th>HÀNH ĐỘNG</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="u in adminStore.users" :key="u.userId">
                <td>#{{ u.userId }}</td>
                <td class="bold-text">{{ u.username }}</td>
                <td>{{ u.email || "N/A" }}</td>
                <td>{{ u.role }}</td>
                <td>
                  <span v-if="u.isActive" class="stamp green">HOẠT ĐỘNG</span>
                  <span v-else class="stamp red">ĐÃ GIAM</span>
                </td>
                <td class="action-cell">
                  <button
                    v-if="u.isActive"
                    @click="openBanModal(u)"
                    class="btn-icon red"
                    title="Giam cầm"
                    :disabled="u.role === 'ADMIN'"
                  >
                    <i class="fas fa-gavel"></i>
                  </button>
                  <button
                    v-else
                    @click="unbanUser(u.userId)"
                    class="btn-icon green"
                    title="Phóng thích"
                  >
                    <i class="fas fa-lock-open"></i>
                  </button>
                  <button
                    @click="adminStore.deleteUser(u.userId)"
                    class="btn-icon gray"
                    title="Xóa bỏ"
                    :disabled="u.role === 'ADMIN'"
                  >
                    <i class="fas fa-skull"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="activeTab === 'items'" class="content-panel paper-texture">
        <div class="flex-head">
          <h3 class="panel-title">KHO TÀNG VẬT PHẨM</h3>
          <button @click="showCreateItem = !showCreateItem" class="btn-wood">
            <i class="fas fa-plus"></i> CHẾ TÁC MỚI
          </button>
        </div>

        <transition name="fade">
          <div v-if="showCreateItem" class="create-box">
            <form @submit.prevent="createItem" class="ancient-form">
              <div class="form-row">
                <input
                  v-model="itemForm.name"
                  placeholder="Tên vật phẩm..."
                  class="ink-input"
                  required
                />
                <input
                  v-model="itemForm.description"
                  placeholder="Mô tả..."
                  class="ink-input"
                />
              </div>
              <div class="form-row">
                <select v-model="itemForm.type" class="ink-input">
                  <option value="WEAPON">Binh Khí</option>
                  <option value="ARMOR">Y Phục</option>
                  <option value="HELMET">Mũ</option>
                  <option value="BOOTS">Giày</option>
                  <option value="RING">Nhẫn</option>
                  <option value="NECKLACE">Dây Chuyền</option>
                  <option value="CONSUMABLE">Tiêu Hao</option>
                  <option value="MATERIAL">Nguyên Liệu</option>
                </select>
                <select v-model="itemForm.rarity" class="ink-input">
                  <option value="C">Thường (C)</option>
                  <option value="B">Hiếm (B)</option>
                  <option value="A">Sử Thi (A)</option>
                  <option value="S">Truyền Thuyết (S)</option>
                </select>
                <input
                  v-model.number="itemForm.basePrice"
                  type="number"
                  placeholder="Giá bán"
                  class="ink-input"
                />
              </div>
              <div class="form-row">
                <input
                  v-model="itemForm.imageUrl"
                  placeholder="URL Hình ảnh..."
                  class="ink-input full-width"
                />
              </div>
              <div class="form-row align-center">
                <label class="check-label">
                  <input type="checkbox" v-model="itemForm.isSystemItem" />
                  <span class="label-text"> Hàng Shop Vô Hạn?</span>
                </label>
                <button type="submit" class="btn-wood primary">HOÀN TẤT</button>
              </div>
            </form>
          </div>
        </transition>

        <div class="table-responsive custom-scroll">
          <table class="ancient-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>TÊN VẬT PHẨM</th>
                <th>LOẠI</th>
                <th>PHẨM CẤP</th>
                <th>GIÁ</th>
                <th>HÀNH ĐỘNG</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="i in adminStore.items" :key="i.itemId">
                <td>#{{ i.itemId }}</td>
                <td class="bold-text">{{ i.name }}</td>
                <td>{{ i.type }}</td>
                <td :class="'text-' + i.rarity">{{ i.rarity }}</td>
                <td>{{ i.basePrice }}</td>
                <td>
                  <button
                    @click="adminStore.deleteItem(i.itemId)"
                    class="btn-icon red"
                  >
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="activeTab === 'market'" class="content-panel paper-texture">
        <h3 class="panel-title">THỊ TRƯỜNG P2P</h3>
        <p class="empty-msg">Tính năng đang được Chưởng Môn xây dựng...</p>
      </div>

      <div v-if="activeTab === 'grant'" class="content-panel paper-texture">
        <h3 class="panel-title">BAN THƯỞNG VẬT PHẨM</h3>
        <p class="empty-msg">Tính năng đang được Chưởng Môn xây dựng...</p>
      </div>

      <div v-if="activeTab === 'notify'" class="content-panel paper-texture">
        <h3 class="panel-title">PHÁT LOA CÁO THỊ</h3>
        <p class="empty-msg">Tính năng đang được Chưởng Môn xây dựng...</p>
      </div>
    </div>

    <div
      v-if="showBanModal"
      class="ancient-modal-overlay"
      @click.self="showBanModal = false"
    >
      <div class="ancient-modal paper-texture">
        <div class="modal-head">
          <span class="ornament">❖</span> PHÁN QUYẾT
          <span class="ornament">❖</span>
        </div>
        <div class="modal-body">
          <h3>
            Giam cầm: <span class="red-text">{{ selectedUser?.username }}</span>
          </h3>
          <textarea
            v-model="banReason"
            placeholder="Lý do trừng phạt..."
            class="ink-input text-area"
            rows="3"
          ></textarea>
          <div class="modal-actions">
            <button @click="confirmBan" class="btn-wood red">XÁC NHẬN</button>
            <button @click="showBanModal = false" class="btn-wood">
              HỦY BỎ
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useAdminStore } from "../stores/adminStore";
import axiosClient from "../api/axiosClient";

const adminStore = useAdminStore();
const activeTab = ref("stats");
const showCreateItem = ref(false);

const showBanModal = ref(false);
const selectedUser = ref(null);
const banReason = ref("");

const itemForm = reactive({
  name: "",
  description: "",
  type: "WEAPON",
  rarity: "C",
  basePrice: 100,
  imageUrl: "",
  isSystemItem: false,
});

const formatNumber = (n) => Number(n).toLocaleString();

const switchTab = (tab) => {
  activeTab.value = tab;
  if (tab === "stats") adminStore.fetchStats();
  if (tab === "users") adminStore.fetchUsers();
  if (tab === "items") adminStore.fetchItems();
  // Các tab khác không cần fetch vì đang dùng mock data đơn giản
};

const createItem = async () => {
  try {
    // MOCK: Gửi data thành công
    await axiosClient.post("/admin/item/create", itemForm);
    alert("Tạo thành công!");
    adminStore.fetchItems();
  } catch (e) {
    alert(e.message);
  }
};

// --- BAN LOGIC ---
const openBanModal = (u) => {
  selectedUser.value = u;
  banReason.value = "";
  showBanModal.value = true;
};

const confirmBan = async () => {
  if (!banReason.value) return alert("Cần lý do!");
  try {
    // MOCK: Giả lập ban thành công
    await adminStore.banUser(selectedUser.value.userId, banReason.value);
    alert("Đã thi hành án!");
    showBanModal.value = false;
  } catch (e) {
    alert(e.message);
  }
};

const unbanUser = async (id) => {
  if (confirm("Phóng thích?")) {
    // MOCK: Giả lập unban thành công
    await adminStore.unbanUser(id);
    alert("Đã ân xá!");
  }
};

onMounted(() => adminStore.fetchStats());
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

.admin-view.ancient-theme {
  background: var(--bg-dark);
  min-height: 100vh;
  font-family: "Playfair Display", serif;
  color: var(--text-ink);
  overflow-y: auto;
}

.admin-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  padding-bottom: 80px;
}

.wood-panel {
  background: var(--wood-dark);
  background-image: url("https://www.transparenttextures.com/patterns/wood-pattern.png");
  border: 4px solid var(--wood-light);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
}

.paper-texture {
  background-color: var(--paper-bg);
  background-image: url("https://www.transparenttextures.com/patterns/aged-paper.png");
}

/* Header */
.admin-header {
  padding: 20px;
  margin-bottom: 25px;
  text-align: center;
  position: relative;
}
.header-title {
  color: var(--gold-accent);
  font-family: "Cinzel";
  font-size: 1.8em;
  margin-bottom: 15px;
  text-shadow: 2px 2px 4px #000;
}
.ornament {
  color: #8d6e63;
  margin: 0 10px;
}

.tabs {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}
.tabs button {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid #8d6e63;
  color: #bcaaa4;
  padding: 8px 15px;
  cursor: pointer;
  font-family: "Cinzel";
  font-weight: bold;
  transition: 0.3s;
}
.tabs button.active {
  background: var(--red-seal);
  color: #fff;
  border-color: var(--red-seal);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

/* Panels */
.content-panel {
  padding: 25px;
  border: 2px solid var(--wood-light);
  border-radius: 4px;
  margin-bottom: 30px;
  min-height: 400px;
}
.panel-title {
  font-family: "Cinzel";
  color: var(--wood-dark);
  border-bottom: 2px double var(--wood-dark);
  padding-bottom: 10px;
  margin-bottom: 25px;
  text-align: center;
  font-size: 1.6em;
  letter-spacing: 2px;
}

/* Tables */
.ancient-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
}
.ancient-table th {
  background: var(--wood-light);
  color: #fff;
  padding: 12px;
  font-family: "Cinzel";
  font-size: 0.9em;
  text-align: left;
}
.ancient-table td {
  padding: 10px;
  border-bottom: 1px dashed #8d6e63;
  color: var(--text-ink);
}
.stamp {
  padding: 3px 8px;
  border: 1px solid;
  font-weight: bold;
  font-size: 0.75em;
  border-radius: 4px;
}
.stamp.green {
  color: #2e7d32;
  border-color: #2e7d32;
}
.stamp.red {
  color: #c62828;
  border-color: #c62828;
}

.btn-icon {
  background: transparent;
  border: none;
  font-size: 1.1em;
  margin-right: 5px;
  cursor: pointer;
}
.btn-icon.red {
  color: #c62828;
}
.btn-icon.green {
  color: #2e7d32;
}
.btn-icon.gray {
  color: #5d4037;
}

/* Stats Panel */
.stats-panel {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}
.stat-card {
  padding: 20px;
  text-align: center;
  border: 2px solid var(--wood-light);
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}
.stat-card h3 {
  font-family: "Cinzel";
  font-size: 1em;
  color: var(--wood-dark);
  border-bottom: 1px dashed #8d6e63;
  padding-bottom: 5px;
  margin-bottom: 10px;
}
.num {
  font-size: 2.2em;
  font-weight: bold;
  color: var(--red-seal);
  font-family: "Cinzel";
}
.seal-bg {
  position: absolute;
  bottom: -10px;
  right: -10px;
  font-size: 4em;
  opacity: 0.1;
  color: var(--wood-dark);
  transform: rotate(-15deg);
}

/* Modal */
.ancient-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 2000;
  display: flex;
  justify-content: center;
  align-items: center;
}
.ancient-modal {
  width: 400px;
  border: 4px double var(--wood-dark);
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.8);
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
  text-align: center;
}
.modal-actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
  justify-content: center;
}

/* Inputs & Buttons */
.ink-input {
  width: 100%;
  background: transparent;
  border: none;
  border-bottom: 2px solid var(--wood-light);
  padding: 8px 5px;
  font-family: "Playfair Display";
  font-weight: bold;
  outline: none;
  transition: 0.3s;
}
.ink-input:focus {
  border-bottom-color: var(--red-seal);
  background: rgba(183, 28, 28, 0.05);
}
.text-area {
  resize: vertical;
  border: 1px solid var(--wood-light);
  padding: 10px;
  border-radius: 4px;
}

.btn-wood {
  padding: 10px 25px;
  background: #efebe9;
  border: 2px solid var(--wood-dark);
  color: var(--wood-dark);
  font-family: "Cinzel";
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;
}
.btn-wood:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
.btn-wood.primary {
  background: var(--red-seal);
  color: #fff;
  border-color: #b71c1c;
}
.btn-wood.red {
  background: #c62828;
  color: white;
  border-color: #b71c1c;
}

.create-box {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px dashed #8d6e63;
  background: rgba(255, 255, 255, 0.4);
}
.form-row {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.empty-msg {
  text-align: center;
  color: #8d6e63;
  font-style: italic;
  font-size: 1.2em;
  padding: 50px;
}
</style>
