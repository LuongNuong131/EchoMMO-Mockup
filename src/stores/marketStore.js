import { defineStore } from "pinia";
import axiosClient from "../api/axiosClient";
import { useInventoryStore } from "./inventoryStore";
import { useAuthStore } from "./authStore";

export const useMarketStore = defineStore("market", {
  state: () => ({
    shopItems: [],
    playerListings: [],
    myListings: [],
    isLoading: false,
  }),
  actions: {
    async fetchShopItems() {
      const res = await axiosClient.get("/market/shop-items");
      this.shopItems = res.data;
    },
    async fetchPlayerListings() {
      const res = await axiosClient.get("/market/listings");
      this.playerListings = res.data;
    },
    async fetchMyListings() {
      const res = await axiosClient.get("/market/my-listings");
      this.myListings = res.data;
    },

    async buyItem(id, qty) {
      try {
        await axiosClient.post(`/market/buy/${id}`, { quantity: qty });
        alert("Mua xong!");
        this.refresh();
      } catch (e) {
        alert(e.response.data);
      }
    },
    async sellItem(id, qty) {
      try {
        await axiosClient.post(`/market/sell/${id}`, { quantity: qty });
        alert("Bán xong!");
        this.refresh();
      } catch (e) {
        alert(e.response.data);
      }
    },
    async createListing(id, price, qty) {
      try {
        await axiosClient.post("/market/create-listing", {
          userItemId: id,
          price,
          quantity: qty,
        });
        alert("Đăng bán xong!");
        this.refresh();
      } catch (e) {
        alert(e.response.data);
      }
    },
    async cancelListing(id) {
      try {
        await axiosClient.post(`/market/cancel-listing/${id}`);
        alert("Đã hủy!");
        this.refresh();
      } catch (e) {
        alert(e.response.data);
      }
    },
    async buyPlayerListing(id, qty) {
      try {
        await axiosClient.post(`/market/buy-listing/${id}`, { quantity: qty });
        alert("Mua xong!");
        this.refresh();
      } catch (e) {
        alert(e.response.data);
      }
    },

    async refresh() {
      this.fetchShopItems();
      this.fetchPlayerListings();
      this.fetchMyListings();
      useInventoryStore().fetchInventory();
      useAuthStore().fetchProfile();
    },
  },
});
