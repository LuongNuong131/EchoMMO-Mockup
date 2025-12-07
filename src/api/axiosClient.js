import axios from "axios";

// --- MOCK ASSET PATHS (Dùng Placeholder URL) ---
const ASSET_PATHS = {
  YASUO_IDLE: "https://placehold.co/64x64/3e2723/ffecb3?text=YI",
  LANGKHACH_IDLE: "https://placehold.co/64x64/5d4037/eaddcf?text=LI",
  LANGKHACH_RUN: "https://placehold.co/64x64/5d4037/eaddcf?text=LR",
  LANGKHACH_ATK: "https://placehold.co/64x64/5d4037/eaddcf?text=LA",
  GOBLIN_IDLE: "https://placehold.co/64x64/1b5e20/aed581?text=GO",
  SKELETON_IDLE: "https://placehold.co/64x64/795548/fff8e1?text=SK",
  MUSHROOM_IDLE: "https://placehold.co/64x64/b71c1c/ffcdd2?text=MU",
  WEAPON_SWORD: "https://placehold.co/48x48/607d8b/fff?text=Kiếm",
  ARMOR_PLATE: "https://placehold.co/48x48/4e342e/fff?text=Giáp",
  HELMET_IRON: "https://placehold.co/48x48/263238/fff?text=Mũ",
};

// --- MOCK USER DATA FOR LOGIN ---
const MOCK_USERS_DATA = {
  // 1. ADMIN USER (admin/123)
  admin: {
    userId: 99,
    username: "admin",
    role: "ADMIN",
    avatarUrl: "skin_yasou",
    wallet: { gold: 9999999, diamonds: 5000, userId: 99 },
  },
  // 2. REGULAR USER (user/123)
  user: {
    userId: 1,
    username: "user",
    role: "USER",
    avatarUrl: "skin_langkhach",
    wallet: { gold: 123456, diamonds: 100, userId: 1 },
  },
  // 3. BANNED USER (giamcam/123)
  giamcam: {
    userId: 2,
    username: "giamcam",
    role: "USER",
    avatarUrl: "skin_langkhach",
    isBanned: true,
  },
};

const MOCK_CHARACTER = {
  lv: 55,
  exp: 1250,
  nextLevelExp: 3025,
  hp: 4500,
  maxHp: 5000,
  energy: 45,
  maxEnergy: 50,
  baseAtk: 185,
  baseDef: 120,
  baseSpeed: 10,
  baseCritRate: 15,
};

// --- CÁC MOCK DATA MỚI VÀ CẬP NHẬT ---
const MOCK_QUESTS = [
  // Yêu cầu: 1 nhiệm vụ đã hoàn thành, sẵn sàng nhận
  {
    id: 701,
    description: "Tiêu diệt 10 quái vật trong Rừng Chạng Vạng",
    progress: 10,
    target: 10,
    rewardGold: 500,
    isClaimed: false,
  },
  {
    id: 702,
    description: "Đăng nhập 7 ngày liên tiếp",
    progress: 3,
    target: 7,
    rewardGold: 1000,
    isClaimed: false,
  },
  {
    id: 703,
    description: "Hoàn thành 100 lần Hành Tẩu",
    progress: 100,
    target: 100,
    rewardGold: 2000,
    isClaimed: true,
  },
];

const MOCK_CHAT_MESSAGES = [
  // Yêu cầu: admin (Hello server) & user (Hello admin)
  {
    id: 601,
    senderName: "admin",
    content: "Hello server",
    time: "10:00:00",
    role: "ADMIN",
  },
  {
    id: 602,
    senderName: "user",
    content: "Hello admin",
    time: "10:01:30",
    role: "USER",
  },
];

const MOCK_DM_MESSAGES = [
  // Yêu cầu: Chat giữa admin và user (Hello)
  {
    id: 611,
    sender: { userId: 99, username: "admin" },
    content: "Hello",
    time: "10:05:00",
  },
  {
    id: 612,
    sender: { userId: 1, username: "user" },
    content: "Hello",
    time: "10:06:00",
  },
];

const MOCK_FRIENDS = [
  // Yêu cầu: admin đã kết bạn với user và ngược lại
  {
    id: 401,
    requester: MOCK_USERS_DATA["admin"],
    addressee: MOCK_USERS_DATA["user"],
  },
];

