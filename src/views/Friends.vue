<template>
  <div class="page-container friends-page ancient-theme">
    <div class="wood-bg-layer"></div>

    <div class="network-wrapper">
      <div class="network-header wood-panel">
        <div class="header-ornament left"></div>
        <div class="header-ornament right"></div>

        <h2 class="title-ancient">
          <span class="ornament">❖</span> GIANG HỒ HẢO HỮU
          <span class="ornament">❖</span>
        </h2>

        <div class="search-box-wrapper">
          <div class="search-paper-input">
            <i class="fas fa-search search-icon"></i>
            <input
              v-model="searchName"
              placeholder="Nhập tên hoặc ID nhân sĩ..."
              class="real-input"
              @keyup.enter="addFriend"
            />
          </div>
          <button @click="addFriend" class="btn-connect">
            <span class="btn-text">KẾT GIAO</span>
            <i class="fas fa-user-plus"></i>
          </button>
        </div>
      </div>

      <div class="network-body">
        <transition name="fade">
          <div
            v-if="friendStore.requests.length"
            class="requests-panel paper-texture"
          >
            <div class="panel-label">
              <i class="fas fa-envelope-open-text"></i> THƯ MỜI KẾT GIAO ({{
                friendStore.requests.length
              }})
            </div>
            <div class="req-grid custom-scroll">
              <div
                v-for="req in friendStore.requests"
                :key="req.id"
                class="req-card"
              >
                <div class="req-info">
                  <div class="avatar-circle pending">
                    <span>{{
                      req.requester.username.charAt(0).toUpperCase()
                    }}</span>
                  </div>
                  <span class="req-name">{{ req.requester.username }}</span>
                </div>
                <div class="req-actions">
                  <button
                    @click="friendStore.accept(req.id)"
                    class="btn-seal success"
                    title="Chấp thuận"
                  >
                    <i class="fas fa-check"></i>
                  </button>
                  <button
                    @click="friendStore.remove(req.id)"
                    class="btn-seal danger"
                    title="Từ chối"
                  >
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </transition>

        <div class="friends-panel wood-border">
          <div class="panel-header">
            <h3><i class="fas fa-users"></i> DANH SÁCH BẰNG HỮU</h3>
            <span class="count-badge"
              >{{ friendStore.friends.length }} TRI KỶ</span
            >
          </div>

          <div v-if="friendStore.friends.length === 0" class="empty-state">
            <i class="fas fa-wind"></i>
            <p>CHƯA CÓ TRI KỶ</p>
          </div>

          <div v-else class="friend-list custom-scroll">
            <div
              v-for="f in friendStore.friends"
              :key="f.id"
              class="friend-slot"
            >
              <div class="slot-left">
                <div class="avatar-frame">
                  <span class="char">{{
                    getFriendName(f).charAt(0).toUpperCase()
                  }}</span>
                  <div class="status-dot"></div>
                </div>
                <div class="slot-info">
                  <span class="slot-name">{{ getFriendName(f) }}</span>
                  <span class="slot-status">Đang hành tẩu giang hồ</span>
                </div>
              </div>

              <div class="slot-actions">
                <button @click="openChat(f)" class="btn-action chat">
                  <i class="fas fa-comment-dots"></i> TRUYỀN ÂM
                </button>
                <button
                  @click="friendStore.remove(f.id)"
                  class="btn-action del"
                  title="Cắt đứt quan hệ"
                >
                  <i class="fas fa-user-slash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <transition name="pop-up">
        <div v-if="showChatModal" class="ancient-chat-window paper-texture">
          <div class="chat-header">
            <div class="target-info">
              <span class="label">MẬT THƯ ::</span>
              <span class="target-name">{{ chatTargetName }}</span>
            </div>
            <button @click="closeChat" class="btn-close">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div class="chat-stream custom-scroll" ref="msgBox">
            <div
              v-for="msg in messages"
              :key="msg.id"
              class="msg-row"
              :class="{ me: msg.sender.username === authStore.user.username }"
            >
              <div class="msg-content">
                {{ msg.content }}
              </div>
            </div>
            <div v-if="messages.length === 0" class="chat-init">
              -- Khởi tạo bồ câu đưa thư --
            </div>
          </div>

          <div class="chat-input-zone">
            <span class="brush-icon">✍</span>
            <input
              v-model="chatInput"
              @keyup.enter="sendDM"
              placeholder="Viết thư..."
              ref="inputFocus"
              class="input-scroll"
            />
            <button @click="sendDM" class="btn-send">
              GỬI <i class="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, onUnmounted } from "vue";
