// src/utils/assetHelper.js

// --- MOCK ASSET PATHS (Simulated Imports) ---
// Chú ý: Các URL này là placeholder để hiển thị trong mockup.
const ASSET_PATHS = {
  YASUO_IDLE: "https://placehold.co/64x64/3e2723/ffecb3?text=YI",
  YASUO_RUN: "https://placehold.co/64x64/3e2723/ffecb3?text=YR",
  YASUO_ATK: "https://placehold.co/64x64/3e2723/ffecb3?text=YA",
  LANGKHACH_IDLE: "https://placehold.co/64x64/5d4037/eaddcf?text=LI",
  LANGKHACH_RUN: "https://placehold.co/64x64/5d4037/eaddcf?text=LR",
  LANGKHACH_ATK: "https://placehold.co/64x64/5d4037/eaddcf?text=LA",
  GOBLIN_IDLE: "https://placehold.co/64x64/1b5e20/aed581?text=GO",
  GOBLIN_ATK: "https://placehold.co/64x64/1b5e20/ffcdd2?text=GA",
  SKELETON_IDLE: "https://placehold.co/64x64/795548/fff8e1?text=SK",
  SKELETON_ATK: "https://placehold.co/64x64/795548/ffcdd2?text=SA",
  MUSHROOM_IDLE: "https://placehold.co/64x64/b71c1c/ffcdd2?text=MU",
  MUSHROOM_ATK: "https://placehold.co/64x64/b71c1c/ffcdd2?text=MA",
  GOLD_COIN: "https://placehold.co/32x32/ffd700/000?text=Xu",
  WOOD_LOG: "https://placehold.co/32x32/8d6e63/3e2723?text=GO",
  STONE: "https://placehold.co/32x32/78909c/3e2723?text=ĐA",
  COPPER_BAR: "https://placehold.co/32x32/bf360c/fff8e1?text=ĐB",
};

// ============================================================
// 1. HỆ THỐNG SKINS (NHÂN VẬT)
// ============================================================
export const CHARACTER_SKINS = {
  skin_yasou: {
    id: "skin_yasou",
    name: "Lãng Khách Già",
    description: "Kẻ lang thang với thanh kiếm gió.",
    sprites: {
      idle: ASSET_PATHS.YASUO_IDLE,
      run: ASSET_PATHS.YASUO_RUN,
      attack: ASSET_PATHS.YASUO_ATK,
    },
  },
  skin_langkhach: {
    // THÊM SKIN MỚI
    id: "skin_langkhach",
    name: "Lãng Khách Trẻ",
    description: "Vô danh kiếm sĩ giữa giang hồ.",
    sprites: {
      idle: ASSET_PATHS.LANGKHACH_IDLE,
      run: ASSET_PATHS.LANGKHACH_RUN,
      attack: ASSET_PATHS.LANGKHACH_ATK,
    },
  },
  // Bạn có thể thêm skin khác vào đây (ví dụ Ninja...)
};

// [HÀM QUAN TRỌNG] Lấy Skin hiện tại
export const getCurrentSkin = (avatarUrl) => {
  // MOCK: Đặt fallback là 'skin_langkhach'
  if (avatarUrl && CHARACTER_SKINS[avatarUrl]) {
    return CHARACTER_SKINS[avatarUrl];
  }
  return CHARACTER_SKINS["skin_langkhach"] || CHARACTER_SKINS["skin_yasou"];
};

// ============================================================
// 2. HỆ THỐNG QUÁI VẬT & ITEM
// ============================================================
const enemyMap = {
  "Yêu Tinh": { idle: ASSET_PATHS.GOBLIN_IDLE, atk: ASSET_PATHS.GOBLIN_ATK },
  "Bộ Xương": {
    idle: ASSET_PATHS.SKELETON_IDLE,
    atk: ASSET_PATHS.SKELETON_ATK,
  },
  "Nấm Độc": { idle: ASSET_PATHS.MUSHROOM_IDLE, atk: ASSET_PATHS.MUSHROOM_ATK },
  default: { idle: ASSET_PATHS.GOBLIN_IDLE, atk: ASSET_PATHS.GOBLIN_ATK },
};

export const getEnemyImage = (name, state = "idle") => {
  const key =
    Object.keys(enemyMap).find((k) => name && name.includes(k)) || "default";
  const target = enemyMap[key];
  return state === "attack" ? target.atk : target.idle;
};

export const getItemImage = (type) => {
  switch (type) {
    case "GOLD":
      return ASSET_PATHS.GOLD_COIN;
    case "WOOD":
      return ASSET_PATHS.WOOD_LOG;
    case "STONE":
      return ASSET_PATHS.STONE;
    default:
      return ASSET_PATHS.COPPER_BAR;
  }
};

export const getRandomEnemyData = () => {
  const keys = Object.keys(enemyMap).filter((k) => k !== "default");
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return { name: randomKey, img: enemyMap[randomKey].idle };
};