const MOCK_NOTIFICATIONS = [
  // Yêu cầu: Thêm thông báo Khai trương Server
  {
    id: 501,
    title: "Khai trương Server",
    message:
      "Chào mừng các đại hiệp, máy chủ đã chính thức khai mở. Chúc quý đại hiệp hành tẩu vui vẻ!",
    isRead: false,
    type: "INFO",
    createdAt: Date.now(),
  },
  {
    id: 502,
    title: "Lĩnh Thưởng",
    message: "Đã nhận được 1000 Xu từ nhiệm vụ hàng ngày.",
    isRead: false,
    type: "SUCCESS",
    createdAt: Date.now() - 3600000,
  },
];
const MOCK_INVENTORY_ITEMS = [
  {
    userItemId: 101,
    quantity: 1,
    isEquipped: true,
    enhanceLevel: 5,
    item: {
      itemId: 1,
      name: "Thanh Long Kiếm",
      type: "WEAPON",
      rarity: "S",
      basePrice: 50000,
      imageUrl: ASSET_PATHS.WEAPON_SWORD,
      atkBonus: 50,
      defBonus: 0,
      description: "Cây kiếm được rèn từ ngàn năm băng tuyết.",
    },
  },
  {
    userItemId: 106,
    quantity: 1,
    isEquipped: true,
    enhanceLevel: 0,
    item: {
      itemId: 6,
      name: "Mũ Khai Tâm",
      type: "HELMET",
      rarity: "B",
      basePrice: 1000,
      imageUrl: ASSET_PATHS.HELMET_IRON,
      atkBonus: 5,
      defBonus: 5,
    },
  },
  {
    userItemId: 107,
    quantity: 1,
    isEquipped: true,
    enhanceLevel: 0,
    item: {
      itemId: 7,
      name: "Giày Thổ",
      type: "BOOTS",
      rarity: "C",
      basePrice: 500,
      imageUrl: "https://placehold.co/48x48/8d6e63/fff?text=Giày",
      atkBonus: 0,
      defBonus: 2,
    },
  },
  {
    userItemId: 103,
    quantity: 125,
    isEquipped: false,
    enhanceLevel: 0,
    item: {
      itemId: 3,
      name: "Hồi Lực Hoàn",
      type: "CONSUMABLE",
      rarity: "C",
      basePrice: 100,
      imageUrl: "https://placehold.co/32x32/b71c1c/fff?text=HP",
      hpBonus: 100,
    },
  },
];
const MOCK_ADMIN_STATS = {
  totalUsers: 12345,
  totalItems: 9876,
  totalGold: 123456789,
};
const MOCK_ADMIN_USERS = [
  {
    userId: 99,
    username: "admin",
    email: "admin@admin.com",
    role: "ADMIN",
    isActive: true,
  },
  {
    userId: 1,
    username: "user",
    email: "user@user.com",
    role: "USER",
    isActive: true,
  },
  {
    userId: 2,
    username: "giamcam",
    email: "gc@gc.com",
    role: "USER",
    isActive: false,
  },
];
const MOCK_BATTLE_RESULT = {
  enemy: { enemyId: 1, name: "Yêu Tinh", level: 50 },
  enemyHp: 60,
  enemyMaxHp: 100,
  playerHp: 4400,
  playerMaxHp: 5000,
  status: "ONGOING",
  combatLog: [
    "Bạn tấn công! Gây 20 sát thương.",
    "Yêu Tinh tấn công lại! Bạn mất 100 HP.",
  ],
  expEarned: 0,
  goldEarned: 0,
};