import { useFriendStore } from "../stores/friendStore";
import { useAuthStore } from "../stores/authStore";
import axiosClient from "../api/axiosClient";

const friendStore = useFriendStore();
const authStore = useAuthStore();
const searchName = ref("");

// Chat state
const showChatModal = ref(false);
const chatTargetId = ref(null);
const chatTargetName = ref("");
const messages = ref([]);
const chatInput = ref("");
const msgBox = ref(null);
const inputFocus = ref(null);

let chatInterval = null;

onMounted(() => friendStore.fetchAll());
onUnmounted(() => stopChatPolling());

const addFriend = async () => {
  if (!searchName.value) return;
  await friendStore.sendRequest(searchName.value);
  searchName.value = "";
};

const getFriendName = (f) => {
  // MOCK: Giả định chỉ có 1 UserID là của bản thân (ID 1 hoặc 99)
  const isMe = [1, 99].includes(authStore.user.userId);

  if (isMe && f.requester.username === authStore.user.username) {
    return f.addressee.username;
  }
  return f.requester.username;
};

const getFriendUserId = (f) => {
  const isMe = [1, 99].includes(authStore.user.userId);

  if (isMe && f.requester.username === authStore.user.username) {
    return f.addressee.userId;
  }
  return f.requester.userId;
};

const openChat = async (f) => {
  const friendId = getFriendUserId(f);
  chatTargetId.value = friendId;
  chatTargetName.value = getFriendName(f);

  await fetchMessages();
  showChatModal.value = true;
  scrollToBottom();

  nextTick(() => inputFocus.value?.focus());

  stopChatPolling();
  // MOCK: Giảm tần suất polling cho Mockup
  chatInterval = setInterval(fetchMessages, 5000);
};

const closeChat = () => {
  showChatModal.value = false;
  stopChatPolling();
};

const stopChatPolling = () => {
  if (chatInterval) {
    clearInterval(chatInterval);
    chatInterval = null;
  }
};

const fetchMessages = async () => {
  if (!chatTargetId.value) return;
  try {
    // MOCK: Hiện tại API DM chưa được mock
    const res = await axiosClient.get(`/dm/${chatTargetId.value}`);
    if (res.data.length) {
      messages.value = res.data;
      scrollToBottom();
    }
  } catch (e) {
    // console.error("Lỗi tải chat", e);
  }
};

const sendDM = async () => {
  if (!chatInput.value.trim()) return;

  const content = chatInput.value;
  chatInput.value = "";

  try {
    // MOCK: Giả lập tin nhắn gửi thành công
    messages.value.push({
      id: Date.now(),
      content: content,
      sender: { username: authStore.user.username },
      time: new Date().toLocaleTimeString(),
    });
    scrollToBottom();
  } catch (e) {
    // Xử lý lỗi
  }
};

