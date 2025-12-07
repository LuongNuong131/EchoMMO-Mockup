// import { defineStore } from "pinia";
// import axiosClient from "../api/axiosClient";
// import router from "../router";

// export const useCharacterStore = defineStore("character", {
//   state: () => ({
//     character: null,
//     isLoading: false,
//     logs: [],
//   }),

//   getters: {
//     xpPercent: (state) => {
//       if (!state.character) return 0;
//       const needed = state.character.level * 100; // Hoặc theo công thức backend
//       return Math.min((state.character.currentExp / needed) * 100, 100);
//     },
//     hpPercent: (state) => {
//       if (!state.character) return 0;
//       return Math.min((state.character.hp / state.character.maxHp) * 100, 100);
//     },
//     energyPercent: (state) => {
//       if (!state.character) return 0;
//       return Math.min(
//         (state.character.energy / state.character.maxEnergy) * 100,
//         100
//       );
//     },
//   },

//   actions: {
//     async fetchCharacter() {
//       this.isLoading = true;
//       try {
//         const res = await axiosClient.get("/character/me");
//         this.character = res.data || null;
//       } catch (error) {
//         if (error.response && [401, 403].includes(error.response.status)) {
//           router.push("/login");
//         }
//       } finally {
//         this.isLoading = false;
//       }
//     },

//     async createCharacter(name) {
//       try {
//         const res = await axiosClient.post("/character/create", { name });
//         this.character = res.data;
//         return true;
//       } catch (error) {
//         alert(error.response?.data || "Lỗi tạo nhân vật");
//         return false;
//       }
//     },

//     // Logic Thám Hiểm (Tích hợp GameFi)
//     async explore() {
//       if (!this.character) return;
//       if (this.character.energy < 1) {
//         this.addLog("⚠️ Hết thể lực! Hãy về khách điếm nghỉ ngơi.", "WARNING");
//         return;
//       }

//       try {
//         const res = await axiosClient.post("/exploration/explore");
//         const data = res.data;

//         // Cập nhật state từ response
//         this.character.energy = data.currentEnergy;
//         this.character.currentExp = data.currentExp;
//         this.character.hp = this.character.hp; // Backend chưa trả về HP, giữ nguyên hoặc fetch lại

//         if (data.newLevel) {
//           this.fetchCharacter(); // Reload nếu lên cấp để lấy maxHp mới
//           this.addLog(
//             `🎉 CHÚC MỪNG! Đã đột phá lên Cảnh Giới ${data.newLevel}`,
//             "LEVEL_UP"
//           );
//         }

//         this.addLog(data.message, data.type === "ENEMY" ? "ENEMY" : "INFO");
//       } catch (error) {
//         const msg =
//           error.response?.data?.message || error.response?.data || "Lỗi";
//         if (msg === "CAPTCHA") {
//           throw new Error("CAPTCHA"); // Để view xử lý hiện popup
//         }
//         this.addLog("❌ " + msg, "ERROR");
//       }
//     },

//     addLog(message, type = "INFO") {
//       this.logs.unshift({
//         id: Date.now(),
//         message,
//         type,
//       });
//       if (this.logs.length > 50) this.logs.pop();
//     },
//   },
// });

// =========================================================

// code test
import { defineStore } from "pinia";
import axiosClient from "../api/axiosClient";
import router from "../router";

export const useCharacterStore = defineStore("character", {
  state: () => ({
    character: null,
    isLoading: false,
    logs: [],
    // State di chuyển cho trang Explore (GameFi)
    explorationState: {
      playerPos: 10,
      moveDir: 1
    },
  }),

  getters: {
    xpPercent: (state) => {
      if (!state.character) return 0;
      // Tính nextLevelExp giả định: 100 * lv^2
      const needed = 100 * Math.pow(state.character.lv, 2);
      return Math.min((state.character.exp / needed) * 100, 100);
    },
    hpPercent: (state) => {
      if (!state.character || state.character.maxHp === 0) return 0;
      return Math.min((state.character.hp / state.character.maxHp) * 100, 100);
    },
    energyPercent: (state) => {
      if (!state.character || state.character.maxEnergy === 0) return 0;
      return Math.min((state.character.energy / state.character.maxEnergy) * 100, 100);
    }
  },

  actions: {
    async fetchCharacter() {
      this.isLoading = true;
      try {
        const res = await axiosClient.get("/character/me");
        this.character = res.data;
      } catch (error) {
        if (error.response && [401, 403].includes(error.response.status)) {
          router.push("/login");
        }
      } finally {
        this.isLoading = false;
      }
    },

    async explore() {
      try {
        const res = await axiosClient.post("/exploration/explore");
        const data = res.data;

        // Cập nhật nhanh state nếu có dữ liệu trả về
        if (this.character) {
          this.character.energy = data.currentEnergy;
          this.character.exp = data.currentExp;
          this.character.lv = data.currentLv;
          // Nếu lên cấp, tải lại đầy đủ để lấy maxHp mới
          if (data.newLevel) await this.fetchCharacter();
        }
        return data;
      } catch (e) {
        // Ném lỗi ra để View xử lý (VD: hiện Captcha)
        throw e.response?.data || e;
      }
    }
  }
});