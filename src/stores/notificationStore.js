import { defineStore } from "pinia";
import axiosClient from "../api/axiosClient";

export const useNotificationStore = defineStore("notification", {
  state: () => ({
    notifications: [],
    unreadCount: 0,
    isLoading: false,
  }),
  actions: {
    async fetchNotifications() {
      this.isLoading = true;
      try {
        const res = await axiosClient.get("/notifications");
        this.notifications = res.data;
        await this.fetchUnreadCount(); // Cập nhật số lượng
      } catch (e) {
        console.error(e);
      } finally {
        this.isLoading = false;
      }
    },

    async fetchUnreadCount() {
      try {
        const res = await axiosClient.get("/notifications/unread-count");
        this.unreadCount = res.data;
      } catch (e) {
        console.error(e);
      }
    },

    async markRead(id) {
      try {
        await axiosClient.post(`/notifications/read/${id}`);
        // Update local state cho nhanh
        const noti = this.notifications.find((n) => n.id === id);
        if (noti && !noti.isRead) {
          noti.isRead = true;
          this.unreadCount = Math.max(0, this.unreadCount - 1);
        }
      } catch (e) {
        console.error(e);
      }
    },

    async markAllRead() {
      try {
        await axiosClient.post("/notifications/read-all");
        this.notifications.forEach((n) => (n.isRead = true));
        this.unreadCount = 0;
      } catch (e) {
        console.error(e);
      }
    },
  },
});