const scrollToBottom = () => {
  nextTick(() => {
    if (msgBox.value) msgBox.value.scrollTop = msgBox.value.scrollHeight;
  });
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Cinzel:wght@400;700&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&display=swap");

/* --- VARIABLES --- */
:root {
  --bg-dark: #1a1510;
  --wood-dark: #3e2723;
  --wood-light: #5d4037;
  --paper-bg: #fdf5e6;
  --gold-accent: #fbc02d;
  --red-seal: #b71c1c;
  --text-ink: #2c1810;
}

/* --- BASE LAYOUT --- */
.friends-page.ancient-theme {
  background: var(--bg-dark);
  min-height: 100vh;
  font-family: "Playfair Display", serif;
  color: #d7ccc8;
  position: relative;
  overflow-x: hidden;
}

.wood-bg-layer {
  position: absolute;
  inset: 0;
  background-image: url("https://www.transparenttextures.com/patterns/wood-pattern.png");
  background-color: #261815;
  z-index: 0;
  pointer-events: none;
}

.network-wrapper {
  position: relative;
  z-index: 10;
  max-width: 800px;
  margin: 0 auto;

  /* Chỉnh lại padding để cân đối hơn */
  padding: 80px 20px 0px 20px;

  display: flex;
  flex-direction: column;
  gap: 20px;

  /* Đảm bảo wrapper chiếm full chiều cao để tính toán calc() chính xác */
  height: 100vh;
  box-sizing: border-box;
}

/* --- TEXTURES --- */
.wood-panel {
  background: var(--wood-dark);
  background-image: url("https://www.transparenttextures.com/patterns/wood-pattern.png");
  border: 4px solid var(--wood-light);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
}
.paper-texture {
  background-color: var(--paper-bg);
  background-image: url("https://www.transparenttextures.com/patterns/aged-paper.png");
  color: var(--text-ink);
}
.wood-border {
  border: 4px solid var(--wood-light);
  background: rgba(38, 24, 21, 0.95);
}

/* --- HEADER --- */
.network-header {
  text-align: center;
  padding: 25px 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.title-ancient {
  font-size: 2em;
  font-family: "Cinzel", serif;
  color: var(--gold-accent);
  text-shadow: 2px 2px 4px #000;
  margin: 0;
}
.ornament {
  color: #8d6e63;
  margin: 0 10px;
  font-size: 0.8em;
}

/* --- TÌM KIẾM --- */
.search-box-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin: 0 auto;
  width: 100%;
  max-width: 600px;
  background: rgba(0, 0, 0, 0.2);
  padding: 10px;
  border-radius: 8px;
  border: 1px solid rgba(141, 110, 99, 0.3);
}

.search-paper-input {
  flex: 1;
  display: flex;
  align-items: center;
  background-color: #fdf5e6;
  background-image: url("https://www.transparenttextures.com/patterns/aged-paper.png");
  padding: 8px 15px;
  border-radius: 4px;
  border: 2px solid #8d6e63;
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: 0.3s;
}
.search-paper-input:focus-within {
  border-color: var(--gold-accent);
  box-shadow: 0 0 10px rgba(251, 192, 45, 0.3);
}
.search-icon {
  color: #5d4037;
  font-size: 1.1em;
  margin-right: 10px;
  opacity: 0.7;
}
.real-input {
  width: 100%;
  border: none;
  background: transparent;
  outline: none;
  font-family: "Playfair Display", serif;
  font-weight: bold;
  font-size: 1.1em;
  color: #2c1810;
}
.real-input::placeholder {
  color: #a1887f;
  font-weight: normal;
  font-style: italic;
}
.btn-connect {
  background: var(--red-seal);
  color: #fff;
  border: 2px solid #b71c1c;
  padding: 10px 20px;
  font-family: "Cinzel", serif;
  font-weight: bold;
  font-size: 1em;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.4);
  transition: all 0.2s;
  white-space: nowrap;
}
.btn-connect:hover {
  background: #d32f2f;
  transform: translateY(-2px);
  box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.5);
}

/* --- REQUESTS --- */
.requests-panel {
  padding: 15px;
  border-radius: 4px;
  border: 2px solid var(--wood-light);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  margin-bottom: 20px;
}
.panel-label {
  color: var(--red-seal);
  font-weight: bold;
  font-family: "Cinzel";
  border-bottom: 1px dashed var(--red-seal);
  padding-bottom: 5px;
  margin-bottom: 15px;
}
.req-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 15px;
}
.req-card {
  background: rgba(255, 255, 255, 0.5);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #d7ccc8;
}
.req-info {
  display: flex;
  align-items: center;
  gap: 10px;
}
.avatar-circle.pending {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: var(--red-seal);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-family: "Cinzel";
}
.req-name {
  font-weight: bold;
  color: var(--text-ink);
}
.req-actions {
  display: flex;
  gap: 5px;
}
.btn-seal {
  width: 30px;
  height: 30px;
  border: 1px solid;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9em;
  transition: 0.2s;
}
.btn-seal.success {
  background: #2e7d32;
  color: #fff;
  border-color: #1b5e20;
}
.btn-seal.danger {
  background: #c62828;
  color: #fff;
  border-color: #b71c1c;
}
.btn-seal:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

