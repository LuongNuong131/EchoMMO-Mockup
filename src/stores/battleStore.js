// import { defineStore } from "pinia";
// import axiosClient from "../api/axiosClient";
// import { useCharacterStore } from "./characterStore";

// export const useBattleStore = defineStore("battle", {
//   state: () => ({
//     enemy: null,
//     enemyHp: 0,
//     enemyMaxHp: 0,
//     playerHp: 0,
//     playerMaxHp: 0,
//     combatLogs: [],
//     status: "IDLE",
//     isLoading: false,
//     skills: [],
//     goldEarned: 0,
//     expEarned: 0,
//   }),

//   actions: {
//     async startBattle() {
//       this.isLoading = true;
//       this.combatLogs = [];
//       try {
//         // Gọi API Start Battle
//         const res = await axiosClient.post("/battle/start");
//         this.handleResult(res.data);

//         // Lấy Skill
//         const resSkill = await axiosClient.get("/battle/skills");
//         this.skills = resSkill.data;
//       } catch (e) {
//         this.combatLogs.push("Lỗi: " + e.message);
//       } finally {
//         this.isLoading = false;
//       }
//     },

//     async attack(attackType = "normal", isParried = false) {
//       const charStore = useCharacterStore();
//       this.isLoading = true;
//       try {
//         const res = await axiosClient.post("/battle/attack", {
//           enemyId: this.enemy.enemyId,
//           enemyHp: this.enemyHp,
//           isParried,
//           attackType,
//         });
//         this.handleResult(res.data);

//         // Sync HP/Energy
//         if (res.data.playerHp) charStore.character.hp = res.data.playerHp;
//         if (res.data.playerEnergy)
//           charStore.character.energy = res.data.playerEnergy;
//       } catch (e) {
//         console.error(e);
//       } finally {
//         this.isLoading = false;
//       }
//     },

//     async useSkill(skillId) {
//       const charStore = useCharacterStore();
//       try {
//         const res = await axiosClient.post("/battle/skill", {
//           enemyId: this.enemy.enemyId,
//           enemyHp: this.enemyHp,
//           skillId,
//         });
//         this.handleResult(res.data);
//         if (res.data.playerHp) charStore.character.hp = res.data.playerHp;
//       } catch (e) {
//         console.error(e);
//       }
//     },

//     handleResult(data) {
//       this.enemy = data.enemy;
//       this.enemyHp = data.enemyHp;
//       this.enemyMaxHp = data.enemyMaxHp;
//       this.playerHp = data.playerHp;
//       this.playerMaxHp = data.playerMaxHp;
//       this.status = data.status;

//       // Append logs
//       if (data.combatLog) this.combatLogs.push(...data.combatLog);

//       if (data.status === "VICTORY") {
//         this.goldEarned = data.goldEarned;
//         this.expEarned = data.expEarned;
//       }
//     },

//     resetBattle() {
//       this.status = "IDLE";
//       this.enemy = null;
//       this.combatLogs = [];
//     },
//   },
// });

// =========================================================

//code test
import { defineStore } from "pinia";
import axiosClient from "../api/axiosClient";
import { useCharacterStore } from "./characterStore";

export const useBattleStore = defineStore("battle", {
  state: () => ({
    enemy: null,
    enemyVisual: null, // [MỚI] Lưu tên/ảnh quái từ lúc gặp để thống nhất
    enemyHp: 0,
    enemyMaxHp: 0,
    playerHp: 0,
    playerMaxHp: 0,
    combatLogs: [],
    status: "IDLE",
    goldEarned: 0,
    expEarned: 0,
  }),

  actions: {
    // Set thông tin hình ảnh quái trước khi vào trận
    setEncounter(visualData) {
      this.enemyVisual = visualData;
    },

    async startBattle() {
      this.status = "ONGOING";
      this.combatLogs = [];
      try {
        const res = await axiosClient.post("/battle/start");
        this.handleResult(res.data);
      } catch (e) {
        this.combatLogs.push("Lỗi: " + (e.response?.data || e.message));
      }
    },

    // isBuffed: true nếu người chơi ấn nút Tụ Lực
    async autoTurn(isBuffed) {
      try {
        const res = await axiosClient.post("/battle/attack", {
          enemyId: this.enemy.enemyId,
          enemyHp: this.enemyHp,
          isBuffed: isBuffed // Gửi trạng thái cường hóa lên server
        });
        this.handleResult(res.data);
        return res.data; // Trả về data để view xử lý animation
      } catch (e) {
        console.error(e);
      }
    },

    handleResult(data) {
      this.enemy = data.enemy;
      this.enemyHp = data.enemyHp;
      this.enemyMaxHp = data.enemyMaxHp;
      this.playerHp = data.playerHp;
      this.playerMaxHp = data.playerMaxHp;
      this.status = data.status;

      if (data.combatLog) {
        // Chỉ lấy log mới nhất để hiển thị cho gọn
        this.combatLogs = data.combatLog;
      }

      if (data.status === "VICTORY") {
        this.goldEarned = data.goldEarned;
        this.expEarned = data.expEarned;
      }

      const charStore = useCharacterStore();
      if (charStore.character) {
        charStore.character.hp = data.playerHp;
      }
    },

    resetBattle() {
      this.status = "IDLE";
      this.enemy = null;
      this.enemyVisual = null;
      this.combatLogs = [];
    },
  },
});