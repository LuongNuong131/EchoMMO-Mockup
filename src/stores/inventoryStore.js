// import { defineStore } from "pinia";
// import axiosClient from "../api/axiosClient";
// import { useCharacterStore } from "./characterStore";

// export const useInventoryStore = defineStore("inventory", {
//   state: () => ({ items: [], isLoading: false }),

//   getters: {
//     equippedItems: (state) => {
//       const slots = {
//         WEAPON: null,
//         ARMOR: null,
//         HELMET: null,
//         BOOTS: null,
//         RING: null,
//         NECKLACE: null,
//       };
//       state.items.forEach((item) => {
//         if (item.isEquipped && slots[item.item.type])
//           slots[item.item.type] = item;
//       });
//       return slots;
//     },
//   },

//   actions: {
//     async fetchInventory() {
//       this.isLoading = true;
//       try {
//         const res = await axiosClient.get("/inventory/me");
//         this.items = res.data;
//       } catch (error) {
//         console.error(error);
//       } finally {
//         this.isLoading = false;
//       }
//     },

//     async equipItem(id) {
//       const charStore = useCharacterStore();
//       try {
//         await axiosClient.post(`/inventory/equip/${id}`);
//         await this.fetchInventory();
//         await charStore.fetchCharacter(); // Cập nhật stats nhân vật
//       } catch (e) {
//         alert(e.response?.data);
//       }
//     },

//     async unequipItem(id) {
//       const charStore = useCharacterStore();
//       try {
//         await axiosClient.post(`/inventory/unequip/${id}`);
//         await this.fetchInventory();
//         await charStore.fetchCharacter();
//       } catch (e) {
//         alert(e.response?.data);
//       }
//     },

//     async useItem(id) {
//       const charStore = useCharacterStore();
//       try {
//         const res = await axiosClient.post(`/inventory/use/${id}`);
//         alert(res.data);
//         await this.fetchInventory();
//         await charStore.fetchCharacter();
//       } catch (e) {
//         alert(e.response?.data);
//       }
//     },
//   },
// });

// =========================================================================================

//code test
import { defineStore } from "pinia";
import axiosClient from "../api/axiosClient";
import { useCharacterStore } from "./characterStore";

export const useInventoryStore = defineStore("inventory", {
  state: () => ({
    items: [],
    isLoading: false
  }),

  getters: {
    equippedItems: (state) => {
      const slots = {
        WEAPON: null, ARMOR: null, HELMET: null,
        BOOTS: null, RING: null, NECKLACE: null,
      };
      state.items.forEach((item) => {
        // item.item.type vì cấu trúc UserItem -> Item
        const type = item.item?.type;
        if (item.isEquipped && Object.prototype.hasOwnProperty.call(slots, type)) {
          slots[type] = item;
        }
      });
      return slots;
    },
  },

  actions: {
    async fetchInventory() {
      this.isLoading = true;
      try {
        const res = await axiosClient.get("/inventory/me");
        this.items = res.data;
      } catch (error) {
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },

    async equipItem(id) {
      const charStore = useCharacterStore();
      try {
        await axiosClient.post(`/inventory/equip/${id}`);
        await this.fetchInventory();
        await charStore.fetchCharacter(); // Cập nhật stats nhân vật
      } catch (e) {
        alert(e.response?.data || "Lỗi trang bị");
      }
    },

    async unequipItem(id) {
      const charStore = useCharacterStore();
      try {
        await axiosClient.post(`/inventory/unequip/${id}`);
        await this.fetchInventory();
        await charStore.fetchCharacter();
      } catch (e) {
        alert(e.response?.data || "Lỗi tháo đồ");
      }
    },

    async useItem(id) {
      const charStore = useCharacterStore();
      try {
        const res = await axiosClient.post(`/inventory/use/${id}`);
        alert(res.data);
        await this.fetchInventory();
        await charStore.fetchCharacter();
      } catch (e) {
        alert(e.response?.data || "Lỗi sử dụng");
      }
    },
  },
});