/* --- FRIENDS LIST --- */
.friends-panel {
  border-radius: 4px;
  overflow: hidden;

  /* CŨ: height: 500px; -> Gây tràn màn hình */

  /* MỚI: Tự động tính toán chiều cao */
  /* Lấy 100% chiều cao màn hình TRỪ đi khoảng 300px (Header + Search + Padding) */
  height: calc(100vh - 300px);

  /* Đảm bảo khung không bị quá nhỏ trên màn hình thấp */
  min-height: 300px;

  display: flex;
  flex-direction: column;

  /* Thêm margin bottom để không dính sát đáy nếu có nội dung khác */
  margin-bottom: 20px;
}
.panel-header {
  background: var(--wood-dark);
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid var(--wood-light);
}
.panel-header h3 {
  color: var(--gold-accent);
  margin: 0;
  font-family: "Cinzel";
  font-size: 1.1em;
}
.count-badge {
  background: var(--wood-light);
  color: #d7ccc8;
  padding: 2px 8px;
  font-size: 0.8em;
  border-radius: 4px;
  font-weight: bold;
}
.friend-list {
  padding: 15px;

  /* Quan trọng: Flex 1 để chiếm hết phần còn lại trong .friends-panel */
  flex: 1;

  /* Quan trọng: Chỉ cuộn khu vực danh sách này, không cuộn cả trang */
  overflow-y: auto;

  background: rgba(0, 0, 0, 0.3);
}
.empty-state {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #8d6e63;
}
.empty-state i {
  font-size: 3em;
  margin-bottom: 10px;
  opacity: 0.5;
}
.friend-slot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #3e2723;
  margin-bottom: 10px;
  padding: 10px 15px;
  border: 1px solid #5d4037;
  border-radius: 4px;
  transition: 0.2s;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}
.friend-slot:hover {
  border-color: var(--gold-accent);
  transform: translateX(5px);
}
.slot-left {
  display: flex;
  align-items: center;
  gap: 15px;
}
.avatar-frame {
  width: 45px;
  height: 45px;
  background: #1a1510;
  border: 2px solid #8d6e63;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fbc02d;
  font-weight: bold;
  font-family: "Cinzel";
  position: relative;
}
.status-dot {
  width: 10px;
  height: 10px;
  background: #2e7d32;
  border-radius: 50%;
  position: absolute;
  bottom: 0;
  right: 0;
  border: 2px solid #3e2723;
}
.slot-name {
  font-weight: bold;
  font-size: 1.1em;
  color: #fdf5e6;
}
.slot-status {
  font-size: 0.8em;
  color: #a1887f;
  font-style: italic;
}
.btn-action {
  background: transparent;
  border: 1px solid #8d6e63;
  color: #bcaaa4;
  padding: 6px 12px;
  cursor: pointer;
  margin-left: 5px;
  font-size: 0.8em;
  transition: 0.2s;
  font-family: "Cinzel";
  font-weight: bold;
}
.btn-action:hover {
  color: #fff;
  border-color: #fff;
}
.btn-action.chat:hover {
  background: #5d4037;
  color: var(--gold-accent);
  border-color: var(--gold-accent);
}
.btn-action.del:hover {
  background: #c62828;
  color: #fff;
  border-color: #ff8a80;
}

/* --- CHAT MODAL (ANCIENT STYLE) --- */
.ancient-chat-window {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 360px;
  height: 500px;
  background: var(--paper-bg);
  border: 4px double var(--wood-dark);
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  z-index: 9999;
}

.chat-header {
  background: var(--wood-dark);
  padding: 10px;
  border-bottom: 2px solid var(--gold-accent);
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  position: relative;
}
.target-info {
  font-family: "Cinzel";
  font-size: 0.9em;
  color: #d7ccc8;
}
.target-name {
  font-weight: bold;
  margin-left: 5px;
  color: var(--gold-accent);
  font-size: 1.1em;
}
.btn-close {
  background: none;
  border: none;
  color: #bcaaa4;
  font-size: 1.2em;
  cursor: pointer;
}
.btn-close:hover {
  color: #ef5350;
}

