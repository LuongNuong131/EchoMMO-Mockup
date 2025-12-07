import { defineStore } from "pinia";
import axiosClient from "../api/axiosClient";

export const useAdminStore = defineStore("admin", {
  state: () => ({
    stats: {},
    users: [],
    items: [],
    listings: [],
  }),
  actions: {
    async fetchStats() {
      try {
        const res = await axiosClient.get("/admin/stats");
        this.stats = res.data;
      } catch (e) {
        console.error(e);
      }
    },
    async fetchUsers() {
      try {
        const res = await axiosClient.get("/admin/users");
        this.users = res.data;
      } catch (e) {
        console.error(e);
      }
    },
    async fetchItems() {
      try {
        const res = await axiosClient.get("/admin/items");
        this.items = res.data;
      } catch (e) {
        console.error(e);
      }
    },
    async fetchListings() {
      try {
        const res = await axiosClient.get("/admin/listings");
        this.listings = res.data;
      } catch (e) {
        console.error(e);
      }
    },

    // [MỚI] Logic Ban/Unban chuẩn
    async banUser(id, reason) {
      await axiosClient.post(`/admin/user/ban/${id}`, { reason });
      await this.fetchUsers();
    },
    async unbanUser(id) {
      await axiosClient.post(`/admin/user/unban/${id}`);
      await this.fetchUsers();
    },

    async deleteUser(id) {
      if (confirm("Xóa vĩnh viễn user này?")) {
        await axiosClient.delete(`/admin/user/${id}`);
        this.fetchUsers();
      }
    },
    async deleteItem(id) {
      if (confirm("Xóa item này?")) {
        await axiosClient.delete(`/admin/item/${id}`);
        this.fetchItems();
      }
    },
    async deleteListing(id) {
      await axiosClient.delete(`/admin/listing/${id}`);
      this.fetchListings();
    },

    async grantItem(payload) {
      try {
        await axiosClient.post("/admin/grant-item", payload);
        alert("Gửi vật phẩm thành công!");
      } catch (e) {
        alert(e.response?.data || "Lỗi gửi vật phẩm");
      }
    },

    async sendNotification(payload) {
      try {
        await axiosClient.post("/admin/notification/create", payload);
        alert("📢 Đã phát loa thông báo thành công!");
      } catch (e) {
        alert(e.response?.data || "Lỗi gửi thông báo");
      }
    },
  },
});