const axiosClient = {
  get: (url) =>
    new Promise((resolve) =>
      setTimeout(() => {
        let data;
        if (url.includes("/user/me")) data = MOCK_USERS_DATA["user"];
        else if (url.includes("/character/me")) data = MOCK_CHARACTER;
        else if (url.includes("/inventory/me"))
          data = MOCK_INVENTORY_ITEMS.map((i) => ({
            ...i,
            userItemId: i.userItemId.toString(),
          }));
        else if (url.includes("/leaderboard/level"))
          data = MOCK_LEVEL_LEADERBOARD;
        else if (url.includes("/admin/stats")) data = MOCK_ADMIN_STATS;
        else if (url.includes("/admin/users")) data = MOCK_ADMIN_USERS;
        else if (url.includes("/quests/daily")) data = MOCK_QUESTS;
        else if (url.includes("/chat/recent")) data = MOCK_CHAT_MESSAGES;
        // Cập nhật logic DM để trả về DM Messages
        else if (url.includes("/dm/"))
          data = MOCK_DM_MESSAGES.map((m) => ({
            ...m,
            sender: { userId: m.sender.userId, username: m.sender.username },
          }));
        else if (url.includes("/friends/list")) data = MOCK_FRIENDS;
        else if (url.includes("/notifications")) data = MOCK_NOTIFICATIONS;
        else if (url.includes("/notifications/unread-count"))
          data = MOCK_NOTIFICATIONS.filter((n) => !n.isRead).length;
        else if (url.includes("/market/shop-items"))
          data = [
            {
              itemId: 10,
              name: "Thịt Rừng",
              type: "CONSUMABLE",
              rarity: "C",
              basePrice: 5,
              imageUrl: "https://placehold.co/48x48/f57f17/000?text=Thịt",
            },
          ];
        else data = [];
        resolve({ data });
      }, 500)
    ),

  post: (url, payload) =>
    new Promise((resolve, reject) =>
      setTimeout(() => {
        let response;
        const username = payload.username?.toLowerCase();

        if (url.includes("/auth/login")) {
          const targetUser = MOCK_USERS_DATA[username];
          if (targetUser && payload.password === "123") {
            if (targetUser.isBanned) {
              return reject({
                response: {
                  status: 403,
                  data: {
                    error: "BANNED",
                    reason: "Phạm luật giang hồ: Mở nhiều tài khoản.",
                    date: Date.now(),
                  },
                },
              });
            }
            response = { data: { token: "MOCK_TOKEN", ...targetUser } };
          } else {
            return reject({
              response: { data: "Thông tin đăng nhập không chính xác." },
            });
          }
        } else if (url.includes("/quests/claim/701")) {
          MOCK_QUESTS[0].isClaimed = true;
          MOCK_USERS_DATA["user"].wallet.gold += MOCK_QUESTS[0].rewardGold;
          response = {
            data: `Đã nhận thưởng ${MOCK_QUESTS[0].rewardGold} Lượng!`,
          };
        } else if (url.includes("/exploration/explore")) {
          const roll = Math.random();
          if (roll < 0.4) {
            response = {
              data: {
                type: "GOLD",
                message: "✨ May mắn! Bạn nhặt được 50 Gold!",
                currentEnergy: MOCK_CHARACTER.energy,
                currentExp: MOCK_CHARACTER.exp + 10,
                currentLv: MOCK_CHARACTER.lv,
                currentGold: MOCK_USERS_DATA["user"].wallet.gold + 50,
              },
            };
          } else {
            response = {
              data: {
                type: "ENEMY",
                message: "QUÁI VẬT XUẤT HIỆN!",
                currentEnergy: MOCK_CHARACTER.energy,
                currentExp: MOCK_CHARACTER.exp + 5,
                currentLv: MOCK_CHARACTER.lv,
                currentGold: MOCK_USERS_DATA["user"].wallet.gold,
              },
            };
          }
        } else if (
          url.includes("/battle/start") ||
          url.includes("/battle/attack")
        ) {
          MOCK_BATTLE_RESULT.enemyHp -= 20; // Mock sát thương
          if (MOCK_BATTLE_RESULT.enemyHp <= 0) {
            MOCK_BATTLE_RESULT.status = "VICTORY";
            MOCK_BATTLE_RESULT.expEarned = 150;
            MOCK_BATTLE_RESULT.goldEarned = 50;
          }
          response = { data: { ...MOCK_BATTLE_RESULT } };
        } else if (url.includes("/game/rest")) {
          MOCK_USERS_DATA["user"].wallet.gold -= 50;
          MOCK_CHARACTER.hp = MOCK_CHARACTER.maxHp;
          MOCK_CHARACTER.energy = MOCK_CHARACTER.maxEnergy;
          response = { data: "Hồi phục hoàn tất!" };
        } else {
          response = { data: "Mock Success" };
        }

        resolve(response);
      }, 500)
    ),
  interceptors: { request: { use: (config) => config } },
};

export default axiosClient;