/* --- CHAT STREAM (NỀN KHUNG CHAT MỚI) --- */
.chat-stream {
  flex: 1;
  padding: 20px 15px;
  overflow-y: auto;
  background-color: #fdf5e6;
  background-image: linear-gradient(
    rgba(141, 110, 99, 0.15) 1px,
    transparent 1px
  );
  background-size: 100% 2rem;
}

/* Dòng tin nhắn */
.msg-row {
  margin-bottom: 18px;
  display: flex;
  align-items: flex-end;
}
.msg-row.me {
  justify-content: flex-end;
}

/* Nội dung tin nhắn (Bong bóng) */
.msg-content {
  position: relative;
  padding: 10px 16px;
  max-width: 85%;
  font-size: 1rem;
  line-height: 1.5;
  font-family: "Merriweather", serif;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
  word-wrap: break-word;
}

/* Style cho BẰNG HỮU (Tin đến) */
.msg-row:not(.me) .msg-content {
  background: #ffffff;
  color: #3e2723;
  border: 1px solid #d7ccc8;
  border-radius: 12px 12px 12px 2px;
  margin-left: 5px;
}
/* Đuôi tin nhắn đến */
.msg-row:not(.me) .msg-content::before {
  content: "";
  position: absolute;
  bottom: -1px;
  left: -8px;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 8px 10px 0;
  border-color: transparent #d7ccc8 transparent transparent;
}
.msg-row:not(.me) .msg-content::after {
  content: "";
  position: absolute;
  bottom: 0px;
  left: -6px;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 8px 10px 0;
  border-color: transparent #ffffff transparent transparent;
}

/* Style cho BẢN THÂN (Tin đi) */
.msg-row.me .msg-content {
  background: #fff3e0;
  color: #bf360c;
  border: 1px solid #ffcc80;
  border-radius: 12px 12px 2px 12px;
  margin-right: 5px;
  font-weight: 500;
}
/* Đuôi tin nhắn đi */
.msg-row.me .msg-content::before {
  content: "";
  position: absolute;
  bottom: -1px;
  right: -8px;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 10px 8px 0 0;
  border-color: #ffcc80 transparent transparent transparent;
}
.msg-row.me .msg-content::after {
  content: "";
  position: absolute;
  bottom: 0px;
  right: -6px;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 10px 8px 0 0;
  border-color: #fff3e0 transparent transparent transparent;
}

.chat-init {
  text-align: center;
  color: #8d6e63;
  font-style: italic;
  font-size: 0.8em;
  margin-top: 20px;
}

.chat-input-zone {
  padding: 10px;
  border-top: 2px solid var(--wood-light);
  display: flex;
  gap: 8px;
  align-items: center;
  background: #efebe9;
}
.brush-icon {
  font-size: 1.2em;
  color: var(--wood-dark);
}
.input-scroll {
  flex: 1;
  background: transparent;
  border: none;
  border-bottom: 1px solid #8d6e63;
  color: var(--text-ink);
  padding: 5px;
  font-family: "Playfair Display";
  font-weight: bold;
  outline: none;
}
.btn-send {
  background: var(--red-seal);
  color: #fff;
  border: 1px solid #b71c1c;
  padding: 5px 12px;
  font-weight: bold;
  cursor: pointer;
  font-family: "Cinzel";
  border-radius: 4px;
}
.btn-send:hover {
  background: #d32f2f;
}

/* Scrollbar & Animation */
.custom-scroll::-webkit-scrollbar {
  width: 6px;
}
.custom-scroll::-webkit-scrollbar-thumb {
  background: #8d6e63;
  border-radius: 3px;
}
.pop-up-enter-active,
.pop-up-leave-active {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.pop-up-enter-from,
.pop-up-leave-to {
  transform: translateY(100%) scale(0.8);
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 600px) {
  .search-box-wrapper {
    flex-direction: column;
    padding: 15px;
  }
  .btn-connect {
    width: 100%;
    justify-content: center;
  }
}
</style>
